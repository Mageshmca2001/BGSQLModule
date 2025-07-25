import express from 'express';
import auth from '../controller/auth.js'
import { verifyToken } from '../middleware/middleware.js';
const authRouter = express.Router();

// Register a new user
authRouter.post('/register', auth.register);
authRouter.post('/login',auth.login);
// Login route
authRouter.get('/protected', verifyToken, (req, res) => {
res.status(200).json({ message: 'Access granted', admin: req.user });
});


export default authRouter;