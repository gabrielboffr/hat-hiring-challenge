import { NotFoundException } from '@nestjs/common';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '@prisma/client';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new NotFoundException('DATABASE_URL não está definido');
}

const adapter = new PrismaLibSql({
  url: databaseUrl,
});

const prisma = new PrismaClient({ adapter });

async function seed() {
  const pricingTable = [
    {
      seniority: 'JUNIOR' as const,
      costPerHour: 45.0,
      billRatePerHour: 95.0,
      targetMargin: 52.6,
    },
    {
      seniority: 'MID_LEVEL' as const,
      costPerHour: 75.0,
      billRatePerHour: 155.0,
      targetMargin: 51.6,
    },
    {
      seniority: 'SENIOR' as const,
      costPerHour: 120.0,
      billRatePerHour: 245.0,
      targetMargin: 51.0,
    },
    {
      seniority: 'ESPECIALIST' as const,
      costPerHour: 180.0,
      billRatePerHour: 380.0,
      targetMargin: 52.6,
    },
    {
      seniority: 'MANAGER' as const,
      costPerHour: 250.0,
      billRatePerHour: 520.0,
      targetMargin: 51.9,
    },
  ];

  for (const row of pricingTable) {
    await prisma.pricingTable.upsert({
      where: { costPerHour: row.costPerHour },
      update: {
        seniority: row.seniority,
        billRatePerHour: row.billRatePerHour,
        targetMargin: row.targetMargin,
      },
      create: row,
    });
  }

  const discountTable = [
    { approverLevel: 'SALES_EXECUTIVE' as const, maxAllowedDiscount: 5 },
    { approverLevel: 'COMMERCIAL_MANAGER' as const, maxAllowedDiscount: 15 },
    { approverLevel: 'DIRECTOR' as const, maxAllowedDiscount: 25 },
    { approverLevel: 'CEO' as const, maxAllowedDiscount: 40 },
  ];

  for (const row of discountTable) {
    await prisma.discountTable.upsert({
      where: { approverLevel: row.approverLevel },
      update: { maxAllowedDiscount: row.maxAllowedDiscount },
      create: row,
    });
  }

  const professionalsCount = await prisma.professionals.count();
  if (professionalsCount === 0) {
    await prisma.professionals.createMany({
      data: [
        {
          name: 'Ana Demo',
          seniority: 'JUNIOR',
          costPerHour: 45.0,
          billRatePerHour: 95.0,
        },
        {
          name: 'Bruno Demo',
          seniority: 'MID_LEVEL',
          costPerHour: 75.0,
          billRatePerHour: 155.0,
        },
        {
          name: 'Carla Demo',
          seniority: 'SENIOR',
          costPerHour: 120.0,
          billRatePerHour: 245.0,
        },
        {
          name: 'Diego Demo',
          seniority: 'ESPECIALIST',
          costPerHour: 180.0,
          billRatePerHour: 380.0,
        },
        {
          name: 'Elisa Demo',
          seniority: 'MANAGER',
          costPerHour: 250.0,
          billRatePerHour: 520.0,
        },
      ],
    });
  }
}

seed()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Database disconnected');
  })
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
