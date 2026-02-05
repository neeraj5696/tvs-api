const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

const connectDB = async () => {
  try {
    await sql.connect(config);
    console.log('✅ SQL Server connected successfully');
  } catch (error) {
    console.error('❌ SQL Server connection failed:', error.message);
    throw error;
  }
};

// Generate table name based on month and year
const getTableName = (year, month) => {
  const monthStr = String(month).padStart(2, '0');
  return `T_LG${year}${monthStr}`;
};

// Check if table exists
const tableExists = async (tableName) => {
  try {
    const request = new sql.Request();
    request.input('tableName', sql.VarChar, tableName);
    const result = await request.query(`
      SELECT TABLE_NAME
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_TYPE = 'BASE TABLE'
        AND TABLE_NAME = @tableName
    `);
    return result.recordset.length > 0;
  } catch (error) {
    console.error('❌ Error checking table existence:', error.message);
    throw error;
  }
};

module.exports = { connectDB, sql, getTableName, tableExists };