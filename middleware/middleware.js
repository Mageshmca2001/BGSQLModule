import jwt from 'jsonwebtoken';

// Middleware to protect routes

export const verifyToken = (req, res, next) => {

const token = req.cookies.token;  // Assuming you're storing the token in cookies

if (!token) {

return res.status(401).json({ message: 'No token, authorization denied' });
}

try {

// Verify token

const decoded = jwt.verify(token, process.env.JWT_SECRET);

req.user = decoded; // Attach the decoded user to the request object

next(); // Proceed to the next route handler

} catch (error) {

return res.status(401).json({ message: 'Token is not valid or expired' });
}
};

