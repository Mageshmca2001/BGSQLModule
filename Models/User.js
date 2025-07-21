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
export const getHourlyMeterCountsAllTests = async (req, res) => {
try {
const pool = await poolPromise;

// Get requested date (default: today), and force to 00:00:00
const inputDateTime = req.body.dateTime ? new Date(req.body.dateTime) : new Date();
const presentDate = new Date(inputDateTime);
presentDate.setHours(0, 0, 0, 0); // ✅ Important fix

const previousDate = new Date(presentDate);
previousDate.setDate(presentDate.getDate() - 1);

// All meter test SPs (all statuses)
const procedures = [
{ name: 'Functional', sp: 'SP_GetMeterCountPerHour_FunctionalTestDetails' },
{ name: 'Calibration', sp: 'SP_GetMeterCountPerHour_CalibrationTest' },
{ name: 'Accuracy', sp: 'SP_GetMeterCountPerHour_AccuracyTest' },
{ name: 'NIC', sp: 'SP_GetMeterCountPerHour_NICComTest' },
{ name: 'FinalTest', sp: 'SP_GetMeterCountPerHour_FinalTestDetails' }
];

// SPs for Status = 'Pass' counts
const passProcedures = [
{ name: 'Functional', sp: 'SP_GetMeterCountPerHour_FunctionalTestDetails' },
{ name: 'Calibration', sp: 'SP_GetMeterCountPerHour_CalibrationTest' },
{ name: 'Accuracy', sp: 'SP_GetMeterCountPerHour_AccuracyTest' },
{ name: 'NIC', sp: 'SP_GetMeterCountPerHour_NICComTest' },
{ name: 'FinalTest', sp: 'SP_GetMeterCountPerHour_FinalTestDetails' }
];

const presentResults = {};
const presentPassResults = {};
const presentStatus = {};

// Fetch all data (all statuses)
for (const proc of procedures) {
const result = await pool
.request()
.input('CurrentDateTime', presentDate)
.execute(proc.sp);

presentResults[proc.name] = result.recordset || [];
presentStatus[proc.name] = presentResults[proc.name].reduce((sum, e) => sum + (e.MeterCount || 0), 0);
}

// Fetch pass-only data
for (const proc of passProcedures) {
const result = await pool
.request()
.input('CurrentDateTime', presentDate)
.execute(proc.sp);

presentPassResults[proc.name] = result.recordset || [];
}

// Hour label formatter: 06:00 - 07:00
const formatHourLabel = (hour) => {
const pad = (n) => n.toString().padStart(2, '0');
const h1 = pad(hour);
const h2 = pad((hour + 1) % 24);
return `${h1}:00 - ${h2}:00`;
};

// Merge both all-status and pass-only data
const mergeHourlyData = (results, passResults) => {
const hourlyMap = {};
const passMap = {};

// Process all results
for (const category in results) {
for (const entry of results[category]) {
const hour = entry.Hour;
const count = entry.MeterCount;
if (typeof hour !== 'number' || hour < 0 || hour > 23) continue;

const label = formatHourLabel(hour);
if (!hourlyMap[label]) hourlyMap[label] = { time: label };
hourlyMap[label][category] = (hourlyMap[label][category] || 0) + count;
}
}

// Process pass-only results
for (const category in passResults) {
for (const entry of passResults[category]) {
const hour = entry.Hour;
const count = entry.MeterCount;
if (typeof hour !== 'number' || hour < 0 || hour > 23) continue;

const label = formatHourLabel(hour);
if (!passMap[label]) passMap[label] = {};
passMap[label][category] = (passMap[label][category] || 0) + count;
}
}

const orderedHours = [...Array(24).keys()].map(i => (i + 6) % 24); // 06:00 to 05:00
const fullList = [];

for (const hour of orderedHours) {
const label = formatHourLabel(hour);
const base = { time: label };
let completed = 0;

for (const proc of procedures) {
const name = proc.name;
base[name] = (hourlyMap[label] && hourlyMap[label][name]) || 0;

const passCount = (passMap[label] && passMap[label][name]) || 0;
completed += passCount;
}

base.Completed = completed;
fullList.push(base);
}

return fullList;
};

const hourlyDetails = mergeHourlyData(presentResults, presentPassResults);

return res.status(200).json({
success: true,
requestedDateTime: presentDate,
hourlyDetails,
presentStatus
});

} catch (error) {
console.error('Error in getHourlyMeterCountsAllTests:', error);
return res.status(500).json({
success: false,
message: 'Error retrieving hourly meter counts',
error: error.message
});
}
};









