Here's a simple background reaper thread you can start alongside your app. It periodically scans for any `judge-*` containers that have been running too long (meaning something went wrong and they weren't cleaned up) and force-removes them.

**`container_reaper.py`**

```python
import subprocess
import threading
import time
from datetime import datetime, timezone


def _list_stale_judge_containers(max_age_seconds: float) -> list[str]:
    """
    Return container IDs of any judge-* containers that have been
    running longer than max_age_seconds.
    """
    # Ask Docker for id + name + started-at, filtered to our naming scheme
    result = subprocess.run(
        [
            "docker", "ps",
            "--filter", "name=judge-",
            "--filter", "status=running",
            "--format", "{{.ID}}\t{{.Names}}\t{{.RunningFor}}",
        ],
        capture_output=True,
        text=True,
    )

    if result.returncode != 0 or not result.stdout.strip():
        return []

    # RunningFor is a human string like "5 seconds ago" - not precise enough
    # to threshold reliably, so instead query StartedAt per container.
    stale_ids = []
    now = datetime.now(timezone.utc)

    for line in result.stdout.strip().splitlines():
        container_id = line.split("\t")[0]

        inspect = subprocess.run(
            [
                "docker", "inspect",
                "--format", "{{.State.StartedAt}}",
                container_id,
            ],
            capture_output=True,
            text=True,
        )

        if inspect.returncode != 0:
            continue

        started_at_str = inspect.stdout.strip()
        try:
            # Docker's StartedAt looks like: 2026-08-15T10:23:45.123456789Z
            # Python's fromisoformat can't handle nanosecond precision or
            # trailing Z directly on older versions, so normalize it.
            started_at_str = started_at_str.replace("Z", "+00:00")
            if "." in started_at_str:
                head, rest = started_at_str.split(".", 1)
                frac, tz = rest[:6], rest[6:] if len(rest) > 6 else "+00:00"
                started_at_str = f"{head}.{frac}{tz}"
            started_at = datetime.fromisoformat(started_at_str)
        except ValueError:
            continue

        age_seconds = (now - started_at).total_seconds()
        if age_seconds > max_age_seconds:
            stale_ids.append(container_id)

    return stale_ids


def _reap_once(max_age_seconds: float):
    for container_id in _list_stale_judge_containers(max_age_seconds):
        subprocess.run(["docker", "kill", container_id], capture_output=True)
        subprocess.run(["docker", "rm", "-f", container_id], capture_output=True)


def start_reaper(
    max_age_seconds: float = 10.0,
    interval_seconds: float = 5.0,
) -> threading.Thread:
    """
    Start a daemon thread that periodically force-removes any judge-*
    container that's been running longer than max_age_seconds.

    max_age_seconds should be comfortably larger than your judge timeout
    (e.g. 2x-3x it) so you never kill a container that's just legitimately
    still executing.
    """
    def _loop():
        while True:
            try:
                _reap_once(max_age_seconds)
            except Exception:
                # Never let the reaper thread die from a transient docker error
                pass
            time.sleep(interval_seconds)

    thread = threading.Thread(target=_loop, daemon=True)
    thread.start()
    return thread
```

**Wiring it into your app startup**, e.g. in FastAPI:

```python
from fastapi import FastAPI
from app.services.container_reaper import start_reaper

app = FastAPI()

@app.on_event("startup")
def on_startup():
    # judge timeout is ~2s, so 10s max_age gives generous headroom
    start_reaper(max_age_seconds=10.0, interval_seconds=5.0)
```

A few notes:

- **`daemon=True`** means the thread won't block your process from exiting; it just dies with the main process.
- **`max_age_seconds` should be set well above your actual judge timeout** (e.g. 2–3x) — this reaper is a backstop for containers that survived past when they *should* have been killed, not a substitute for your existing per-request timeout/kill logic. Set it too tight and you risk killing a container that's legitimately still finishing up under load.
- This uses `docker ps` + `docker inspect` rather than parsing `RunningFor` (like `"5 seconds ago"`), since that field is a fuzzy human string and not safe to threshold precisely.
- If you'd rather not run a background thread inside your app process, the same logic works fine as a standalone cron job (e.g. a `reap.py` script run via `cron` every 30s) — just call `_reap_once(max_age_seconds)` directly instead of wrapping it in a thread loop.