type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
}

export default function Button({
  children,
  type = "button",
  disabled = false,
}: ButtonProps){
  return (
    <button
      type={type}
      disabled={disabled}
      className="
        w-full
        bg-orange-500
        hover:bg-orange
        transition
        duration-200
        text-white
        font-semibold
        py-3
        rounded-lg
        disabled:opacity-50
        disabled:cursor-not-allowed
      "
    >
      {children}
    </button>
  )
}