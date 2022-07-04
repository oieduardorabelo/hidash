import { SyntheticEvent } from "react";
import { CustomerStatus } from "@prisma/client";
import { useRouter } from "next/router";

import { BeanLoading, BeanServerError } from "~/components/Beans";
import { ListZodErrors } from "~/components/ListZodErrors";
import { NextPageWithLayout } from "~/pages/_app";
import { Form, FormInput, FormSelect } from "~/components/Forms";
import { trpc } from "~/utils/trpc";

const CustomerNewPage: NextPageWithLayout = () => {
  const router = useRouter();
  const addCustomer = trpc.useMutation("customer.create", {
    async onSuccess({ id }) {
      await router.push(`/customer/${id}`);
    },
  });

  const handleBeans = () => {
    if (addCustomer.isError && addCustomer?.error?.data?.httpStatus && addCustomer?.error?.data?.httpStatus >= 500) {
      return <BeanServerError />;
    }

    if (addCustomer.isLoading) {
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
    const input = {
      status: $elements.status.value as CustomerStatus,
      name: $elements.name.value,
    };
    try {
      await addCustomer.mutateAsync(input);
    } catch {}
  }

  return (
    <>
      <h1 className="mb-4 flex items-center text-3xl">
        <span className="mr-4">Add Customer</span>
        {handleBeans()}
      </h1>
      <ListZodErrors classNames="mb-4" errors={addCustomer.error?.data?.zodError?.fieldErrors} />
      <Form name="Customer" onSubmit={onSubmit} disabled={addCustomer.isLoading}>
        <FormInput label="Name" type="text" placeholder="e.g., John Doe Acme" />
        <FormSelect
          label="Status"
          options={[
            { value: "ACTIVE", label: "Active" },
            { value: "NON_ACTIVE", label: "Non Active" },
            { value: "LEAD", label: "Lead" },
            { value: "INVALID_EXAMPLE", label: "Invalid Example" },
          ]}
        />
      </Form>
    </>
  );
};

export default CustomerNewPage;
