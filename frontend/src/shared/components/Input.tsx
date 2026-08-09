import type { InputHTMLAttributes } from "react";


type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export default function Input({
  label,
  error,
  ...props
}: InputProps){
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-300">
        {label}
      </label>

      <input
        {...props}
        className={`
          bg-slate-800
          border
          border-slate-700
          rounded-lg
          px-4
          py-3
          text-white
          outline-none
          transition
          ${
            error
              ? "border-red-500"
              : "border-slate-700 focus:border-orange-500"
          }
          focus:border-orange-500
        `}
      />
      {error && (
        <p className="text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}