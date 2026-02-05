const BioStarService = require('../services/biostarService');

class BioStarController {
  static async getDataByDate(req, res, next) {
    try {
      const { date, Start_time, End_time } = req.body;

      // Validate required fields
      if (!date) {
        return res.status(400).json({
          status: 'error',
          message: 'Date field is required. Use format: YYYY-MM-DD'
        });
      }
      if (!Start_time) {
        return res.status(400).json({
          status: 'error',
          message: 'Start_time field is required. Use format: HH:mm:ss'
        });
      }
      if (!End_time) {
        return res.status(400).json({
          status: 'error',
          message: 'End_time field is required. Use format: HH:mm:ss'
        });
      }

      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid date format. Use YYYY-MM-DD'
        });
      }

      // Validate time format (HH:mm:ss)
      const timeRegex = /^\d{2}:\d{2}:\d{2}$/;
      if (!timeRegex.test(Start_time)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid Start_time format. Use HH:mm:ss'
        });
      }
      if (!timeRegex.test(End_time)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid End_time format. Use HH:mm:ss'
        });
      }

      // Parse and validate date
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid date. Use YYYY-MM-DD format'
        });
      }

      // Get data from service
      const result = await BioStarService.getDataByDate(parsedDate, Start_time, End_time);

      res.status(200).json({
        statusText: 'success',
        status: 200,
        Total: result.Total,
        date: date,
        Start_time: Start_time,
        End_time: End_time,
        table: result.table,
        data: result.data
      });

    } catch (error) {
      next(error);
    }
  }
}

module.exports = BioStarController;