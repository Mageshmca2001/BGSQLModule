import jwt from 'jsonwebtoken';
export const verifyToken = (req, res, next) => {
const token = req.cookies?.token; // optional chaining for safety

if (!token) {
return res.status(401).json({ message: 'No token, authorization denied' });
}

try {
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded; // attach user data to the request
next();
} catch (err) {
return res.status(401).json({ message: 'Token is not valid or expired' });
}
};