const ReportIssueModel = require('../models/reportIssueModel');

const reportIssueController = {
  showReportIssuePage: async (req, res) => {
    try {
      const reports = await ReportIssueModel.getReports();
      res.render('report_issue', { 
        title: 'Report Issue',
        reports: reports,
        user: req.session // Assuming user data is stored in session
      });
    } catch (error) {
      console.error('Error in showReportIssuePage:', error);
      res.status(500).render('error', { message: 'An error occurred while loading the report page.' });
    }
  },

  generateReport: async (req, res) => {
    try {
      const { startDate, endDate } = req.body;
      const reportData = await ReportIssueModel.generateReport(startDate, endDate);
      res.json(reportData);
    } catch (error) {
      console.error('Error in generateReport:', error);
      res.status(500).json({ error: 'An error occurred while generating the report.' });
    }
  }
};

module.exports = reportIssueController;