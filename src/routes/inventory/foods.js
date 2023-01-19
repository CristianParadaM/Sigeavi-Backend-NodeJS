const db = require('../../util/database')
const express = require('express');
const router = express.Router();
const { createFood, searchFoodById, getFoods, getFood } = require('../../util/consultas');

router.post('/add', async (req, res) => {
    const { id, name, mark, weight } = req.body;
    const food = await db.query(searchFoodById, [id]);
    if (food.length > 0) {
        res.send(false);
    } else {
        await db.query(createFood, [id, name, mark, (weight * 1000)]);
        res.send(true);
    }
})

router.get('/', async (req, res) => {
    const rows = await db.query(getFoods, [])
    res.send(rows);
});

router.get('/:id', async (req, res) => {
    const rows = await db.query(getFood, [req.params.id])
    res.send(rows);
});

module.exports = router;