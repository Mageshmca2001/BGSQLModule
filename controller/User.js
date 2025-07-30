
import {insertUser,fetchAllUsers,updateUser,deleteUser,findUserByUsername1,verifyUserPassword1,FunctionalSerialNumber,CalibrationSerialNumber,AccuracySerialNumber,NICSerialNumber,fetchTest,CreateTest,UpdateTest,deleteTest,gettoday_yesterdayData,getWeeklyDataAllTests,getHourlyDataAllTests,getAllTableNames,getTableData,getDailyShiftData,getDailyHourlyData} from '../Models/User.js'
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
export const FunctionalSerialNumberget = async (req, res) => {
try {
const users = await FunctionalSerialNumber(); // users is an array of 4 recordsets


res.status(200).json({ users
});
} catch (err) {
console.error("Get users error:", err);
res.status(500).json({ message: 'Error retrieving users', error: err.message });
}
};
export const CalibrationSerialNumberget = async (req, res) => {
try {
const users = await CalibrationSerialNumber(); // users is an array of 4 recordsets


res.status(200).json({ users
});
} catch (err) {
console.error("Get users error:", err);
res.status(500).json({ message: 'Error retrieving users', error: err.message });
}
};
export const AccuracySerialNumberget = async (req, res) => {
try {
const users = await AccuracySerialNumber(); // users is an array of 4 recordsets


res.status(200).json({ users
});
} catch (err) {
console.error("Get users error:", err);
res.status(500).json({ message: 'Error retrieving users', error: err.message });
}
};
export const NICSerialNumberget = async (req, res) => {
try {
const users = await NICSerialNumber(); // users is an array of 4 recordsets


res.status(200).json({ users
});
} catch (err) {
console.error("Get users error:", err);
res.status(500).json({ message: 'Error retrieving users', error: err.message });
}
};
export const getTestjig =async (req, res) =>{
try {
const users = await fetchTest(); // Replace with your actual DB query method

res.status(200).json({ users });
} catch (err) {
console.error("Get users error:", err);
res.status(500).json({ message: 'Error retrieving users', error: err.message });
}
};
export const addTestjig = async (req, res) => {
const { TestJigNumber, JigDescription, JigStatus } = req.body;

if (!TestJigNumber || !JigDescription || !JigStatus) {
return res.status(400).json({ message: 'All fields are required' });
}

try {
const id = uuidv4();
const newUser = await CreateTest(id, TestJigNumber, JigDescription, JigStatus);
res.status(200).json({ message: 'User saved successfully', user: newUser });
} catch (err) {
console.error("Add user error:", err);
res.status(500).json({ message: 'Error saving user', error: err.message });
}
};
export const putTestJig = async (req, res) => {
const { id, TestJigNumber, JigDescription, JigStatus } = req.body;

if (!id || !TestJigNumber || !JigDescription || !JigStatus) {
return res.status(400).json({ message: 'All fields including TestJigId are required' });
}

try {
const updatedUser = await UpdateTest({ id, TestJigNumber, JigDescription, JigStatus });
if (!updatedUser) {
return res.status(404).json({ message: 'User not found for update' });
}
res.status(200).json({ message: 'User updated successfully', user: updatedUser });
} catch (err) {
console.error("Update user error:", err);
res.status(500).json({ message: 'Error updating user', error: err.message });
}
};
export const deleteTestJig = async (req, res) => {
const { id } = req.params;
if (!id) {
return res.status(400).json({ message: 'TestJigId is required for deletion' });
}

try {
const deletedUser = await deleteTest(id);
if (!deletedUser) {
return res.status(404).json({ message: 'User not found for deletion' });
}
res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
} catch (err) {
console.error("Delete user error:", err);
res.status(500).json({ message: 'Error deleting user', error: err.message });
}
};
export const getTodayAndYesterdayCount = async (req, res) => {
try {
// Assumes date is posted in body, e.g., { "date": "2025-07-18" }
await gettoday_yesterdayData(req, res); // Delegates to your main function
} catch (err) {
console.error("Error fetching counts:", err);
res.status(500).json({
success: false,
message: "Error retrieving counts",
error: err.message
});
}
};
export const getpresentAndweekCount = async (req, res) => {
try {
// Assumes date is posted in body, e.g., { "date": "2025-07-18" }
await getWeeklyDataAllTests(req, res); // Delegates to your main function
} catch (err) {
console.error("Error fetching counts:", err);
res.status(500).json({
success: false,
message: "Error retrieving counts",
error: err.message
});
}
};
export const gethourlyprogress = async (req, res) => {
try {
// Assumes date is posted in body, e.g., { "date": "2025-07-18" }
await getHourlyDataAllTests(req, res); // Delegates to your main function
} catch (err) {
console.error("Error fetching counts:", err);
res.status(500).json({
success: false,
message: "Error retrieving counts",
error: err.message
});
}
};

export const fetchTableList = async (req, res) => {
try {
const tables = await getAllTableNames();
res.json(tables);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Failed to load table list' });
}
};
export const fetchTableData = async (req, res) => {
const { fromDate, toDate } = req.query;
const tableName = req.params.tableName;

if (!tableName) {
return res.status(400).json({ error: 'Table name is required in the URL.' });
}

try {
const data = await getTableData(tableName, fromDate, toDate);
res.json(data);
} catch (err) {
console.error(`❌ Error fetching data for table: ${tableName}`, err);
res.status(500).json({
error: `Failed to fetch data for table: ${tableName}`,
});
}
};

export const getshiftwise = async (req, res) => {
try {
await getDailyShiftData(req, res);
} catch (err) {
console.error('❌ Error in getshiftwise:', err);
res.status(500).json({
success: false,
message: 'Error retrieving counts',
error: err.message,
});
}
};

export const getDailyhour = async (req, res) => {
try {
await getDailyHourlyData(req, res);
} catch (err) {
console.error('❌ Error in getDailyhour:', err);
res.status(500).json({
success: false,
message: 'Error retrieving counts',
error: err.message,
});
}
};



const users = {addusers, getusers , putusers, deleteusers, login, FunctionalSerialNumberget,CalibrationSerialNumberget,AccuracySerialNumberget,NICSerialNumberget,getTestjig,addTestjig,putTestJig,deleteTestJig,getTodayAndYesterdayCount,getpresentAndweekCount,gethourlyprogress,fetchTableList,fetchTableData,getshiftwise,getDailyhour}; 

export default users;