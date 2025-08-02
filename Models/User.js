// models/userModel.js
import sql from 'mssql';
import { poolPromise } from '../Database/Database.js'; // your DB connection
import argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
dayjs.extend(customParseFormat);

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
.query('SELECT Top 100 * FROM FunctionalTestDetails');
return result.recordset; // Return all records
};
export const CalibrationSerialNumber = async () => {
const pool = await poolPromise;
const result = await pool
.request()
.query('SELECT Top 100 *  FROM CalibrationTest');

AccuracySerialNumber
return result.recordset; // Return all records
};
export const AccuracySerialNumber = async () => {
const pool = await poolPromise;
const result = await pool
.request()
.query('SELECT Top 100 * FROM AccuracyTest');


return result.recordset; // Return all records
};
export const NICSerialNumber = async () => {
const pool = await poolPromise;
const result = await pool
.request()
.query('SELECT Top 100 * FROM NICComTest');


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
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);

const formatDate = (date) => date.toISOString().split('T')[0];
const todayStr = formatDate(today);
const yesterdayStr = formatDate(yesterday);

const procedures = [
{
name: 'ShiftWiseSummary',
sp: 'SP_GetCountPerDay_DashboardResultDetails',
paramName: 'InputDateTime',
},
{
name: 'ShiftReworkSummary',
sp: 'SP_GetReworkCountPerDay',
paramName: 'InputDate',
},
];

const pool = await poolPromise;

const results = {
today: {},
yesterday: {},
};

for (const proc of procedures) {
// === Today's data
const todayRequest = pool.request();
todayRequest.input(proc.paramName, todayStr);
const todayResult = await todayRequest.execute(proc.sp);

// === Yesterday's data
const yesterdayRequest = pool.request();
yesterdayRequest.input(proc.paramName, yesterdayStr);
const yesterdayResult = await yesterdayRequest.execute(proc.sp);

// Handle multiple resultsets (only for ShiftWiseSummary)
const todayData =
proc.name === 'ShiftWiseSummary'
? {
shiftData: todayResult.recordsets[0] || [],
onlyPassData: todayResult.recordsets[1]?.[0] || {},
}
: todayResult.recordset || [];

const yesterdayData =
proc.name === 'ShiftWiseSummary'
? {
shiftData: yesterdayResult.recordsets[0] || [],
onlyPassData: yesterdayResult.recordsets[1]?.[0] || {},
}
: yesterdayResult.recordset || [];

results.today[proc.name] = todayData;
results.yesterday[proc.name] = yesterdayData;
}

