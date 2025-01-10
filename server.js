const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const dotenv = require("dotenv");
const authRoutes = require("./src/routes/auth");

dotenv.config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.use(express.json());
app.use("/auth", authRoutes);

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
    res.send('hello,from the heropay backend app');
});

app.listen(PORT,() => {
    console.log(`server is running on 
        http://localhost:${PORT}`);
});