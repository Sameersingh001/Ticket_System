import User from '../model/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';



export const registerUser = async (req, res) => {
    const { username, email, mobile, password } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }, { mobile }] });

        if (existingUser) {
            return res.status(400).json({ message: 'User with given email, username, or mobile already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, mobile, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });

    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
        console.log("ERROR", error)
    }

}



export const LoginUser = async (req, res) => {
    const { email, password } = req.body;

    try{

        const user = await User.findOne({ email });

        if (!user) {
            return  res.status(400).json({ message: 'Invalid email or password' });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });


        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000 // 1 hour
        });

        res.status(200).json({ message: 'Login successful', user: { id: user._id, email: user.email, username: user.username }, token });

    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
        console.log("ERROR", error)
    }

}