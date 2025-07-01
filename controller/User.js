
import {insertUser,fetchAllUsers,updateUser,deleteUser,findUserByUsername1,verifyUserPassword1,fetchAllUsersall} from '../Models/User.js'
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const TOKEN_EXPIRATION = "2h";
export const addusers = async (req, res) => {
const { username, password, role, status } = req.body;

if (!username || !password || !role || !status) {
return res.status(400).json({ message: 'All fields are required' });
}

try {
const id = uuidv4();
const newUser = await insertUser({ id, username, password, role, status });

res.status(200).json({ message: 'User saved successfully', user: newUser });
} catch (err) {
console.error("Add user error:", err);
res.status(500).json({ message: 'Error saving user', error: err.message });
}
};
export const getusers = async (req, res) => {
try {
const users = await fetchAllUsers(); // Replace with your actual DB query method

res.status(200).json({ users });
} catch (err) {
console.error("Get users error:", err);
res.status(500).json({ message: 'Error retrieving users', error: err.message });
}
};
export const putusers = async (req, res) => {
const { id, username, password, role, status } = req.body;

if (!id || !username || !password || !role || !status) {
return res.status(400).json({ message: 'All fields including id are required' });
}

try {
const updatedUser = await updateUser({ id, username, password, role, status });

if (!updatedUser) {
return res.status(404).json({ message: 'User not found for update' });
}

res.status(200).json({ message: 'User updated successfully', user: updatedUser });
} catch (err) {
console.error("Update user error:", err);
res.status(500).json({ message: 'Error updating user', error: err.message });
}
};
export const deleteusers = async (req, res) => {
  const { id } = req.params;  // assuming id is passed as URL param

  if (!id) {
    return res.status(400).json({ message: 'User id is required for deletion' });
  }

  try {
    const deletedUser = await deleteUser(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found for deletion' });
    }

    res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
};
export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    const user = await findUserByUsername1(username);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.status !== 'Active') {
      return res.status(403).json({ message: `Account is ${user.status}` });
    }

    // ✅ Await the password verification
    const isValid = await verifyUserPassword1(user, password);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role.toLowerCase(),
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRATION || '1h',
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        status: user.status,
      },
      token,
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};
export const getall = async (req, res) => {
try {
const users = await fetchAllUsersall(); // users is an array of 4 recordsets

const [data, criticalParameters, finalParameters, calibration] = users;

res.status(200).json({
data,
criticalParameters,
finalParameters,
calibration
});
} catch (err) {
console.error("Get users error:", err);
res.status(500).json({ message: 'Error retrieving users', error: err.message });
}
};
const users = {addusers, getusers , putusers, deleteusers, login, getall}; 

export default users;