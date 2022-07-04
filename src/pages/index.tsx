import { ChangeEvent } from "react";
import { Customer, SalesRecord } from "@prisma/client";
import { trpc } from "~/utils/trpc";
import { useRouter } from "next/router";
import { UrlObject } from "url";
import debounce from "just-debounce-it";
import Link from "next/link";

import { NextPageWithLayout } from "~/pages/_app";
import { BeanLoading, Beans, BeanServerError } from "~/components/Beans";
import { Pagination } from "~/components/Pagination";
import { List, ListItem, ItemFixed } from "~/components/Lists";
import { FormSelect } from "~/components/Forms";
import { IconMagGlass } from "~/components/Icons";
import { Table, TableHead, TableHeadItem, TableBody, TableBodyItem } from "~/components/Tables";

const IndexPage: NextPageWithLayout = () => {
  const router = useRouter();
  const routerPush = (options: UrlObject) => router.push(options, undefined, { scroll: false });
  const { sortBy = "name", sortOrder = "asc", filterBy = "name", filterContains = "", page = "0" } = router.query;
  const customersQuery = trpc.useQuery(
    [
      "customer.all",
      {
        sortBy: sortBy as string,
        sortOrder: sortOrder as string,
        filterBy: filterBy as string,
        filterContains: filterContains as string,
        page: Number(page) - 1 < 0 ? 0 : Number(page) - 1,
      },
    ],
    {
      keepPreviousData: true,
      async onSuccess({ total, pageBy }) {
        const pages = Math.ceil(total / pageBy);
        if (Number(page) > pages) {
          routerPush({ query: { ...router.query, page: pages } });
        }
      },
    },
  );

  const handleBeans = () => {
    if (customersQuery.isRefetching || customersQuery.isLoading) {
      return <BeanLoading />;
    }

    if (
      customersQuery.isError &&
      customersQuery?.error?.data?.httpStatus &&
      customersQuery?.error?.data?.httpStatus >= 500
    ) {
      return <BeanServerError />;
    }
  };

  return (
    <>
      <h1 className="flex items-center text-3xl">
        <span className="mr-4">Customer List</span>
        {handleBeans()}
      </h1>
      <div className="my-4">
        <p className="mb-4 text-lg">Customizer your search options</p>
        <List>
          <ListItem>
            <ItemFixed as="label" htmlFor="sortByName">
              Sort In:
            </ItemFixed>
            <label className="mr-4">
              <input
                className="mr-1"
                type="radio"
                name="sortByName"
                id="sortByName"
                checked={sortBy === "name"}
                onChange={(e) => {
                  e.preventDefault();
                  routerPush({ query: { ...router.query, sortBy: "name" } });
                }}
              />
              <span>Name</span>
            </label>
            <label>
              <input
                className="mr-1"
                type="radio"
                name="sortByStatus"
                id="sortByStatus"
                checked={sortBy === "status"}
                onChange={(e) => {
                  e.preventDefault();
                  routerPush({ query: { ...router.query, sortBy: "status" } });
                }}
              />
              <span>Status</span>
            </label>
          </ListItem>
          <FormSelect
            label="Order"
            defaultValue={sortOrder}
            onChange={(e) => {
              e.preventDefault();
              routerPush({ query: { ...router.query, sortOrder: e.target.value } });
            }}
            options={[
              { value: "asc", label: "Ascending" },
              { value: "desc", label: "Descending" },
            ]}
          />
          <ListItem>
            <ItemFixed as="label" htmlFor="filterByName">
              Filter In:
            </ItemFixed>
            <label className="mr-4">
              <input
                className="mr-1"
                type="radio"
                name="filterByName"
                id="filterByName"
                checked={filterBy === "name"}
                onChange={(e) => {
                  e.preventDefault();
                  routerPush({ query: { ...router.query, filterBy: "name" } });
                }}
              />
              <span>Name</span>
            </label>
            <label>
              <input
                className="mr-1"
                type="radio"
                name="filterByStatus"
                id="filterByStatus"
                checked={filterBy === "status"}
                onChange={(e) => {
                  e.preventDefault();
                  routerPush({ query: { ...router.query, filterBy: "status" } });
                }}
              />
              <span>Status</span>
            </label>
          </ListItem>
          <ListItem>
            <ItemFixed as="label" htmlFor="table-search">
              Filter By:
            </ItemFixed>
            <div className="relative w-1/3">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <IconMagGlass />
              </div>
              <input
                type="text"
                id="table-search"
                className="form-control w-full pl-10"
                placeholder="Search for items"
                onChange={debounce((e: ChangeEvent<HTMLInputElement>) => {
                  e.preventDefault();
                  routerPush({ query: { ...router.query, filterContains: e.target.value } });
                }, 500)}
              />
            </div>
          </ListItem>
        </List>
      </div>
      <Pagination
        page={customersQuery?.data?.page}
        total={customersQuery?.data?.total}
        pageBy={customersQuery?.data?.pageBy}
        onClick={(page) => (e) => {
          e.preventDefault();
          routerPush({ query: { ...router.query, page } });
        }}
      />
      <Table>
        <TableHead>
          <TableHeadItem>Name</TableHeadItem>
          <TableHeadItem>Status</TableHeadItem>
          <TableHeadItem>Sales Number</TableHeadItem>
          <TableHeadItem>
            <span className="sr-only">Actions</span>
          </TableHeadItem>
        </TableHead>
        <TableBody
          data={customersQuery?.data?.customers}
          whenNoResults={{ colSpan: 4, value: "No results found" }}
          render={(item: Customer & { sales?: SalesRecord[] }) => {
            return (
              <>
                <TableBodyItem>
                  <Link href={`/customer/${item.id}`}>
                    <a className="btn-link">{item.name}</a>
                  </Link>
                </TableBodyItem>
                <TableBodyItem>
                  <Beans color={item.status === "ACTIVE" ? "green" : item.status === "LEAD" ? "gold" : "red"}>
                    {item.status}
                  </Beans>
                </TableBodyItem>
                <TableBodyItem>{item.sales?.length}</TableBodyItem>
                <TableBodyItem>
                  <Link href={`/customer/${item.id}/edit`}>
                    <a className="btn-link">Change</a>
                  </Link>
                </TableBodyItem>
              </>
            );
          }}
        />
      </Table>
    </>
  );
};

export default IndexPage;
