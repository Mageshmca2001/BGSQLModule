import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config = {
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
server: process.env.DB_HOST,    // <-- THIS MUST EXIST AND BE STRING
database: process.env.DB_DATABASE,
port: parseInt(process.env.DB_PORT, 10) || 1433,
options: {
  encrypt: true,
  trustServerCertificate: true,
}
};

export const poolPromise = sql.connect(config);


async function connectDB() {
try {
const pool = await sql.connect(config);
console.log('Connected to DB');
return pool;
} catch (err) {
console.error('DB Connection Error:', err);
}
}

export default connectDB;
