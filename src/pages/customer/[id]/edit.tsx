import { SyntheticEvent } from "react";
import { CustomerStatus } from "@prisma/client";
import { useRouter } from "next/router";
import Link from "next/link";
import NextError from "next/error";

import { BeanLoading } from "~/components/Beans";
import { ListZodErrors } from "~/components/ListZodErrors";
import { Breadcrumbs } from "~/components/Breadcrumbs";
import { NextPageWithLayout } from "~/pages/_app";
import { trpc } from "~/utils/trpc";
import { Button } from "~/components/Buttons";
import { Form, FormInput, FormSelect } from "~/components/Forms";
import { List, ListItem } from "~/components/Lists";

const CustomerEditPage: NextPageWithLayout = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const utils = trpc.useContext();
  const customerQuery = trpc.useQuery(["customer.read", { id }]);
  const deleteDustomerQuery = trpc.useMutation("customer.delete", {
    async onSuccess() {
      await utils.invalidateQueries(["customer.all"]);
      await router.push(`/`);
    },
  });
  const updateCustomerQuery = trpc.useMutation("customer.update", {
    async onSuccess() {
      await utils.invalidateQueries(["customer.read", { id }]);
      await router.push(`/customer/${id}`);
    },
  });

  if (customerQuery.error) {
    return <NextError title={customerQuery.error.message} statusCode={customerQuery.error.data?.httpStatus ?? 500} />;
  }

  if (customerQuery.status !== "success") {
    return <>Loading...</>;
  }

  async function onSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const $form = e.target as HTMLFormElement;
    const $elements = $form.elements as HTMLFormControlsCollection & {
      name: HTMLInputElement;
      status: HTMLInputElement;
    };
    const input = {
      id,
      status: $elements.status.value as CustomerStatus,
    };
    try {
      await updateCustomerQuery.mutateAsync(input);
    } catch {}
  }

  async function onClickDelete(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    try {
      await deleteDustomerQuery.mutateAsync({ id });
    } catch {}
  }

  const isLoading = customerQuery.isLoading || updateCustomerQuery.isLoading || deleteDustomerQuery.isLoading;

  return (
    <>
      <Breadcrumbs>
        <Link href={`/customer/${id}`}>
          <a>Customer Page</a>
        </Link>
      </Breadcrumbs>
      <h1 className="mb-4 flex items-center text-3xl">
        <span className="mr-4">Change Customer Details</span>
        {isLoading && <BeanLoading />}
      </h1>
      <ListZodErrors classNames="mb-4" errors={updateCustomerQuery.error?.data?.zodError?.fieldErrors} />
      <Form className="mb-4" name="Customer" onSubmit={onSubmit} disabled={isLoading}>
        <ListItem className="text-sm text-red-600">* You can not modify the customer name</ListItem>
        <FormInput
          label="Name"
          type="text"
          placeholder="e.g., John Doe Acme"
          defaultValue={customerQuery.data.customer.name}
          disabled={true}
        />
        <FormSelect
          label="Status"
          defaultValue={customerQuery.data.customer.status}
          options={[
            { value: "ACTIVE", label: "Active" },
            { value: "NON_ACTIVE", label: "Non Active" },
            { value: "LEAD", label: "Lead" },
            { value: "INVALID_EXAMPLE", label: "Invalid Example" },
          ]}
        />
      </Form>
      <List>
        <ListItem>
          <Button className="btn-danger" type="button" onClick={onClickDelete} disabled={isLoading}>
            Delete Customer
          </Button>
        </ListItem>
      </List>
    </>
  );
};

export default CustomerEditPage;
