const { sql, getTableName, tableExists } = require('../db/connection');

class BioStarService {
  // Query data for specific date and time range
  static async getDataByDate(date, startTime, endTime) {
    try {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const tableName = getTableName(year, month);
      console.log('Querying table:', tableName);

      // Check if table exists
      const exists = await tableExists(tableName);
      if (!exists) {
        throw new Error(`Table ${tableName} does not exist`);
      }

      // Format date for SQL query (YYYY-MM-DD)
      const dateStr = date.toISOString().split('T')[0];

      const request = new sql.Request();
      request.input('dateStr', sql.VarChar, dateStr);
      request.input('startTime', sql.VarChar, startTime);
      request.input('endTime', sql.VarChar, endTime);

      const result = await request.query(`
        SELECT 
          EVTLGUID as event_id,
          SRVDT as DateTime,
          DEVDT as ActualDateTime,
          DEVUID as device_id,
          USRID as Emp_No,
          EVT as event_type,
          DRUID as door_id,
          CASE 
            WHEN DEVUID = 4865 THEN 'Entry'
            WHEN DEVUID = 4867 THEN 'Exit'
            WHEN EVT = 20480 THEN 'System Event'
            ELSE 'Unknown'
          END as event_description,
          CASE 
            WHEN USRID IS NOT NULL THEN 'User Event'
            ELSE 'System Event'
          END as event_category
        FROM [${tableName}]
        WHERE CAST(SRVDT AS DATE) = @dateStr
        AND CAST(SRVDT AS TIME) BETWEEN @startTime AND @endTime
        ORDER BY SRVDT DESC
      `);

      return {
        table: tableName,
        data: result.recordset,
        Total: result.recordset.length
      };
    } catch (error) {
      throw new Error(`Database query failed: ${error.message}`);
    }
  }
}

module.exports = BioStarService;