import jwt from 'jsonwebtoken';
import { isBlacklisted } from '../Models/authtoken.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = async (req, res, next) => {
const token = req.cookies?.token;
if (!token) return res.status(401).json({ message: 'Unauthorized' });

if (await isBlacklisted(token)) {
return res.status(403).json({ message: 'Token is blacklisted' });
}

try {
const decoded = jwt.verify(token, JWT_SECRET);
req.user = decoded;
next();
} catch (err) {
return res.status(401).json({ message: 'Token expired or invalid' });
}
};
