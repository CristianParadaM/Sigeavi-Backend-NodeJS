const db = require('../../util/database')
const express = require('express');
const router = express.Router();
const { getDailyReports, createDailyReport, verifyDateReport, updateConsumption, updateDeaths } = require('../../util/consultas');

router.post('/:id_farm/:id_lot/daily_report/add', async (req, res) => {
   const { consumption, deaths } = req.body;
   const id_lot = req.params.id_lot;
   let date = new Date(Date.now()).toLocaleDateString('en-CA');
   const actualReport = await db.query(verifyDateReport, [date, id_lot]);
   console.log(actualReport);
   if (actualReport.length > 0) {
      if (consumption > 0) {
         await db.query(updateConsumption, [consumption, id_lot, date]);
      }
      if (deaths > 0) {
         await db.query(updateDeaths, [deaths, id_lot, date]);
      }
   } else {
      await db.query(createDailyReport, [date, deaths, consumption, parseInt(id_lot)]);
   }
   res.send(true)
});

router.get('/:id_farm/:id_lot/daily_report', async (req, res) => {
   const id = req.params.id_lot;
   const rows = await db.query(getDailyReports, [id]);
   res.send(rows);
});

module.exports = router;