return res.status(200).json({
success: true,
today: todayStr,
yesterday: yesterdayStr,
data: results,
});
} catch (error) {
console.error('Error in gettoday_yesterdayData:', error);
return res.status(500).json({
success: false,
message: 'Error retrieving data from stored procedures',
error: error.message,
});
}
};
export const getWeeklyDataAllTests = async (req, res) => {
try {
const today = new Date();

// Step 1: Compute Sunday (start of week) for current and previous week
const dayOfWeek = today.getDay(); // Sunday = 0
const currentWeekStart = new Date(today);
currentWeekStart.setDate(today.getDate() - dayOfWeek); // Go to last Sunday

const previousWeekStart = new Date(currentWeekStart);
previousWeekStart.setDate(currentWeekStart.getDate() - 7); // Previous Sunday

const pool = await poolPromise;

// Step 2: Execute both stored procedures for both weeks
const [
currentMainResult,
previousMainResult,
currentReworkResult,
previousReworkResult
] = await Promise.all([
pool.request().input('InputDateTime', currentWeekStart).execute('SP_GetCountPerWeek_DashboardResultDetails'),
pool.request().input('InputDateTime', previousWeekStart).execute('SP_GetCountPerWeek_DashboardResultDetails'),
pool.request().input('InputDate', currentWeekStart).execute('SP_GetReworkCountPerWeek'),
pool.request().input('InputDate', previousWeekStart).execute('SP_GetReworkCountPerWeek')
]);

const normalizeWeekRangeToDaily = (mainData = [], reworkData = []) => {
const reworkMap = {};

reworkData.forEach(entry => {
const dateKey = entry.DateRange?.split('to')[0]?.trim()?.replace(/-/g, '.');
reworkMap[dateKey] = entry;
});

return mainData.map(entry => {
const dateKey = entry.RecordDate?.split('to')[0]?.trim()?.replace(/-/g, '.');
const rework = reworkMap[dateKey] || {};

const computeTested = (test) => {
const pass = entry[`${test}_Pass`] || 0;
const fail = entry[`${test}_Fail`] || 0;
const reworkCount = rework[`${test}_Rework`] || 0;
return reworkCount === 0 ? pass + fail : pass + fail - reworkCount;
};

const Functional = computeTested('FunctionalTest');
const Calibration = computeTested('CalibrationTest');
const Accuracy = computeTested('AccuracyTest');
const NICCom = computeTested('NICComTest');
const FinalTest = computeTested('FinalTest');

const finalPass = entry.FinalTest_Pass || 0;
const finalFail = entry.FinalTest_Fail || 0;
const finalRework = rework.FinalTest_Rework || 0;
const Completed = finalRework === 0 ? finalPass + finalFail : finalPass + finalFail - finalRework;

const Rework =
(rework.FunctionalTest_Rework || 0) +
(rework.CalibrationTest_Rework || 0) +
(rework.AccuracyTest_Rework || 0) +
(rework.NICComTest_Rework || 0) +
(rework.FinalTest_Rework || 0);

// ✅ NEW: Total Fail count
const Fail =
(entry.FunctionalTest_Fail || 0) +
(entry.CalibrationTest_Fail || 0) +
(entry.AccuracyTest_Fail || 0) +
(entry.NICComTest_Fail || 0) +
(entry.FinalTest_Fail || 0);

return {
date: dateKey || '',
Functional,
Calibration,
Accuracy,
NICCom,
FinalTest,
Completed,
Rework,
FinalTest_Fail: finalFail,
Fail // ✅ Include total Fail
};
});
};


// Step 3: Normalize weekly results
const currentWeek = normalizeWeekRangeToDaily(currentMainResult.recordset, currentReworkResult.recordset);
const previousWeek = normalizeWeekRangeToDaily(previousMainResult.recordset, previousReworkResult.recordset);

// Step 4: Send response
return res.status(200).json({
success: true,
currentWeekStart: currentWeekStart.toISOString().split('T')[0],
previousWeekStart: previousWeekStart.toISOString().split('T')[0],
data: {
currentWeek,
previousWeek
}
});

} catch (error) {
console.error('Error in getWeeklyDataAllTests:', error);
return res.status(500).json({
success: false,
message: 'Error retrieving weekly data from stored procedure',
error: error.message
});
}
};
export const getHourlyDataAllTests = async (req, res) => {
try {
const inputDate = req.body.dateTime ? new Date(req.body.dateTime) : new Date();
const pool = await poolPromise;

const currentDate = new Date(inputDate);
const previousDate = new Date(inputDate);
previousDate.setDate(previousDate.getDate() - 1);

const fetchAndProcessData = async (date) => {
const response = await pool
.request()
.input('SelectedDate', date)
.execute('SP_GetCountPerHour_DashboardResultDetails');

const recordset = response.recordset || [];
const completedMap = {};
const fullData = [];

recordset.forEach(row => {
const timeSlot = row.TimeSlot;
if (!timeSlot) return;

fullData.push(row); // Optional: Keep full data for frontend use

const hour = timeSlot.split('-')[0];
if (!completedMap[hour]) completedMap[hour] = {};

const calculateCompleted = (pass, fail, rework) =>
(pass || 0) + (fail || 0) - (rework || 0);

// Only FinalTest considered completed (you can adjust logic if needed)
completedMap[hour]['FinalTest'] = calculateCompleted(
row.FinalTest_Pass,
row.FinalTest_Fail,
row.FinalTest_Rework
);

// Optional: Include other test types
completedMap[hour]['Functional'] = (row.FunctionalTest_Pass || 0);
completedMap[hour]['Calibration'] = (row.CalibrationTest_Pass || 0);
completedMap[hour]['Accuracy'] = (row.AccuracyTest_Pass || 0);
completedMap[hour]['NIC'] = (row.NICComTest_Pass || 0);
});

return { fullData, completedMap };
};

const currentDayData = await fetchAndProcessData(currentDate);
const previousDayData = await fetchAndProcessData(previousDate);

return res.status(200).json({
success: true,
currentDate: currentDate.toISOString().split('T')[0],
previousDate: previousDate.toISOString().split('T')[0],
data: {
current: {
fullData: currentDayData.fullData,
completedPerHour: currentDayData.completedMap
},
previous: {
fullData: previousDayData.fullData,
completedPerHour: previousDayData.completedMap
}
}
});

} catch (error) {
console.error('Error in getHourlyDataAllTests:', error);
return res.status(500).json({
success: false,
message: 'Error retrieving hourly data from stored procedure',
error: error.message
});
}
};

