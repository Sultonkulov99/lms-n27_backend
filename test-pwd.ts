import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const pwd = process.env.ADMIN_PASSWORD || "SHAPTOLI";
  console.log("Password from env:", process.env.ADMIN_PASSWORD);
  const hash = await argon.hash(pwd);
  await prisma.user.update({
    where: { phone: "+998975661099" },
    data: { password: hash }
  });
  console.log("Updated superadmin password");
}
main().catch(console.error).finally(() => prisma.$disconnect());
