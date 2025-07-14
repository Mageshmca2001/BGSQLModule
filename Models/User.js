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

export const getrecordsdetails = async() => {
const pool = await poolPromise;
const result  = await pool
.request()
.query('');

return result.recordset;

};