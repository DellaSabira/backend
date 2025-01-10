const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
    try{
        const users = await prisma.user.createMany({
            data:[
                { email: 'sabira@example.com', password:'123' },
                { email: 'houssam@example.com', password:'123' },
                { email: 'dhiya@example.com', password:'123' },
            ],
        });

        console.log(`${users.count} users added.`);

    } catch (error) {
        console.error('Error seeding database:', error);
    }finally {
        await prisma.$disconnect();
    }
}

seed();