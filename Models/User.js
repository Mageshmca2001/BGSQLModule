// models/userModel.js
import sql from 'mssql';
import { poolPromise } from '../Database/Database.js'; // your DB connection
import argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';

export const findUserByUsername = async (username) => {
const pool = await poolPromise;
const result = await pool
.request()
.input('username', sql.VarChar, username)
.query('SELECT * FROM Login WHERE username = @username');
return result.recordset[0];


};
export const verifyUserPassword = async (user, plainPassword) => {
return argon2.verify(user.password, plainPassword);
};
export const createUser = async ({ username, email, password, role }) => {
const pool = await poolPromise;

const hashedPassword = await argon2.hash(password);
const id = uuidv4();

const insertResult = await pool
.request()
.input('id', sql.UniqueIdentifier, id)
.input('username', sql.VarChar, username)
.input('email', sql.VarChar, email)
.input('password', sql.VarChar, hashedPassword)
.input('role', sql.VarChar, role)
.query(`
INSERT INTO Login (id, username, email, password, role)
OUTPUT inserted.id, inserted.username, inserted.email, inserted.role, inserted.timestamp
VALUES (@id, @username, @email, @password, @role)
`);

return insertResult.recordset[0];
};
export const insertUser = async ({ id, username, password, role, status }) => {
const pool = await poolPromise;

const result = await pool
.request()
.input('id', sql.UniqueIdentifier, id)
.input('username', sql.VarChar, username)
.input('password', sql.VarChar, password)
.input('role', sql.VarChar, role)
.input('status', sql.VarChar, status)
.query(`
INSERT INTO Users (id, username, password, role, status)
OUTPUT inserted.id, inserted.username, inserted.role, inserted.status,inserted.timestamp
VALUES (@id, @username, @password, @role, @status)
`);

return result.recordset[0];
};
export const updateUser = async ({ id, username, password, role, status }) => {
const pool = await poolPromise;

const result = await pool
.request()
.input('id', sql.UniqueIdentifier, id)
.input('username', sql.VarChar, username)
.input('password', sql.VarChar, password)
.input('role', sql.VarChar, role)
.input('status', sql.VarChar, status)
.query(`
UPDATE Users
SET 
username = @username,
password = @password,
role = @role,
status = @status
OUTPUT inserted.id, inserted.username, inserted.role, inserted.status, inserted.timestamp
WHERE id = @id
`);

return result.recordset[0];
};
export const deleteUser = async (id) => {
const pool = await poolPromise;

const result = await pool
.request()
.input('id', sql.UniqueIdentifier, id)
.query(`
DELETE FROM Users
OUTPUT deleted.id, deleted.username, deleted.role, deleted.status, deleted.timestamp
WHERE id = @id
`);

return result.recordset[0];
};
export const fetchAllUsers = async () => {
const pool = await poolPromise;
const result = await pool
.request()
.query('SELECT id, username, password, role, status ,timestamp FROM Users');

return result.recordset; // Return all records
};
export const findUserByUsername1 = async (username) => {
const pool = await poolPromise;
const result = await pool
.request()
.input('username', sql.VarChar, username)
.query('SELECT * FROM Users WHERE username = @username');
return result.recordset[0];
};
export const verifyUserPassword1 = (user, plainPassword) => {
return user.password === plainPassword;
};
export const FunctionalSerialNumber = async () => {
const pool = await poolPromise;
const result = await pool
.request()
.query('SELECT * FROM finalparameters');
return result.recordset; // Return all records
};
export const CalibrationSerialNumber = async () => {
const pool = await poolPromise;
const result = await pool
.request()
.query('SELECT * FROM Calibration');

AccuracySerialNumber
return result.recordset; // Return all records
};
export const AccuracySerialNumber = async () => {
const pool = await poolPromise;
const result = await pool
.request()
.query('SELECT * FROM AccuracyTest');


return result.recordset; // Return all records
};
export const NICSerialNumber = async () => {
const pool = await poolPromise;
const result = await pool
.request()
.query('SELECT * FROM NICComTest');


return result.recordset; // Return all records
};
export const fetchTest = async () => {
const pool = await poolPromise;
const result = await pool
.request()
.query('SELECT id, TestJigNumber, JigDescription, JigStatus  FROM TestJigDetails');

return result.recordset; // Return all records
};
export const CreateTest = async (id, TestJigNumber, JigDescription, JigStatus) => {
const pool = await poolPromise;
const result = await pool
.request()
.input('id', sql.UniqueIdentifier, id)
.input('TestJigNumber', sql.VarChar, TestJigNumber)
.input('JigDescription', sql.VarChar, JigDescription)
.input('JigStatus', sql.VarChar, JigStatus)
.query(`
INSERT INTO TestJigDetails (id, TestJigNumber, JigDescription, JigStatus)
OUTPUT inserted.id, inserted.TestJigNumber, inserted.JigDescription, inserted.JigStatus
VALUES (@id, @TestJigNumber, @JigDescription, @JigStatus)
`);
return result.recordset[0];
};
export const UpdateTest = async ({ id, TestJigNumber, JigDescription, JigStatus }) => {
try {
const pool = await poolPromise;

const result = await pool
.request()
.input('id', sql.UniqueIdentifier, id)
.input('TestJigNumber', sql.VarChar, TestJigNumber)
.input('JigDescription', sql.VarChar, JigDescription)
.input('JigStatus', sql.VarChar, JigStatus)
.query(`
UPDATE TestJigDetails
SET 
TestJigNumber = @TestJigNumber,
JigDescription = @JigDescription,
JigStatus = @JigStatus
OUTPUT 
inserted.id, 
inserted.TestJigNumber, 
inserted.JigDescription, 
inserted.JigStatus
WHERE id = @id
`);

return result.recordset[0];
} catch (error) {
console.error('Error updating TestJig:', error);
throw new Error('Failed to update TestJig');
}
};
export const deleteTest = async (id) => {
const pool = await poolPromise;
const result = await pool
.request()
.input('id', sql.UniqueIdentifier, id)
.query(`
DELETE FROM TestJigDetails
OUTPUT deleted.id, deleted.TestJigNumber, deleted.JigDescription, deleted.JigStatus
WHERE id = @id
`);
return result.recordset[0];
};
export const gettoday_yesterdayData = async (req, res) => {
try {
// Get today's and yesterday's dates
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);

// Format dates as 'YYYY-MM-DD'
const formatDate = (date) => date.toISOString().split('T')[0];
const todayStr = formatDate(today);
const yesterdayStr = formatDate(yesterday);

// List of stored procedures to call
const procedures = [
{ name: 'Functional', sp: 'SP_GetMeterCountPerDay_FunctionalTestDetails' },
{ name: 'Calibration', sp: 'SP_GetMeterCountPerDay_CalibrationTest' },
{ name: 'Accuracy', sp: 'SP_GetMeterCountPerDay_AccuracyTest' },
{ name: 'NICComTest', sp: 'SP_GetMeterCountPerDay_NICComTest' },
{ name: 'FinalTest', sp: 'SP_GetMeterCountPerDay_FinalTestDetails' }
];

const pool = await poolPromise;

// Final structure
const results = {
today: {},
yesterday: {}
};

for (const proc of procedures) {
// === Get today's data
const todayResult = await pool
.request()
.input('CurrentDateTime', todayStr)
.execute(proc.sp);

// === Get yesterday's data
const yesterdayResult = await pool
.request()
.input('CurrentDateTime', yesterdayStr)
.execute(proc.sp);

// Store results by name
results.today[proc.name] = todayResult.recordset || [];
results.yesterday[proc.name] = yesterdayResult.recordset || [];
}

// Return final response
return res.status(200).json({
success: true,
today: todayStr,
yesterday: yesterdayStr,
data: results
});
} catch (error) {
console.error('Error in gettoday_yesterdayData:', error);
return res.status(500).json({
success: false,
message: 'Error retrieving data from stored procedures',
error: error.message
});
}
};
export const getWeeklyDataAllTests = async (req, res) => {
try {
const today = new Date();

// Get Sunday of current week
const currentDay = today.getDay(); // 0 = Sunday
const currentWeekStart = new Date(today);
currentWeekStart.setDate(today.getDate() - currentDay);

// Get Sunday of previous week
const previousWeekStart = new Date(currentWeekStart);
previousWeekStart.setDate(currentWeekStart.getDate() - 7);

const formatDate = (date) => date.toISOString().split('T')[0];
const currentWeekStr = formatDate(currentWeekStart);
const previousWeekStr = formatDate(previousWeekStart);

const pool = await poolPromise;

const procedures = [
{ name: 'Functional', sp: 'SP_GetMeterCountPerWeek_FunctionalTestDetails', param: 'GivenDate' },
{ name: 'Calibration', sp: 'SP_GetMeterCountPerWeek_CalibrationTest', param: 'GivenDate' },
{ name: 'Accuracy', sp: 'SP_GetMeterCountPerWeek_AccuracyTest', param: 'GivenDate' }, // Weekly SP
{ name: 'NIC', sp: 'SP_GetMeterCountPerWeek_NICComTest', param: 'GivenDate' },
{ name: 'Final', sp: 'SP_GetMeterCountPerWeek_FinalTestDetails', param: 'GivenDate' } // Weekly SP
];

const results = {
currentWeek: {},
previousWeek: {}
};

for (const proc of procedures) {
const paramName = proc.param;

// === Current Week Data
const currentResult = await pool
.request()
.input(paramName, currentWeekStr)
.execute(proc.sp);

// === Previous Week Data
const previousResult = await pool
.request()
.input(paramName, previousWeekStr)
.execute(proc.sp);

results.currentWeek[proc.name] = currentResult.recordset || [];
results.previousWeek[proc.name] = previousResult.recordset || [];
}

return res.status(200).json({
success: true,
currentWeekStart: currentWeekStr,
previousWeekStart: previousWeekStr,
data: results
});

} catch (error) {
console.error('Error in getWeeklyDataAllTests:', error);
return res.status(500).json({
success: false,
message: 'Error retrieving weekly data from stored procedures',
error: error.message
});
}
};
export const getHourlyDataAllTests = async (req, res) => {
try {
const inputDate = req.body.dateTime ? new Date(req.body.dateTime) : new Date();
const pool = await poolPromise;

// Prepare both dates
const currentDate = new Date(inputDate);
const previousDate = new Date(inputDate);
previousDate.setDate(previousDate.getDate() - 1);

const procedures = [
{ name: 'Functional', sp: 'SP_GetMeterCountPerHour_FunctionalTestDetails', param: 'CurrentDateTime' },
{ name: 'Calibration', sp: 'SP_GetMeterCountPerHour_CalibrationTest', param: 'CurrentDateTime' },
{ name: 'Accuracy', sp: 'SP_GetMeterCountPerHour_AccuracyTest', param: 'CurrentDateTime' },
{ name: 'NIC', sp: 'SP_GetMeterCountPerHour_NICComTest', param: 'CurrentDateTime' },
{ name: 'FinalTest', sp: 'SP_GetMeterCountPerHour_FinalTestDetails', param: 'CurrentDateTime' }
];

// Helper to process resultsets
const processDataForDate = async (date) => {
const results = {};
const completedMap = {};

for (const proc of procedures) {
const response = await pool
.request()
.input(proc.param, date)
.execute(proc.sp);

const recordset = response.recordset || [];
results[proc.name] = recordset;

recordset.forEach(item => {
const { TimeSlot, Status, MeterCount } = item;
const startHour = TimeSlot?.split('-')[0];

if (!startHour || Status !== 'PASS') return;

if (!completedMap[startHour]) completedMap[startHour] = {};
if (!completedMap[startHour][proc.name]) completedMap[startHour][proc.name] = 0;

completedMap[startHour][proc.name] += MeterCount || 0;
});
}

return { results, completedMap };
};

// Process both dates
const currentDayData = await processDataForDate(currentDate);
const previousDayData = await processDataForDate(previousDate);

return res.status(200).json({
success: true,
currentDate: currentDate.toISOString().split('T')[0],
previousDate: previousDate.toISOString().split('T')[0],
data: {
current: {
fullData: currentDayData.results,
completedPerHour: currentDayData.completedMap
},
previous: {
fullData: previousDayData.results,
completedPerHour: previousDayData.completedMap
}
}
});

} catch (error) {
console.error('Error in getHourlyDataAllTests:', error);
return res.status(500).json({
success: false,
message: 'Error retrieving hourly data from stored procedures',
error: error.message
});
}
};











