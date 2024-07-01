import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function grantPrevileges() {
  await prisma.$queryRaw`GRANT USAGE ON SCHEMA phijudge TO service_role;`;

  await prisma.$queryRaw`GRANT SELECT ON ALL TABLES IN SCHEMA phijudge TO service_role;`;
  await prisma.$queryRaw`ALTER DEFAULT PRIVILEGES IN SCHEMA phijudge GRANT SELECT ON TABLES TO service_role;`;

  await prisma.$queryRaw`GRANT INSERT ON phijudge.requestLog TO service_role;`;
}

async function main() {
  await grantPrevileges();
}

main().finally(async () => {
  await prisma.$disconnect();
});