export const getDailyShiftData = async (req, res) => {
try {
const inputDate = req.body.dateTime;

if (!inputDate) {
return res.status(400).json({
success: false,
message: '❗ Missing date input',
});
}

const parsedDate = new Date(inputDate);
if (isNaN(parsedDate)) {
return res.status(400).json({
success: false,
message: '❗ Invalid date format. Use YYYY-MM-DD',
});
}

const formattedDate = parsedDate.toISOString().split('T')[0];

const pool = await poolPromise;

const result = await pool
.request()
.input('InputDateTime', formattedDate)
.execute('SP_GetCountPerDay_DashboardResultDetails');

return res.status(200).json({
success: true,
date: formattedDate,
data: {
ShiftWiseSummary: result.recordset || [],
},
});
} catch (error) {
console.error('❌ Error in getDailyShiftData:', error);
return res.status(500).json({
success: false,
message: 'Error retrieving data for the selected day',
error: error.message,
});
}
};

/* Daily Report & Preiodic Report*/
export const getDailyHourlyData = async (req, res) => {
try {
const inputDate = req.body.dateTime;

if (!inputDate) {
return res.status(400).json({
success: false,
message: '❗ Missing date input',
});
}

const parsedDate = new Date(inputDate);
if (isNaN(parsedDate)) {
return res.status(400).json({
success: false,
message: '❗ Invalid date format. Use YYYY-MM-DD',
});
}

const currentDate = new Date(parsedDate);
const previousDate = new Date(parsedDate);
previousDate.setDate(previousDate.getDate() - 1);

const pool = await poolPromise;

const fetchAndProcessData = async (date) => {
const result = await pool
.request()
.input('SelectedDate', date)
.execute('SP_GetCountPerHour_DashboardResultDetails');

const recordset = result.recordset || [];
const fullData = [];
const completedMap = {};

recordset.forEach((row) => {
const timeSlot = row.TimeSlot;
if (!timeSlot) return;

fullData.push(row); // Keep full raw entry

const hour = timeSlot.split('-')[0];
if (!completedMap[hour]) completedMap[hour] = {};

const calculateCompleted = (pass, fail, rework) =>
(pass || 0) + (fail || 0) - (rework || 0);

completedMap[hour]['FinalTest'] = calculateCompleted(
row.FinalTest_Pass,
row.FinalTest_Fail,
row.FinalTest_Rework
);

completedMap[hour]['Functional'] = row.FunctionalTest_Pass || 0;
completedMap[hour]['Calibration'] = row.CalibrationTest_Pass || 0;
completedMap[hour]['Accuracy'] = row.AccuracyTest_Pass || 0;
completedMap[hour]['NIC'] = row.NICComTest_Pass || 0;
});

return { fullData, completedMap };
};

const currentDayData = await fetchAndProcessData(currentDate);
const previousDayData = await fetchAndProcessData(previousDate);

return res.status(200).json({
success: true,
message: '✅ Hourly test data fetched successfully',
date: {
current: currentDate.toISOString().split('T')[0],
previous: previousDate.toISOString().split('T')[0],
},
data: {
current: {
fullData: currentDayData.fullData,
completedPerHour: currentDayData.completedMap,
},
previous: {
fullData: previousDayData.fullData,
completedPerHour: previousDayData.completedMap,
},
},
});
} catch (error) {
console.error('❌ Error in getHourlyDataAllTests:', error);
return res.status(500).json({
success: false,
message: '❌ Error retrieving hourly data from stored procedure',
error: error.message,
});
}
};
export const getMonthlyDataAllTests = async (req, res) => {
try {
const { monthName, year } = req.body;   // ✅ use req.body for POST

if (!monthName || !year) {
return res.status(400).json({
success: false,
message: 'Month name and Year are required (e.g. {monthName: "July", year: 2025})',
});
}

const pool = await poolPromise;

// ✅ remove InputYear if your SP doesn't support it
const result = await pool
.request()
.input('InputMonthName', monthName)
//.input('InputYear', parseInt(year, 10))  // ✅ comment out if SP doesn't accept year
.execute('SP_GetCountPerMonth_DashboardResultDetails');

const rawData = result.recordset || [];
if (!rawData.length) {
return res.status(200).json({ success: true, data: [] });
}

// ✅ normalization remains same
const normalizedData = rawData.map(entry => {
const date = entry.RecordDate?.split('to')[0]?.trim()?.replace(/-/g, '.');
const computeTested = (test) => {
const pass = entry[`${test}_Pass`] || 0;
const fail = entry[`${test}_Fail`] || 0;
const rework = entry[`${test}_Rework`] || 0;
return rework === 0 ? pass + fail : pass + fail - rework;
};

return {
date: date || '',
Functional: computeTested('FunctionalTest'),
Calibration: computeTested('CalibrationTest'),
Accuracy: computeTested('AccuracyTest'),
NICCom: computeTested('NICComTest'),
FinalTest: computeTested('FinalTest'),
Completed: (entry.FinalTest_Pass || 0) + (entry.FinalTest_Fail || 0) - (entry.FinalTest_Rework || 0),
Rework: (entry.FunctionalTest_Rework || 0) + (entry.CalibrationTest_Rework || 0) +
(entry.AccuracyTest_Rework || 0) + (entry.NICComTest_Rework || 0) +
(entry.FinalTest_Rework || 0),
FinalTest_Fail: entry.FinalTest_Fail || 0
};
});

return res.status(200).json({ success: true, data: normalizedData });

} catch (error) {
console.error('Error in getMonthlyDataAllTests:', error);
return res.status(500).json({
success: false,
message: 'Internal Server Error',
error: error.message,
stack: error.stack
});
}
};
export const getPeriodicDataAllTests = async (req, res) => {
try {
const { startDate, endDate } = req.body;

// 🔒 Input Validation
if (!startDate || !endDate) {
return res.status(400).json({
success: false,
message: 'Both startDate and endDate are required. Format: YYYY-MM-DD',
});
}

const pool = await poolPromise;

const result = await pool
.request()
.input('StartDate', startDate)
.input('EndDate', endDate)
.execute('SP_GetCountPeriodic_DashboardResultDetails');

const rawData = result.recordset || [];

if (!rawData.length) {
return res.status(200).json({ success: true, data: [] });
}

// 🛠 Normalize + Filter by actual date
const normalizedData = rawData
.map((entry) => {
const recordRange = entry.RecordDate; // Example: "01-08-2025 to 02-08-2025"
const startDateStr = recordRange?.split('to')[0]?.trim(); // "01-08-2025"

if (!startDateStr) return null;

const [dd, mm, yyyy] = startDateStr.split('-');
const parsedDate = new Date(`${yyyy}-${mm}-${dd}`); // "2025-08-01"

// ✅ Compare parsed date with range
const start = new Date(startDate);
const end = new Date(endDate);
start.setHours(0, 0, 0, 0);
end.setHours(23, 59, 59, 999);

if (isNaN(parsedDate) || parsedDate < start || parsedDate > end) {
return null; // ❌ Skip entries outside range
}

const computeTested = (test) => {
const pass = entry[`${test}_Pass`] || 0;
const fail = entry[`${test}_Fail`] || 0;
const rework = entry[`${test}_Rework`] || 0;
return rework === 0 ? pass + fail : pass + fail - rework;
};

return {
date: `${dd}.${mm}.${yyyy}`, // Output in DD.MM.YYYY format
Functional: computeTested('FunctionalTest'),
Calibration: computeTested('CalibrationTest'),
Accuracy: computeTested('AccuracyTest'),
NICCom: computeTested('NICComTest'),
FinalTest: computeTested('FinalTest'),
Completed:
(entry.FinalTest_Pass || 0) +
(entry.FinalTest_Fail || 0) -
(entry.FinalTest_Rework || 0),
Rework:
(entry.FunctionalTest_Rework || 0) +
(entry.CalibrationTest_Rework || 0) +
(entry.AccuracyTest_Rework || 0) +
(entry.NICComTest_Rework || 0) +
(entry.FinalTest_Rework || 0),
FinalTest_Fail: entry.FinalTest_Fail || 0
};
})
.filter((item) => item !== null); // ✅ Remove invalid/out-of-range entries

return res.status(200).json({ success: true, data: normalizedData });
} catch (error) {
console.error('❌ Error in getPeriodicDataAllTests:', error);
return res.status(500).json({
success: false,
message: 'Internal Server Error',
error: error.message,
stack: error.stack,
});
}
};









