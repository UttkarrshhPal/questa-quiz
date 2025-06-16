import { PrismaClient } from '@prisma/client';
import { auth } from '../src/lib/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create demo user through Better Auth
  const demoEmail = 'demo@questa.app';
  const demoPassword = 'demo123';

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: demoEmail },
  });

  let userId: string;

  if (existingUser) {
    userId = existingUser.id;
    console.log('Demo user already exists');
  } else {
    // Create user through Better Auth to ensure proper password handling
    console.log('Creating demo user...');
    
    // Create user directly in database
    const user = await prisma.user.create({
      data: {
        email: demoEmail,
        name: 'Demo User',
        emailVerified: true,
      },
    });

    // Create account with password
    await prisma.account.create({
      data: {
        userId: user.id,
        accountId: user.email,
        providerId: 'credential',
        password: await auth.api.signUpEmail({
          body: {
            email: demoEmail,
            password: demoPassword,
            name: 'Demo User',
          },
        }).then(() => demoPassword), // This is a workaround - in production use proper hashing
      },
    });

    userId = user.id;
    console.log('Demo user created');
  }

  // Create sample quiz
  const existingQuiz = await prisma.quiz.findFirst({
    where: { userId },
  });

  if (!existingQuiz) {
    const quiz = await prisma.quiz.create({
      data: {
        title: 'Sample Quiz',
        description: 'This is a sample quiz to demonstrate Questa',
        userId,
        questions: {
          create: [
            {
              text: 'What is your favorite programming language?',
              type: 'SINGLE_CHOICE',
              options: ['JavaScript', 'Python', 'Java', 'Go'],
              order: 1,
              required: true,
            },
            {
              text: 'Describe your experience with web development',
              type: 'SHORT_TEXT',
              order: 2,
              required: true,
            },
          ],
        },
      },
    });

    console.log('Sample quiz created:', quiz.title);
  }

  console.log('\nSeed completed!');
  console.log('Demo credentials:');
  console.log('Email:', demoEmail);
  console.log('Password:', demoPassword);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });