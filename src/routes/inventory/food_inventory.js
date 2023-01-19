const db = require('../../util/database')
const express = require('express');
const router = express.Router();
const { createFoodInventory, lastIdFoodInventory,getFoodInventories, updateFoodInventory2, getLastFoodWarehouse, createFoodWarehouse, lastId, updateFoodWarehouse, addAmountFoodInventory, updateFoodInventory, getFoodInventoryHistory } = require('../../util/consultas');

router.post('/:id_farm/food_inventory/add', async (req, res) => {
    const { price, id_food, amount, id_user } = req.body;
    const id_farm = req.params.id_farm;
    console.log('llega')
    console.log('price')
    console.log(price)
    console.log('id_food')
    console.log(id_food)
    console.log('amount')
    console.log(amount)
    console.log('id_user')
    console.log(id_user)
    try {
        const history = await db.query(getLastFoodWarehouse, [id_food, id_farm]);
        console.log('history')
        console.log(history)
        if (history.length == 0) {
            createNewFoodInventory(id_user, price, id_food, id_farm, amount);
        } else if (history[0].price == price) {
            await db.query(updateFoodWarehouse, [amount, id_user, history[0].id_food_inventory]);
            await db.query(addAmountFoodInventory, [amount, history[0].id_food_inventory]);
        } else {
            createNewFoodInventory(id_user, price, id_food, id_farm, amount);
        }
    } catch (error) {
        console.log(error)
        res.send(false);
    }
    res.send(true);
});

async function createNewFoodInventory(id_user, price, id_food, id_farm, amount) {
    try {
        await db.query(createFoodInventory, [price, amount, id_food, id_farm]);
        const id_food_Inventory = (await db.query(lastIdFoodInventory))[0].id;
        await db.query(createFoodWarehouse, [id_user, id_food_Inventory, amount]);
    } catch (error) {
        console.log(error);
    }
}

router.put('/:id_farm/food_inventory', async (req, res) => {
    const { id_food_Inventory, amount, id_user } = req.body;
    try {
        await db.query(updateFoodInventory2, [amount, id_user, id_food_Inventory]);
        res.send(true);
    } catch (error) {
        res.send(false);
    }
});

router.get('/:id_farm/food_inventory', async (req, res) => {
    const rows = await db.query(getFoodInventories, [req.params.id_farm]);
    res.send(rows);
});

router.get('/:id_farm/food_inventory/:id_food', async (req, res) => {
    const rows = await db.query(getFoodInventoryHistory, [req.params.id_food, req.params.id_farm]);
    res.send(rows);
});

module.exports = router;