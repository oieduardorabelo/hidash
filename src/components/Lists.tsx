type TList = { children: React.ReactNode };
export const List = ({ children }: TList) => {
  return <ul className="list-auto">{children}</ul>;
};

type TListItem = { children: React.ReactNode } & React.LiHTMLAttributes<HTMLLIElement>;
export const ListItem = ({ children, className }: TListItem) => {
  return <li className={`flex items-center ${className}`}>{children}</li>;
};

type TItemFixed = { as?: string; children: React.ReactNode; htmlFor?: string; className?: string };
export const ItemFixed = ({ children, as = "b", htmlFor, className }: TItemFixed) => {
  const CustomTag = `${as}` as keyof JSX.IntrinsicElements;
  const attrs: TItemFixed = {
    className: `inline-flex w-[6rem] font-bold ${className}`,
    children,
  };
  if (htmlFor) {
    attrs.htmlFor = htmlFor;
  }
  return <CustomTag {...attrs} />;
};
