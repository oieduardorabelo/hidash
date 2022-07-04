import { Button } from "~/components/Buttons";

export function Pagination({
  page,
  total,
  pageBy,
  onClick,
}: {
  page?: string | number;
  total?: string | number;
  pageBy?: string | number;
  onClick?: (index: number) => React.MouseEventHandler<HTMLButtonElement>;
}) {
  if (typeof page === "undefined" || typeof total === "undefined" || typeof pageBy === "undefined") {
    return null;
  }

  if (total <= 0) {
    return null;
  }

  const numPage = Number(page);
  const pages = Math.ceil(Number(total) / Number(pageBy));

  if (numPage > pages) {
    return null;
  }

  let startSlice = numPage > 0 ? numPage - 1 : numPage;

  if (numPage === pages - 1 && startSlice > 0) {
    startSlice = startSlice - 1;
  }
  const endSlice = startSlice + 3;

  const pagePlusOne = numPage + 1;

  return (
    <>
      <div className="mb-2 text-center">
        Showing page {pagePlusOne} of {pages}
      </div>
      {pages && (
        <ul className="flex justify-center">
          {startSlice > 0 && (
            <li className="flex items-end">
              <Button type="button" onClick={onClick ? onClick(1) : undefined}>
                {1}
              </Button>
              <b className="mx-2">...</b>
            </li>
          )}
          {Array.from({ length: pages }, (_, index) => ++index)
            .slice(startSlice, endSlice)
            .map((pageItem) => {
              return (
                <li key={pageItem} className="mx-1 inline">
                  <Button
                    type="button"
                    className={pagePlusOne === pageItem ? "bg-indigo-900" : "bg-indigo-600"}
                    onClick={onClick ? onClick(pageItem) : undefined}
                  >
                    {pageItem}
                  </Button>
                </li>
              );
            })}
          {endSlice < pages && (
            <li className="flex items-end">
              <b className="mx-2">...</b>
              <Button type="button" onClick={onClick ? onClick(pages) : undefined}>
                {pages}
              </Button>
            </li>
          )}
        </ul>
      )}
    </>
  );
}
