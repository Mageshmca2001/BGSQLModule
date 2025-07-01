import express from 'express';
import { verifyToken } from '../middleware/middleware.js';
import users  from '../controller/User.js';
const userRouter = express.Router();

userRouter.post('/addusers', users.addusers)
userRouter.get('/getusers', users.getusers);
userRouter.put('/putusers', users.putusers);
userRouter.delete('/deleteusers/:id', users.deleteusers);
userRouter.post('/login', users.login);
userRouter.get('/parameters', users.getall);

userRouter.get('/protected', verifyToken, (req, res) => {
res.status(200).json({ message: 'Access granted', user: req.user });
});


export default userRouter;