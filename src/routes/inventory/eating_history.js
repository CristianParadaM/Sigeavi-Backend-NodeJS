const db = require('../../util/database')
const express = require('express');
const router = express.Router();
const{addEatingHistory, getEatingHistory, updateEatingHistory, setFoodConsumed,getInventoriesByIdFood} = require('../../util/consultas');

router.get('/:id_farm/eating_history/:id_lot', async (req, res) => {
    const rows = await db.query(getEatingHistory, [req.params.id_lot]);
    res.send(rows);
}); 

router.put('/:id_farm/eating_history/', async (req, res) => {
    const {amount, id_history} = req.body;
    await db.query(updateEatingHistory, [amount, id_history]);
    res.send(true);
}); 

router.post('/:id_farm/eating_history/:id_lot/add', async (req, res) => {
    let {id_food, amount} = req.body;
    let rows = await db.query(getInventoriesByIdFood,[id_food, req.params.id_farm]);
    try {
        for (let index = 0; index < rows.length; index++) {
            if (amount<=rows[index].amount) {
                rows[index].amount -= amount;
                await db.query(setFoodConsumed, [rows[index].amount, rows[index].id]);
                await db.query(addEatingHistory, [req.params.id_lot, rows[index].id, amount]);
                break;
            }else{
                amount = amount - rows[index].amount;
                await db.query(setFoodConsumed, [0, rows[index].id]);
                await db.query(addEatingHistory, [req.params.id_lot, rows[index].id, rows[index].amount]);
            }
        }
        res.send(true);
    } catch (error) {
        res.send(false);
    }
}); 

module.exports = router;