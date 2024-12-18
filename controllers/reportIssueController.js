const reportIssueModel = require('../models/reportIssueModel');

const reportIssueController = {
  showReportIssuePage: async (req, res) => {
    try {
      const reports = await reportIssueModel.getReports();
      const repairTypeCounts = await reportIssueModel.getRepairTypeCounts();
      res.render('report_issue', {
        title: 'Report Issue',
        reports: reports,
        repairTypeCounts: repairTypeCounts,
        user: req.session
      });
    } catch (error) {
      console.error('Error in showReportIssuePage:', error);
      res.status(500).render('error', { message: 'An error occurred while loading the report page.' });
    }
  },

  generateReport: async (req, res) => {
    try {
      const { startDate, endDate } = req.body;
      const reportData = await reportIssueModel.getReportsByDateRange(startDate, endDate);
      res.json(reportData);
    } catch (error) {
      console.error('Error in generateReport:', error);
      res.status(500).json({ error: 'An error occurred while generating the report.' });
    }
  },

  getRepairTypeCounts: async (req, res) => {
    try {
      const repairTypeCounts = await reportIssueModel.getRepairTypeCounts();
      res.json(repairTypeCounts);
    } catch (error) {
      console.error('Error in getRepairTypeCounts:', error);
      res.status(500).json({ error: 'An error occurred while fetching repair type counts.' });
    }
  },

  getRepairTypesData: async (req, res) => {
    try {
      const { month, year } = req.query;
      const data = await reportIssueModel.getRepairTypeCounts(month, year);
      res.json(data);
    } catch (error) {
      console.error('Error in getRepairTypesData:', error);
      res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
  },

  getDepartmentRequestsData: async (req, res) => {
    try {
      const { month, year } = req.query;
      const data = await reportIssueModel.getDepartmentRequestsCounts(month, year);
      res.json(data);
    } catch (error) {
      console.error('Error in getDepartmentRequestsData:', error);
      res.status(500).json({ error: 'An error occurred while fetching department requests data.' });
    }
  }
};

module.exports = reportIssueController;