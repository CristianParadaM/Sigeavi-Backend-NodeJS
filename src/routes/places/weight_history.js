const db = require('../../util/database')
const express = require('express');
const router = express.Router();
const { getWeight, createWeight, updateWeight, deleteWeight } = require("../../util/consultas");

router.get('/:id_lot/weight', async (req, res) => {
    const idlot = req.params.id_lot;
    const rows = await db.query(getWeight, [idlot]);
    res.send(rows);
});

router.post('/:id_farm/weight/add', async (req, res) => {
    const { weight, id_lot } = req.body;
    try {
        await db.query(createWeight, [weight, new Date(Date.now()).toLocaleDateString('en-CA'), id_lot]);
        res.send(true);
    } catch (error) {
        res.send(false);
    }
})

router.put('/:id_farm/weight/update', async (req, res) => {
    const { weight, id_lot } = req.body;
    try {
        await db.query(updateWeight, [weight, new Date(Date.now()).toLocaleDateString('en-CA'), id_lot]);
        res.send(true);
    } catch (error) {
        res.send(false);
    }
})

router.delete('/:id_farm/weight/delete', async (req, res) => {
    const { id } = req.body;
    await db.query(deleteWeight, [id]);
    res.send(true);
})

module.exports = router;