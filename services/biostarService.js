const { sql, getTableName, tableExists } = require('../db/connection');
const { deviceStatus } = require('./device_status');


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
       L.DEVDT AS Date,
       L.USRID AS Emp_No,       
       L.SRVDT,             
       L.EVT,
        CASE 
            WHEN L.EVT = 15104 THEN 'Online'
            WHEN L.EVT = 15360 THEN 'Offline'
            ELSE 'Unknown'
       END AS Device_Status_at_logTime,
       L.DEVUID AS Reader_Id,
       D.NM AS Reader_Description,
       E.NM AS Swipe_Status_Message
      FROM [${tableName}] L
      INNER JOIN dbo.T_DEV D
       ON L.DEVUID = D.DEVID
      INNER JOIN dbo.T_EVTTYP E
       ON L.EVT = E.EVT
      WHERE CAST(L.SRVDT AS DATE) = @dateStr
      AND CAST(L.SRVDT AS TIME) BETWEEN @startTime AND @endTime
      ORDER BY L.SRVDT DESC;

      `);

      // Convert Unix timestamp to formatted date-time for each record
      const IN_DEVUID = process.env.IN_DEVUID ? process.env.IN_DEVUID.split(',').map(id => parseInt(id.trim())) : [];
      const OUT_DEVUID = process.env.OUT_DEVUID ? process.env.OUT_DEVUID.split(',').map(id => parseInt(id.trim())) : [];
      const SUCCESS_EVT = process.env.SUCCESS_EVT ? process.env.SUCCESS_EVT.split(',').map(id => parseInt(id.trim())) : [];
      const FAIL_EVT = process.env.FAIL_EVT ? process.env.FAIL_EVT.split(',').map(id => parseInt(id.trim())) : [];

      console.log('SUCCESS_EVT:', SUCCESS_EVT);
      console.log('FAIL_EVT:', FAIL_EVT);

      const formattedData = result.recordset.map(record => {
        const timestamp = record.Date;
        const date = new Date(timestamp * 1000);
        const formattedDateTime =
          date.getFullYear() + '-' +
          String(date.getMonth() + 1).padStart(2, '0') + '-' +
          String(date.getDate()).padStart(2, '0') + ' ' +
          String(date.getHours()).padStart(2, '0') + ':' +
          String(date.getMinutes()).padStart(2, '0') + ':' +
          String(date.getSeconds()).padStart(2, '0');

        const timeOnly =
          String(date.getHours()).padStart(2, '0') + ':' +
          String(date.getMinutes()).padStart(2, '0') + ':' +
          String(date.getSeconds()).padStart(2, '0');

        const baseRecord = {
          Date: formattedDateTime,
          Emp_No: record.Emp_No
        };

        if (IN_DEVUID.includes(record.Reader_Id)) {
          baseRecord.Entry_Time = timeOnly;
          baseRecord.Exit_Time = "N/A";
        } else if (OUT_DEVUID.includes(record.Reader_Id)) {
          baseRecord.Entry_Time = "N/A";
          baseRecord.Exit_Time = timeOnly;
        } else {
          baseRecord.Time = timeOnly;
        }

        baseRecord.Reader_Id = record.Reader_Id;
        baseRecord.Reader_Description = record.Reader_Description;

        if(SUCCESS_EVT.includes(record.EVT)){
          baseRecord.Status = "Success";
        } else if(FAIL_EVT.includes(record.EVT)){
          baseRecord.Status = "Fail";
        } else {
          baseRecord.Status = "Unknown";
        }

        baseRecord.Swipe_Status_Message = record.Swipe_Status_Message;

        // later SRVDT AND EVT WILL REMOVED
        baseRecord.SRVDT = record.SRVDT;
        baseRecord.EVT = record.EVT;
        baseRecord.Device_Status_at_logTime = record.Device_Status_at_logTime;

        if(FAIL_EVT.includes(record.EVT)){
          baseRecord.Description = record.Swipe_Status_Message;
        }

        return baseRecord;
      });

      return {
        table: tableName,
        data: formattedData,
        Total: formattedData.length
      };
    } catch (error) {
      throw new Error(`Database query failed: ${error.message}`);
    }
  }
}

module.exports = BioStarService;