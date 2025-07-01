import jwt from "jsonwebtoken";
import { findUserByUsername, createUser,verifyUserPassword} from '../Models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const TOKEN_EXPIRATION = "2h";
export const register = async (req, res) => {
const { username, email, password, role } = req.body;

if (!username || !email || !password || !role) {
return res.status(400).json({ message: "All fields are required" });
}

try {
const existingUser = await findUserByUsername(username);
if (existingUser) {
return res.status(400).json({ message: "User already exists" });
}

const newUser = await createUser({ username, email, password, role });

res.status(201).json({
message: "User registered successfully",
user: {
id: newUser.id,
username: newUser.username,
email: newUser.email,
role: newUser.role,
// created_at: newUser.created_at, if needed
},
});

} catch (error) {
console.error("Register error:", error);

if (error.message.includes("Invalid object name 'Login'")) {
return res.status(500).json({ message: "Database table 'Login' not found" });
}

res.status(500).json({ message: "Error registering user", error: error.message });
}
};
export const login = async (req, res) => {
const { username, password } = req.body;

if (!username || !password) {
return res.status(400).json({ message: "Username and password are required" });
}

try {
const user = await findUserByUsername(username);

if (!user) {
return res.status(401).json({ message: "Invalid credentials" });
}

const validPassword = await verifyUserPassword(user, password);

if (!validPassword) {
return res.status(401).json({ message: "Invalid credentials" });
}

const payload = {
id: user.id,
username: user.username,
role: user.role,
};

const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

res.cookie("token", token, {
httpOnly: true,
secure: process.env.NODE_ENV === "production",
maxAge: 3600000, // 1 hour
sameSite: "strict",
});

res.status(200).json({
message: "Login successful",
user: {
id: user.id,
username: user.username,
email: user.email,
role: user.role,
},
token,
});

} catch (error) {
console.error("Login error:", error);

if (error.message.includes("Invalid object name 'Login'")) {
return res.status(500).json({ message: "Database table 'Login' not found" });
}

res.status(500).json({ message: "Error logging in", error: error.message });
}
};
const auth = { register ,login}
export default auth;