// ✅ Get all table names from the database
export const getAllTableNames = async () => {
const pool = await poolPromise;
const result = await pool.request().query(`
SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE'
`);
return result.recordset.map(row => row.TABLE_NAME); // ✅ Just return the data
};
// ✅ Get all rows from a selected table (safe version)
export const getTableData = async (tableName, fromDate, toDate) => {
const pool = await poolPromise;

// Sanitize table name
const sanitized = tableName.replace(/[^a-zA-Z0-9_]/g, '');

// List of known datetime/date columns
const possibleDateColumns = ['CreatedAt', 'CreatedDate', 'TimeStamp', 'DateTime', 'UpdatedAt'];

try {
// Fetch sample row to detect available columns
const columnResult = await pool
.request()
.query(`SELECT TOP 1 * FROM [${sanitized}]`);

const columns = Object.keys(columnResult.recordset[0] || {});
const filterColumn = possibleDateColumns.find(col => columns.includes(col));

// If no matching date column, return empty list
if (!filterColumn) {
console.warn(`⚠️ No valid date column found in table ${sanitized}`);
return [];
}

// Build and run date-filtered query
const query = `
SELECT * FROM [${sanitized}]
WHERE CAST([${filterColumn}] AS DATE)
BETWEEN CAST(@fromDate AS DATE) AND CAST(@toDate AS DATE) Order by [${filterColumn}] ASC
`;
console.log(`query: ${toDate}`); // ✅ Debugging log

const result = await pool
.request()
.input('fromDate', new Date(fromDate))
.input('toDate', new Date(toDate))
.query(query);

return result.recordset;

} catch (err) {
console.error(`❌ Failed to fetch table: ${sanitized}`, err);
throw err;
}
};






