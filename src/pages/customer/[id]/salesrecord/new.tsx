import { SyntheticEvent } from "react";
import { useRouter } from "next/router";
import { SalesRecordStatus } from "@prisma/client";
import Link from "next/link";

import { NextPageWithLayout } from "~/pages/_app";
import { BeanLoading, BeanServerError } from "~/components/Beans";
import { ListZodErrors } from "~/components/ListZodErrors";
import { Breadcrumbs } from "~/components/Breadcrumbs";
import { Form, FormInput, FormSelect } from "~/components/Forms";
import { trpc } from "~/utils/trpc";

const CustomerSalesRecordNewPage: NextPageWithLayout = () => {
  const router = useRouter();
  const utils = trpc.useContext();
  const customerId = router.query.id as string;
  const addSalesRecord = trpc.useMutation("salesRecord.create", {
    async onSuccess() {
      await utils.invalidateQueries(["customer.read", { id: customerId }]);
      await router.push(`/customer/${customerId}`);
    },
  });
  const handleBeans = () => {
    if (
      addSalesRecord.isError &&
      addSalesRecord?.error?.data?.httpStatus &&
      addSalesRecord?.error?.data?.httpStatus >= 500
    ) {
      return <BeanServerError />;
    }

    if (addSalesRecord.isLoading) {
      return <BeanLoading />;
    }
  };

  async function onSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const $form = e.target as HTMLFormElement;
    const $elements = $form.elements as HTMLFormControlsCollection & {
      name: HTMLInputElement;
      status: HTMLInputElement;
    };
    const $name: HTMLInputElement = $elements.name;
    const $status: HTMLInputElement = $elements.status;
    const input = {
      status: $status.value as SalesRecordStatus,
      name: $name.value,
      customerId,
    };
    try {
      await addSalesRecord.mutateAsync(input);
    } catch {}
  }

  return (
    <>
      <Breadcrumbs>
        <Link href={`/customer/${customerId}`}>
          <a>Customer Page</a>
        </Link>
      </Breadcrumbs>
      <h1 className="mb-4 flex items-center text-3xl">
        <span className="mr-4">Add Sales</span>
        {handleBeans()}
      </h1>
      <ListZodErrors classNames="mb-4" errors={addSalesRecord.error?.data?.zodError?.fieldErrors} />
      <Form name="Sales" onSubmit={onSubmit} disabled={addSalesRecord.isLoading}>
        <FormInput label="Name" type="text" placeholder="e.g., Company Name Acme" />
        <FormSelect
          label="Status"
          options={[
            { value: "NEW", label: "New" },
            { value: "CLOSED_WON", label: "Closed Won" },
            { value: "CLOSED_LOST", label: "Closed Lost" },
            { value: "INVALID_EXAMPLE", label: "Invalid Example" },
          ]}
        />
      </Form>
    </>
  );
};

export default CustomerSalesRecordNewPage;
