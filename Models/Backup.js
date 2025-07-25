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
{ name: 'ShiftWiseSummary', sp: 'SP_GetCountPerDay_DashboardResultDetails' }, // new shift-wise SP
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
.input('InputDateTime', todayStr)
.execute(proc.sp);

// === Get yesterday's data
const yesterdayResult = await pool
.request()
.input('InputDateTime', yesterdayStr)
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

    const pool = await poolPromise;

    const results = {
      currentWeekRaw: [],
      previousWeekRaw: [],
      currentWeek: [],
      previousWeek: []
    };

    // === Current Week Data
    const currentResult = await pool
      .request()
      .input('InputDateTime', currentWeekStart)
      .execute('SP_GetCountPerWeek_DashboardResultDetails');

    results.currentWeekRaw = currentResult.recordset || [];

    // === Previous Week Data
    const previousResult = await pool
      .request()
      .input('InputDateTime', previousWeekStart)
      .execute('SP_GetCountPerWeek_DashboardResultDetails');

    results.previousWeekRaw = previousResult.recordset || [];

    // === Normalize Weekly Data
    const normalizeWeekRangeToDaily = (rawWeekData = []) => {
      return rawWeekData.map((entry) => {
        const dateMatch = entry.RecordDate?.split(' ')[0]?.replace(/-/g, '.');

        const functional = (entry.FunctionalTest_Pass || 0) + (entry.FunctionalTest_Fail || 0);
        const calibration = (entry.CalibrationTest_Pass || 0) + (entry.CalibrationTest_Fail || 0);
        const accuracy = (entry.AccuracyTest_Pass || 0) + (entry.AccuracyTest_Fail || 0);
        const niccom = (entry.NICComTest_Pass || 0) + (entry.NICComTest_Fail || 0);
        const finalTest = (entry.FinalTest_Pass || 0) + (entry.FinalTest_Fail || 0);

        const completed =
          (entry.FunctionalTest_Pass || 0) +
          (entry.CalibrationTest_Pass || 0) +
          (entry.AccuracyTest_Pass || 0) +
          (entry.NICComTest_Pass || 0) +
          (entry.FinalTest_Pass || 0);

        const fail =
          (entry.FunctionalTest_Fail || 0) +
          (entry.CalibrationTest_Fail || 0) +
          (entry.AccuracyTest_Fail || 0) +
          (entry.NICComTest_Fail || 0) +
          (entry.FinalTest_Fail || 0);

        const rework =
          (entry.FunctionalTest_Rework || 0) +
          (entry.CalibrationTest_Rework || 0) +
          (entry.AccuracyTest_Rework || 0) +
          (entry.NICComTest_Rework || 0) +
          (entry.FinalTest_Rework || 0);

        return {
          date: dateMatch || '',
          Functional: functional,
          Calibration: calibration,
          Accuracy: accuracy,
          NICCom: niccom,
          FinalTest: finalTest,
          Completed: completed,
          Fail: fail,
          Rework: rework
        };
      });
    };

    results.currentWeek = normalizeWeekRangeToDaily(results.currentWeekRaw);
    results.previousWeek = normalizeWeekRangeToDaily(results.previousWeekRaw);

    return res.status(200).json({
      success: true,
      currentWeekStart: currentWeekStart.toISOString().split('T')[0],
      previousWeekStart: previousWeekStart.toISOString().split('T')[0],
      data: {
        currentWeek: results.currentWeek,
        previousWeek: results.previousWeek
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
BETWEEN CAST(@fromDate AS DATE) AND CAST(@toDate AS DATE)
`;

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






