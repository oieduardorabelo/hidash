import { SyntheticEvent } from "react";
import { SalesRecordStatus } from "@prisma/client";
import { useRouter } from "next/router";
import Link from "next/link";
import NextError from "next/error";

import { BeanLoading } from "~/components/Beans";
import { NextPageWithLayout } from "~/pages/_app";
import { ListZodErrors } from "~/components/ListZodErrors";
import { Breadcrumbs } from "~/components/Breadcrumbs";
import { List, ListItem } from "~/components/Lists";
import { Button } from "~/components/Buttons";
import { Form, FormInput, FormSelect } from "~/components/Forms";
import { trpc } from "~/utils/trpc";

const SalesRecordEditPage: NextPageWithLayout = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const salesRecordQuery = trpc.useQuery(["salesRecord.read", { id }]);
  const deleteSalesRecordQuery = trpc.useMutation("salesRecord.delete", {
    async onSuccess() {
      if (salesRecordQuery.data) {
        router.push(`/customer/${salesRecordQuery.data.customer.id}`);
      }
    },
  });
  const updateSalesRecordQuery = trpc.useMutation("salesRecord.update", {
    async onSuccess() {
      if (salesRecordQuery.data) {
        router.push(`/customer/${salesRecordQuery.data.customer.id}`);
      }
    },
  });

  if (salesRecordQuery.error) {
    return (
      <NextError title={salesRecordQuery.error.message} statusCode={salesRecordQuery.error.data?.httpStatus ?? 500} />
    );
  }

  if (salesRecordQuery.status !== "success") {
    return <>Loading...</>;
  }

  async function onSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const $form = e.target as HTMLFormElement;
    const $elements = $form.elements as HTMLFormControlsCollection & {
      name: HTMLInputElement;
      status: HTMLInputElement;
    };
    const $status: HTMLInputElement = $elements.status;
    const input = {
      id,
      status: $status.value as SalesRecordStatus,
    };
    try {
      await updateSalesRecordQuery.mutateAsync(input);
    } catch {}
  }

  async function onClickDelete(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    try {
      await deleteSalesRecordQuery.mutateAsync({ id });
    } catch {}
  }

  const isLoading = updateSalesRecordQuery.isLoading || deleteSalesRecordQuery.isLoading;

  return (
    <>
      <Breadcrumbs>
        <Link href={`/customer/${salesRecordQuery.data?.customer.id}`}>
          <a>Customer Page</a>
        </Link>
      </Breadcrumbs>
      <h1 className="mb-4 flex items-center text-3xl">
        <span className="mr-4">Change Sales Record Details</span>
        {isLoading && <BeanLoading />}
      </h1>
      <ListZodErrors classNames="mb-4" errors={updateSalesRecordQuery.error?.data?.zodError?.fieldErrors} />
      <Form className="mb-4" name="Sales Record" onSubmit={onSubmit} disabled={isLoading}>
        <ListItem className="text-sm text-red-600">* You can not modify the sales record name</ListItem>
        <FormInput
          label="Name"
          type="text"
          placeholder="e.g., Company Name Acme"
          defaultValue={salesRecordQuery.data.name}
          disabled={true}
        />
        <FormSelect
          label="Status"
          defaultValue={salesRecordQuery.data.status}
          options={[
            { value: "NEW", label: "New" },
            { value: "CLOSED_WON", label: "Closed Won" },
            { value: "CLOSED_LOST", label: "Closed Lost" },
            { value: "INVALID_EXAMPLE", label: "Invalid Example" },
          ]}
        />
      </Form>
      <List>
        <ListItem>
          <Button className="btn-danger" type="button" onClick={onClickDelete} disabled={isLoading}>
            Delete Sales Record
          </Button>
        </ListItem>
      </List>
    </>
  );
};

export default SalesRecordEditPage;
