import { Prisma, CustomerStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "~/server/createRouter";
import { prisma } from "~/server/prisma";

const defaultCustomerSelect = Prisma.validator<Prisma.CustomerSelect>()({
  id: true,
  status: true,
  name: true,
  createdAt: true,
  updatedAt: true,
});

const CustomerStatusUnion = z.union(
  [z.literal(CustomerStatus.ACTIVE), z.literal(CustomerStatus.LEAD), z.literal(CustomerStatus.NON_ACTIVE)],
  {
    errorMap() {
      const message = `Status must be one of Active, Non Active or Lead`;
      return { message };
    },
  },
);

export const customerRouter = createRouter()
  // ======================================
  // CREATE
  // ======================================
  .mutation("create", {
    input: z.object({
      name: z.string().min(3, "Name must contain at least 3 character(s)"),
      status: CustomerStatusUnion,
    }),
    async resolve({ input }) {
      const item = await prisma.customer.create({
        data: input,
        select: defaultCustomerSelect,
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
      salesRecordPage: z.number().optional().default(0),
    }),
    async resolve({ input }) {
      const { id } = input;
      const item = await prisma.customer.findUnique({
        where: { id },
        select: defaultCustomerSelect,
      });
      if (!item) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Record not found with id '${id}'`,
        });
      }
      const pageBy = 5;
      const skip = input.salesRecordPage * pageBy;
      const [total, salesRecords] = await prisma.$transaction([
        prisma.salesRecord.count({ where: { customerId: id } }),
        prisma.salesRecord.findMany({
          skip,
          take: pageBy,
          where: { customerId: id },
          orderBy: [{ createdAt: "desc" }],
        }),
      ]);
      const results = {
        customer: item,
        salesRecords,
        salesRecordPage: input.salesRecordPage,
        salesRecordPageBy: pageBy,
        salesRecordTotal: total,
      };
      return results;
    },
  })
  // ======================================
  // UPDATE
  // ======================================
  .mutation("update", {
    input: z.object({
      id: z.string().uuid(),
      status: CustomerStatusUnion,
    }),
    async resolve({ input }) {
      const { id, status } = input;
      const item = await prisma.customer.update({
        where: { id },
        data: { status },
        select: defaultCustomerSelect,
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
      await prisma.customer.delete({ where: { id } });
      return {
        id,
      };
    },
  })
  // ======================================
  // READ-ALL
  // ======================================
  .query("all", {
    input: z.object({
      sortBy: z.string().optional(),
      sortOrder: z.string().optional(),
      filterBy: z.string().optional(),
      filterContains: z.string().optional(),
      page: z.number().optional().default(0),
    }),
    async resolve({ input }) {
      const pageBy = 10;
      const skip = input.page * pageBy;
      const queryFindMany: Prisma.CustomerFindManyArgs = {
        skip,
        take: pageBy,
        include: {
          sales: {
            select: {
              id: true,
            },
          },
        },
      };

      if (input.sortBy && input.sortOrder) {
        queryFindMany.orderBy = [
          {
            [input.sortBy]: input.sortOrder,
          },
        ];
      }

      if (input.filterBy && input.filterContains) {
        if (input.filterBy === "status") {
          queryFindMany.where = {
            [input.filterBy]: {
              equals: input.filterContains.toUpperCase() as CustomerStatus,
            },
          };
        } else {
          queryFindMany.where = {
            [input.filterBy]: {
              contains: input.filterContains,
              mode: "insensitive",
            },
          };
        }
      }
      const [total, customers] = await prisma.$transaction([
        prisma.customer.count(),
        prisma.customer.findMany(queryFindMany),
      ]);
      const results = {
        customers,
        page: input.page,
        pageBy,
        total,
      };
      return results;
    },
  });
