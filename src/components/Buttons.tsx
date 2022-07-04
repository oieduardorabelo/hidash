type TButton = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className, children, ...attrs }: TButton) {
  return (
    <button className={`btn ${className}`} {...attrs}>
      {children}
    </button>
  );
}
