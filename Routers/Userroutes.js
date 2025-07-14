import express from 'express';
import { verifyToken } from '../middleware/middleware.js';
import users  from '../controller/User.js';
const userRouter = express.Router();

userRouter.post('/addusers', users.addusers)
userRouter.get('/getusers', users.getusers);
userRouter.put('/putusers', users.putusers);
userRouter.delete('/deleteusers/:id', users.deleteusers);
userRouter.post('/login', users.login);

// {*/parameter*/}

userRouter.get('/Functional',users.FunctionalSerialNumberget);
userRouter.get('/Calibration', users.CalibrationSerialNumberget);
userRouter.get('/Accuracy',users.AccuracySerialNumberget);
userRouter.get('/NIC',users.NICSerialNumberget)

// {*/TestJig*/}

userRouter.get('/getTestjig', users.getTestjig); // you might already have this
userRouter.post('/postTestjig', users.addTestjig);
userRouter.put('/putTestjig', users.putTestJig);
userRouter.delete('/deleteTestjig/:id', users.deleteTestJig);

//{*graph Pie Chat, Grid cols}

userRouter.get('/getrecords', users.getrecords)

userRouter.get('/protected', verifyToken, (req, res) => {
res.status(200).json({ message: 'Access granted', user: req.user });
});


export default userRouter;