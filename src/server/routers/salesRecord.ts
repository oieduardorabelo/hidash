import { Prisma, SalesRecordStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "~/server/createRouter";
import { prisma } from "~/server/prisma";

const defaultSalesRecordSelect = Prisma.validator<Prisma.SalesRecordSelect>()({
  id: true,
  status: true,
  name: true,
  createdAt: true,
  updatedAt: true,
});

const SalesRecordStatusUnion = z.union(
  [z.literal(SalesRecordStatus.CLOSED_LOST), z.literal(SalesRecordStatus.CLOSED_WON), z.literal(SalesRecordStatus.NEW)],
  {
    errorMap() {
      const message = `Status must be one of New, Closed Won or Closed Lost`;
      return { message };
    },
  },
);

export const salesRecordRouter = createRouter()
  // ======================================
  // CREATE
  // ======================================
  .mutation("create", {
    input: z.object({
      status: SalesRecordStatusUnion,
      name: z.string().min(3),
      customerId: z.string().uuid(),
    }),
    async resolve({ input }) {
      const item = await prisma.salesRecord.create({
        data: input,
        select: defaultSalesRecordSelect,
      });
      return item;
    },
  })
  // ======================================
  // READ
  // ======================================
  .query("read", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      const item = await prisma.salesRecord.findUnique({
        where: { id },
        select: { ...defaultSalesRecordSelect, customer: true },
      });
      if (!item) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Record not found with id '${id}'`,
        });
      }
      return item;
    },
  })
  // ======================================
  // UPDATE
  // ======================================
  .mutation("update", {
    input: z.object({
      id: z.string().uuid(),
      status: SalesRecordStatusUnion,
    }),
    async resolve({ input }) {
      const { id, status } = input;
      const item = await prisma.salesRecord.update({
        where: { id },
        data: { status },
        select: defaultSalesRecordSelect,
      });
      return item;
    },
  })
  // ======================================
  // DELETE
  // ======================================
  .mutation("delete", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      await prisma.salesRecord.delete({ where: { id } });
      return {
        id,
      };
    },
  });
// ======================================
// READ-ALL
// ======================================
// .query('all', {
//   async resolve() {
//     return prisma.salesRecord.findMany({
//       select: defaultSalesRecordSelect,
//     });
//   },
// });
