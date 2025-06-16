import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Note: After running this seed, you need to sign up through the UI with:');
  console.log('Email: demo@questa.app');
  console.log('Password: demo123');
  console.log('\nThis seed only creates sample quiz data for existing users.');

  // Check if demo user exists
  const demoUser = await prisma.user.findUnique({
    where: { email: 'demo@questa.app' },
  });

  if (demoUser) {
    // Create sample quiz for demo user
    const quiz = await prisma.quiz.create({
      data: {
        title: 'Sample Quiz',
        description: 'This is a sample quiz to demonstrate Questa',
        userId: demoUser.id,
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

    console.log('Sample quiz created for demo user');
  } else {
    console.log('Demo user not found. Please sign up first with the credentials above.');
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