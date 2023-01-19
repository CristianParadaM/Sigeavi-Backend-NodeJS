const db = require('../../util/database')
const express = require('express');
const router = express.Router();
const { createCost, updateCost, deleteCost, getCosts} = require("../../util/consultas");

router.get('/:id_farm/:id_shed/:id_lot/costs', async (req, res) => {
    const id = req.params.id_lot;
    const rows = await db.query(getCosts, [id]);
    res.send(rows);
});

router.post('/:id_farm/:id_shed/:id_lot/costs/add', async (req, res) => {
    const id = req.params.id_lot;
    const {description, price, date} = req.body;
    await db.query(createCost, [description, price, date, id]);
    res.send(true);
})

router.put('/:id_farm/:id_shed/:id_lot/costs/update', async (req, res) => {
    const {description, price, date, id} = req.body;
    await db.query(updateCost, [description, price, date, id]);
    res.send(true);
})

router.delete('/:id_farm/:id_shed/:id_lot/costs/delete', async (req, res) => {
    const {id} = req.body;
    await db.query(deleteCost, [id]);
    res.send(true);
})

module.exports = router;