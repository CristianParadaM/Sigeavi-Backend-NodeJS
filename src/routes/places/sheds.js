const db = require('../../util/database')
const express = require('express');
const router = express.Router();
const { createShed, getSheds, getShed, updateShed, deleteShed } = require("../../util/consultas");
const amountToSquareMeter = 10;

router.get('/:id_farm/sheds', async (req, res) => {
    const id = req.params.id_farm;
    const rows = await db.query(getSheds, [id]);
    res.send(rows);
});

router.post('/:id_farm/sheds/add', async (req, res) => {
    const id = req.params.id_farm;
    const { shedNumber, width, length } = req.body;
    const shed = await db.query(getShed, [id, shedNumber]);
    if (shed.length == 0) {
        await db.query(createShed, [shedNumber, width, length, id]);
        res.send(true)
    } else {
        res.send(false)
    }
})

router.put('/:id_farm/sheds/update', async (req, res) => {
    const id_farm = req.params.id_farm;
    const { id, shedNumber, width, length } = req.body;
    try {
        await db.query(updateShed, [shedNumber, width, length, id]);
        res.send(true);
    } catch (error) {
        console.log(error)
    }
})

router.delete('/:id_farm/sheds/delete', async (req, res) => {
    const { id } = req.body;
    await db.query(deleteShed, [id]);
    res.send(true);
})

router.get('/:id_farm/sheds/calculateBirds', async (req, res) => {
    const { width, length } = req.body;
    const amountBirds = (width * length) * amountToSquareMeter;
    res.json(amountBirds);
});

router.get('/:id_farm/sheds/calculateSpace', async (req, res) => {
    const { amountBirds } = req.body;
    const space = Math.ceil(amountBirds / 10);
    res.json(space);
});

module.exports = router;