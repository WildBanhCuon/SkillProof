import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const company = await prisma.company.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Acme Corp',
      hrUsers: {
        create: {
          email: 'marion@acme.test',
          passwordHash,
          fullName: 'Marie D.',
          role: 'ADMIN',
        },
      },
    },
    include: { hrUsers: true },
  });

  await prisma.candidateUser.upsert({
    where: { email: 'sofiane@test.com' },
    update: {},
    create: {
      email: 'sofiane@test.com',
      passwordHash,
      displayName: 'Sofiane K.',
    },
  });

  console.log('Seed complete:');
  console.log('  HR: marion@acme.test / Password123!');
  console.log('  Candidate: sofiane@test.com / Password123!');
  console.log('  Company:', company.name);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
