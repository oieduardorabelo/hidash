/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import { PrismaClient, CustomerStatus, SalesRecordStatus } from "@prisma/client";
import { randomUUID } from "crypto";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();
const customerStatus = [CustomerStatus.ACTIVE, CustomerStatus.LEAD, CustomerStatus.NON_ACTIVE];
const salesRecordStatus = [SalesRecordStatus.CLOSED_LOST, SalesRecordStatus.CLOSED_WON, SalesRecordStatus.NEW];

async function main() {
  for (let i = 0; i < 25; i++) {
    const customerId = randomUUID();
    const customer = await prisma.customer.upsert({
      where: {
        id: customerId,
      },
      create: {
        id: customerId,
        status: customerStatus[Math.floor(Math.random() * 3)],
        name: faker.name.findName(),
      },
      update: {},
    });

    const salesRecords = Number(faker.random.numeric(1, { bannedDigits: ["0"] }));
    for (let j = 0; j < salesRecords; j++) {
      await prisma.salesRecord.create({
        data: {
          id: randomUUID(),
          name: faker.company.companyName(),
          status: salesRecordStatus[Math.floor(Math.random() * 3)],
          customer: { connect: { id: customer.id } },
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
