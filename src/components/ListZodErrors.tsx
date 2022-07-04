export const ListZodErrors = ({
  classNames,
  errors,
}: {
  classNames?: string;
  errors: null | undefined | Record<string, string | string[] | undefined>;
}) => {
  if (errors === null || typeof errors === "undefined") {
    return null;
  }

  return (
    <ul className={`bg-red-100 p-4 text-red-800 ${classNames}`}>
      {Object.entries(errors).map(([key, value]) => {
        return (
          <li key={key}>
            <b className="mr-2">{key}:</b>
            <span>{value}</span>
          </li>
        );
      })}
    </ul>
  );
};
