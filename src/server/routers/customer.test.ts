/**
 * Integration test example for the `customer` router
 */
import { appRouter } from "~/server/routers/_app";
import { createContextInner } from "~/server/context";
import { inferMutationInput } from "~/utils/trpc";

test("add and get customer", async () => {
  const ctx = await createContextInner({});
  const caller = appRouter.createCaller(ctx);

  const input: inferMutationInput<"customer.create"> = {
    name: "hello test",
    status: "ACTIVE",
  };
  const customer = await caller.mutation("customer.create", input);
  const read = await caller.query("customer.read", {
    id: customer.id,
  });

  expect(read.customer).toMatchObject(input);
});
