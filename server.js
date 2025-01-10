const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/',(req,res) => {
    res.send('hello, heropay app');
});

app.listen(PORT,() => {
    console.log(`server is running on 
        http://localhost:${PORT}`);
});