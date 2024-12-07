const detailsRepairingModel = require('../models/detailsRepairingModel');

const detailsRepairingController = {
  getRepairDetails: async (req, res) => {
    try {
      const req_id = req.params.id;
      let repairDetails = await detailsRepairingModel.getRepairDetails(req_id);
      
      if (!repairDetails) {
        return res.status(404).send('Repair details not found');
      }
      
      // ตรวจสอบว่ามีรูปภาพหรือไม่
      ['r_pic1', 'r_pic2', 'r_pic3'].forEach(pic => {
        if (!repairDetails[pic]) {
          repairDetails[pic] = null;
        }
      });

      // Log the repairDetails to check if all fields are present
      console.log('Repair Details:', repairDetails);

      res.render('details_repairing', { repairDetails });
    } catch (error) {
      console.error('Error fetching repair details:', error);
      res.status(500).send('Internal Server Error');
    }
  }
};

module.exports = detailsRepairingController;