const maintenanceWorkerModel = require('../models/maintenanceWorkerModel');

const maintenanceWorkerController = {
  getAllWorkers: async (req, res) => {
    try {
      const workers = await maintenanceWorkerModel.getAllWorkers();
      res.render('maintenance_worker', { workers });
    } catch (error) {
      console.error('Error in getAllWorkers:', error);
      res.status(500).send('Internal Server Error');
    }
  },

  addWorker: async (req, res) => {
    try {
      const { suervery_results, edit_details, finish_date, time_taken, req_id } = req.body;
      const newWorkerId = await maintenanceWorkerModel.addWorker({ 
        suervery_results, 
        edit_details, 
        finish_date, 
        time_taken, 
        req_id 
      });
      res.redirect('/maintenance_worker');
    } catch (error) {
      console.error('Error in addWorker:', error);
      res.status(500).send('Internal Server Error');
    }
  },

  updateWorker: async (req, res) => {
    try {
      const { worker_id, suervery_results, edit_details, finish_date, time_taken, req_id } = req.body;
      const success = await maintenanceWorkerModel.updateWorker(worker_id, { 
        suervery_results, 
        edit_details, 
        finish_date, 
        time_taken, 
        req_id 
      });
      res.redirect('/maintenance_worker');
    } catch (error) {
      console.error('Error in updateWorker:', error);
      res.status(500).send('Internal Server Error');
    }
  },

  deleteWorker: async (req, res) => {
    try {
      const { worker_id } = req.params;
      const success = await maintenanceWorkerModel.deleteWorker(worker_id);
      res.redirect('/maintenance_worker');
    } catch (error) {
      console.error('Error in deleteWorker:', error);
      res.status(500).send('Internal Server Error');
    }
  }
};

module.exports = maintenanceWorkerController;