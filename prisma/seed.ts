import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      { name: "João", email: "joao@email.com" , password:'123123'},
      { name: "Maria", email: "maria@email.com", password:'123123' },
      { name: "Carlos", email: "carlos@email.com" , password:'123123'}
    ],
  });
  console.log("Seeds criadas com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
