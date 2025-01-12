const prisma = require('../utils/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// 1. Generate a token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};



//1.fetch all users 

exports.getAllUsers = async (req, res) =>{
    try{
        const users = await prisma.user.findMany();
        res.json(users);
    }catch(error){
        res.status(500).json({message:'Error while fetching', error: error.message});
    }
};

//2.fetch user by id 

exports.getUserById = async (req,res) =>{
    const { id } = req.params;
    try{
        const user = await prisma.user.findUnique({
            where:{ id: parseInt(id)}
        });

        if(!user){ 
            return res.status(404).json({message:'user not found'});
         }
        res.json(user);
    }catch(error){
        res.status(500).json({message:'Error while fetching user', error: error.message});
    };

};

//3.update user
exports.updateUser = async (req,res) => {
    const { id } = req.params;
    const { email, password} = req.body;

    try{
        const updatedData = {};

        if(email) updatedData.email = email;
        if(password) updatedData.password = await bcrypt.hash(password, 10);

        if (!email && !password) {
            return res.status(400).json({ message: 'Nothing to update' }); // Validation check
        }

        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id)},
            data: updatedData,
        });

        res.json(updatedUser);
    }catch(error){
        res.status(500).json({message:'error while updating', error: error.message});
    }
};

//4.delete user 
exports.deleteUser = async (req,res) =>{
    const { id } = req.params;

    try{
        await prisma.user.update({
            where : {id: parseInt(id)},
            data: {deleted: true}
        });

        res.status(204).send();
    } catch(error){
        res.status(500).json({message:'error while deleting user', error: error.message});
    }
};

// 6. User login (token generation)
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({ message: 'Invalid email or password' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate token
        const token = generateToken(user.id);

        res.json({ token, user: { id: user.id, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Error during login', error: error.message });
    }
};

// 7. User signup (create user with token)
exports.signup = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        // Generate token
        const token = generateToken(newUser.id);

        res.status(201).json({ token, user: { id: newUser.id, email: newUser.email } });
    } catch (error) {
        res.status(500).json({ message: 'Error during signup', error: error.message });
    }
};