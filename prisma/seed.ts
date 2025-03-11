import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Função para limpar o banco de dados antes de inserir novos dados
async function cleanDatabase() {
  // Apagando registros em ordem inversa de dependência
  await prisma.despesa.deleteMany({});
  await prisma.receita.deleteMany({});
  await prisma.meta.deleteMany({});
  await prisma.carteira.deleteMany({});
  await prisma.user.deleteMany({});
  
  console.log("Banco de dados limpo com sucesso!");
}

async function main() {
  // Limpa o banco de dados antes de inserir novos registros
  await cleanDatabase();

  // Criando usuários
  const user1 = await prisma.user.create({
    data: { name: "João", email: "joao@email.com", password: '123123' }
  });
  const user2 = await prisma.user.create({
    data: { name: "Maria", email: "maria@email.com", password: '123123' }
  });
  const user3 = await prisma.user.create({
    data: { name: "Carlos", email: "carlos@email.com", password: '123123' }
  });
  const user4 = await prisma.user.create({
    data: { name: "Ana", email: "ana@email.com", password: '123123' }
  });
  const user5 = await prisma.user.create({
    data: { name: "Pedro", email: "pedro@email.com", password: '123123' }
  });
  const user6 = await prisma.user.create({
    data: { name: "Luiza", email: "luiza@email.com", password: '123123' }
  });
  const user7 = await prisma.user.create({
    data: { name: "Fernando", email: "fernando@email.com", password: '123123' }
  });
  const user8 = await prisma.user.create({
    data: { name: "Beatriz", email: "beatriz@email.com", password: '123123' }
  });

  // Criando carteiras
  const carteira1 = await prisma.carteira.create({
    data: { name: "Carteira Principal", balance: "1000.00", userId: user1.id }
  });
  const carteira2 = await prisma.carteira.create({
    data: { name: "Poupança", balance: "5000.00", userId: user1.id }
  });
  const carteira3 = await prisma.carteira.create({
    data: { name: "Investimentos", balance: "10000.00", userId: user1.id }
  });
  const carteira4 = await prisma.carteira.create({
    data: { name: "Carteira Pessoal", balance: "2500.00", userId: user2.id }
  });
  const carteira5 = await prisma.carteira.create({
    data: { name: "Poupança", balance: "7500.00", userId: user2.id }
  });
  const carteira6 = await prisma.carteira.create({
    data: { name: "Carteira Viagem", balance: "3000.00", userId: user2.id }
  });
  const carteira7 = await prisma.carteira.create({
    data: { name: "Conta Corrente", balance: "1200.00", userId: user3.id }
  });
  const carteira8 = await prisma.carteira.create({
    data: { name: "Reserva de Emergência", balance: "8000.00", userId: user3.id }
  });
  const carteira9 = await prisma.carteira.create({
    data: { name: "Carteira Principal", balance: "2800.00", userId: user4.id }
  });
  const carteira10 = await prisma.carteira.create({
    data: { name: "Investimentos", balance: "15000.00", userId: user4.id }
  });
  const carteira11 = await prisma.carteira.create({
    data: { name: "Carteira Digital", balance: "750.00", userId: user5.id }
  });
  const carteira12 = await prisma.carteira.create({
    data: { name: "Poupança", balance: "4500.00", userId: user5.id }
  });
  const carteira13 = await prisma.carteira.create({
    data: { name: "Carteira Principal", balance: "3200.00", userId: user6.id }
  });
  const carteira14 = await prisma.carteira.create({
    data: { name: "Carteira Lazer", balance: "1000.00", userId: user7.id }
  });
  const carteira15 = await prisma.carteira.create({
    data: { name: "Carteira Principal", balance: "2100.00", userId: user8.id }
  });

  // Criando metas
  await prisma.meta.create({
    data: {
      name: "Viagem férias",
      value: 5000.00,
      description: "Meta para viagem de férias",
      carteiraId: carteira1.id,
      dataFinal: new Date('2024-12-31')
    }
  });

  await prisma.meta.create({
    data: {
      name: "Comprar notebook",
      value: 3000.00,
      description: "Comprar um novo notebook",
      carteiraId: carteira1.id,
      dataFinal: new Date('2024-06-30')
    }
  });

  await prisma.meta.create({
    data: {
      name: "Reserva de emergência",
      value: 10000.00,
      description: "Fundo para emergências",
      carteiraId: carteira3.id,
      dataFinal: new Date('2025-12-31')
    }
  });

  await prisma.meta.create({
    data: {
      name: "Trocar de carro",
      value: 30000.00,
      description: "Comprar um carro novo",
      carteiraId: carteira4.id,
      dataFinal: new Date('2025-06-15')
    }
  });

  await prisma.meta.create({
    data: {
      name: "Curso de especialização",
      value: 4000.00,
      description: "Fazer um curso de especialização",
      carteiraId: carteira5.id,
      dataFinal: new Date('2024-08-20')
    }
  });

  await prisma.meta.create({
    data: {
      name: "Entrada apartamento",
      value: 50000.00,
      description: "Juntar para entrada de um apartamento",
      carteiraId: carteira7.id,
      dataFinal: new Date('2026-01-10')
    }
  });

  await prisma.meta.create({
    data: {
      name: "Viagem internacional",
      value: 12000.00,
      description: "Viagem para o exterior",
      carteiraId: carteira9.id,
      dataFinal: new Date('2024-11-15')
    }
  });

  await prisma.meta.create({
    data: {
      name: "Pós-graduação",
      value: 8000.00,
      description: "Fazer uma pós-graduação",
      carteiraId: carteira11.id,
      dataFinal: new Date('2025-03-25')
    }
  });

  await prisma.meta.create({
    data: {
      name: "Reforma da casa",
      value: 15000.00,
      description: "Reformar a casa",
      carteiraId: carteira13.id,
      dataFinal: new Date('2024-10-05')
    }
  });

  await prisma.meta.create({
    data: {
      name: "Casamento",
      value: 20000.00,
      description: "Economizar para o casamento",
      carteiraId: carteira15.id,
      dataFinal: new Date('2025-09-12')
    }
  });

  // Criando receitas
  await prisma.receita.create({
    data: {
      name: "Salário",
      value: 5000.00,
      description: "Salário mensal",
      carteiraId: carteira1.id
    }
  });

  await prisma.receita.create({
    data: {
      name: "Freelance",
      value: 1000.00,
      description: "Trabalho freelance",
      carteiraId: carteira2.id
    }
  });

  await prisma.receita.create({
    data: {
      name: "Dividendos",
      value: 500.00,
      description: "Dividendos de investimentos",
      carteiraId: carteira3.id
    }
  });

  await prisma.receita.create({
    data: {
      name: "Aluguel recebido",
      value: 1500.00,
      description: "Aluguel de imóvel",
      carteiraId: carteira4.id
    }
  });

  await prisma.receita.create({
    data: {
      name: "Venda online",
      value: 800.00,
      description: "Venda de produtos online",
      carteiraId: carteira5.id
    }
  });

  await prisma.receita.create({
    data: {
      name: "Bônus",
      value: 2000.00,
      description: "Bônus trimestral",
      carteiraId: carteira7.id
    }
  });

  await prisma.receita.create({
    data: {
      name: "Comissão",
      value: 1200.00,
      description: "Comissão de vendas",
      carteiraId: carteira9.id
    }
  });

  await prisma.receita.create({
    data: {
      name: "Investimentos",
      value: 750.00,
      description: "Retorno de investimentos",
      carteiraId: carteira10.id
    }
  });

  await prisma.receita.create({
    data: {
      name: "Consultoria",
      value: 3000.00,
      description: "Serviço de consultoria",
      carteiraId: carteira13.id
    }
  });

  await prisma.receita.create({
    data: {
      name: "Projeto especial",
      value: 4500.00,
      description: "Projeto freelance especial",
      carteiraId: carteira15.id
    }
  });

  // Criando despesas
  await prisma.despesa.create({
    data: {
      name: "Aluguel",
      valor: 1500.00,
      description: "Pagamento mensal do aluguel",
      carteiraId: carteira1.id
    }
  });

  await prisma.despesa.create({
    data: {
      name: "Supermercado",
      valor: 800.00,
      description: "Compras mensais",
      carteiraId: carteira2.id
    }
  });

  await prisma.despesa.create({
    data: {
      name: "Energia",
      valor: 200.00,
      description: "Conta de energia",
      carteiraId: carteira3.id
    }
  });

  await prisma.despesa.create({
    data: {
      name: "Internet",
      valor: 120.00,
      description: "Serviço de internet",
      carteiraId: carteira4.id
    }
  });

  await prisma.despesa.create({
    data: {
      name: "Plano de Saúde",
      valor: 350.00,
      description: "Mensalidade do plano",
      carteiraId: carteira5.id
    }
  });

  await prisma.despesa.create({
    data: {
      name: "Academia",
      valor: 150.00,
      description: "Mensalidade academia",
      carteiraId: carteira7.id
    }
  });

  await prisma.despesa.create({
    data: {
      name: "Educação",
      valor: 500.00,
      description: "Cursos e livros",
      carteiraId: carteira9.id
    }
  });

  await prisma.despesa.create({
    data: {
      name: "Transporte",
      valor: 300.00,
      description: "Gastos com transporte",
      carteiraId: carteira11.id
    }
  });

  await prisma.despesa.create({
    data: {
      name: "Manutenção Carro",
      valor: 400.00,
      description: "Revisão e manutenção",
      carteiraId: carteira13.id
    }
  });

  await prisma.despesa.create({
    data: {
      name: "Lazer",
      valor: 250.00,
      description: "Atividades de lazer",
      carteiraId: carteira15.id
    }
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