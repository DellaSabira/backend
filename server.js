const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const dotenv = require('dotenv');
const userRoutes = require('./src/routes/userRoutes');
const auth = require('./src/routes/auth')
dotenv.config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.use(express.json());
app.use('/api', userRoutes);
app.use("/auth", auth);

app.get('/',(req,res) => {
    res.send('hello,from the heropay backend app');
});

app.listen(PORT,() => {
    console.log(`server is running on 
        http://localhost:${PORT}`);
});