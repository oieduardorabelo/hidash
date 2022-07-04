import { SalesRecord } from "@prisma/client";
import { useRouter } from "next/router";
import Link from "next/link";
import NextError from "next/error";
import { UrlObject } from "url";

import { Beans, BeanLoading, createCustomerBeanColor, createSalesRecordBeanColor } from "~/components/Beans";
import { formatDateDisplay } from "~/utils/formatDateDisplay";
import { NextPageWithLayout } from "~/pages/_app";
import { Pagination } from "~/components/Pagination";
import { List, ListItem, ItemFixed } from "~/components/Lists";
import { Table, TableHead, TableHeadItem, TableBody, TableBodyItem } from "~/components/Tables";
import { trpc } from "~/utils/trpc";

const CustomerViewPage: NextPageWithLayout = () => {
  const router = useRouter();
  const routerPush = (options: UrlObject) => router.push(options, undefined, { scroll: false });
  const { id, page = "0" } = router.query;
  const customerQuery = trpc.useQuery(
    [
      "customer.read",
      {
        id: id as string,
        salesRecordPage: Number(page) - 1 < 0 ? 0 : Number(page) - 1,
      },
    ],
    {
      keepPreviousData: true,
      async onSuccess({ salesRecordTotal, salesRecordPage }) {
        const pages = Math.ceil(salesRecordTotal / salesRecordPage);
        if (Number(page) > pages) {
          routerPush({ query: { ...router.query, page: pages } });
        }
      },
    },
  );

  if (customerQuery.error) {
    return <NextError title={customerQuery.error.message} statusCode={customerQuery.error.data?.httpStatus ?? 500} />;
  }

  const isLoading = customerQuery.isLoading || customerQuery.isRefetching;

  return (
    <>
      <section className="mb-16">
        <h1 className="mb-4 flex items-center text-3xl">
          <span className="mr-4">Customer Details</span>
          {isLoading && <BeanLoading />}
        </h1>
        <List>
          <ListItem>
            <ItemFixed>Name:</ItemFixed>
            <span>{customerQuery.data?.customer?.name}</span>
          </ListItem>
          <ListItem>
            <ItemFixed>Created:</ItemFixed>
            <span>{formatDateDisplay(customerQuery.data?.customer?.createdAt)}</span>
          </ListItem>
          <ListItem>
            <ItemFixed>Status:</ItemFixed>
            <Beans color={createCustomerBeanColor(customerQuery.data?.customer?.status)}>
              {customerQuery.data?.customer?.status}
            </Beans>
          </ListItem>
          <ListItem>
            <Link href={`/customer/${id}/edit`}>
              <a className="btn">Change</a>
            </Link>
          </ListItem>
        </List>
      </section>

      <section>
        <h1 className="mb-4 text-3xl">Customer Sales List {createTagLine(customerQuery?.data?.salesRecordTotal)}</h1>
        <Pagination
          page={customerQuery?.data?.salesRecordPage}
          total={customerQuery?.data?.salesRecordTotal}
          pageBy={customerQuery?.data?.salesRecordPageBy}
          onClick={(page) => (e) => {
            e.preventDefault();
            routerPush({ query: { ...router.query, page } });
          }}
        />
        <Table classNames="mb-4">
          <TableHead>
            <TableHeadItem>Name</TableHeadItem>
            <TableHeadItem>Status</TableHeadItem>
            <TableHeadItem>Created At</TableHeadItem>
            <TableHeadItem>
              <span className="sr-only">Actions</span>
            </TableHeadItem>
          </TableHead>
          <TableBody
            data={customerQuery?.data?.salesRecords}
            whenNoResults={{ colSpan: 4, value: "No results found" }}
            render={(item: SalesRecord) => {
              return (
                <>
                  <TableBodyItem classNames="text-white">{item.name}</TableBodyItem>
                  <TableBodyItem>
                    <Beans color={createSalesRecordBeanColor(item.status)}>{item.status}</Beans>
                  </TableBodyItem>
                  <TableBodyItem>{formatDateDisplay(item.createdAt)}</TableBodyItem>
                  <TableBodyItem>
                    <Link href={`/salesrecord/${item.id}/edit`}>
                      <a className="btn-link">Change</a>
                    </Link>
                  </TableBodyItem>
                </>
              );
            }}
          />
        </Table>
        <List>
          <ListItem>
            <Link href={`/customer/${id}/salesrecord/new`}>
              <a className="btn">Add Sales</a>
            </Link>
          </ListItem>
        </List>
      </section>
    </>
  );
};

export default CustomerViewPage;

function createTagLine(salesRecordTotal = 0) {
  switch (true) {
    case salesRecordTotal < 1: {
      return "";
    }
    case salesRecordTotal === 1: {
      return `(${salesRecordTotal} opportunity)`;
    }
    case salesRecordTotal > 1: {
      return `(${salesRecordTotal} opportunities)`;
    }
    default: {
      console.log(`Missing TagLine case with "${salesRecordTotal}"`);
    }
  }
}
