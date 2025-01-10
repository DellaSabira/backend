const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.use(express.json());

async function main() {
    // Fetch all users
    const users = await prisma.user.findMany();
    console.log('All Users:', users);
  }

  main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

app.get('/',(req,res) => {
    res.send('hello, heropay app');
});

app.listen(PORT,() => {
    console.log(`server is running on 
        http://localhost:${PORT}`);
});