const db = require('../../util/database')
const express = require('express');
const router = express.Router();
const {getReportDailyFood, getReportFoodAll, getReportDailyWater, getReportWaterAll, getReportDailyDeath, getReportDeathAll, getReportDailyCosts, getReportCostsAll} = require("../../util/consultas");

router.get('/:id_farm/report/dailyFood/:initialDate/:finalDate', async (req, res) => {
    const {id_farm, initialDate, finalDate } = req.params;
    const rows = await db.query(getReportDailyFood, [initialDate, finalDate, id_farm]);
    res.send(rows);
});

router.get('/:id_farm/report/foodAll/:initialDate/:finalDate', async (req, res) => {
    const {id_farm, initialDate, finalDate } = req.params;
    const rows = await db.query(getReportFoodAll, [initialDate, finalDate, id_farm]);
    res.send(rows);
});

router.get('/:id_farm/report/dailyWater/:initialDate/:finalDate', async (req, res) => {
    const {id_farm, initialDate, finalDate} = req.params;
    const rows = await db.query(getReportDailyWater, [initialDate, finalDate, id_farm]);
    res.send(rows);
});

router.get('/:id_farm/report/waterAll/:initialDate/:finalDate', async (req, res) => {
    const {id_farm, initialDate, finalDate} = req.params;
    const rows = await db.query(getReportWaterAll, [initialDate, finalDate, id_farm]);
    res.send(rows);
});

router.get('/:id_farm/report/dailyDeath/:initialDate/:finalDate', async (req, res) => {
    const {id_farm, initialDate, finalDate} = req.params;
    const rows = await db.query(getReportDailyDeath, [initialDate, finalDate, id_farm]);
    res.send(rows);
});

router.get('/:id_farm/report/deathAll/:initialDate/:finalDate', async (req, res) => {
    const {id_farm, initialDate, finalDate} = req.params;
    const rows = await db.query(getReportDeathAll, [initialDate, finalDate, id_farm]);
    res.send(rows);
});

router.get('/:id_farm/report/dailyCost/:initialDate/:finalDate', async (req, res) => {
    const {id_farm, initialDate, finalDate} = req.params;
    const rows = await db.query(getReportDailyCosts, [initialDate, finalDate, id_farm]);
    res.send(rows);
});

router.get('/:id_farm/report/costAll/:initialDate/:finalDate', async (req, res) => {
    const {id_farm, initialDate, finalDate} = req.params;
    const rows = await db.query(getReportCostsAll, [initialDate, finalDate, id_farm]);
    res.send(rows);
});

module.exports = router