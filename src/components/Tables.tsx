type TTable = { children: React.ReactNode; classNames?: string };
export const Table = ({ children, classNames }: TTable) => {
  return (
    <div className={`relative mt-4 overflow-x-auto ${classNames}`}>
      <table className="w-full min-w-[40rem] table-fixed text-left text-sm text-gray-500 dark:text-gray-400">
        {children}
      </table>
    </div>
  );
};

type TTableHead = { children: React.ReactNode };
export const TableHead = ({ children }: TTableHead) => {
  return (
    <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
      <tr>{children}</tr>
    </thead>
  );
};

type TTableHeadItem = { children: React.ReactNode };
export const TableHeadItem = ({ children }: TTableHeadItem) => {
  return (
    <th scope="col" className="px-6 py-3">
      {children}
    </th>
  );
};

type TBody = { data: any; whenNoResults: { colSpan: number; value: React.ReactNode }; render: any };
export const TableBody = ({ data, whenNoResults, render }: TBody) => {
  if (!data || data.length === 0) {
    return (
      <tbody>
        <tr>
          <td scope="row" colSpan={whenNoResults.colSpan} className="bg-gray-800 p-4 text-center text-xl">
            {whenNoResults.value}
          </td>
        </tr>
      </tbody>
    );
  }
  return (
    <tbody>
      {data.map((item: any) => {
        return (
          <tr
            key={item.id}
            className="border-b odd:bg-white even:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 odd:dark:bg-gray-800 even:dark:bg-gray-700"
          >
            {render(item)}
          </tr>
        );
      })}
    </tbody>
  );
};

type TTableBodyItem = { children: React.ReactNode; classNames?: string };
export const TableBodyItem = ({ children, classNames }: TTableBodyItem) => {
  return (
    <td scope="row" className={`px-6 py-4 ${classNames}`}>
      {children}
    </td>
  );
};
