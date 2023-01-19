const db = require('../../util/database')
const express = require('express');
const router = express.Router();
const {getFarms, createFarm, lastId, createUserFarm, updateFarm, deleteFarm, deleteUserFarm} = require("../../util/consultas");

router.get('/:email/farms', async (req, res) => {
    const email = req.params.email;
    const rows = await db.query(getFarms, [email]);
    res.send(rows);
});

router.post('/add', async (req, res) => {
    const {id, name} = req.body;
    try {
        await db.query(createFarm, [name]);
        const id_farm = (await db.query(lastId))[0].id;
        await db.query(createUserFarm, [id, id_farm]);
        res.send(true)
    } catch (error) {
        res.send(false)
    }
        
})

router.put('/update', async (req, res) => {
    const {id, name} = req.body;
    console.log('recibido')
    console.log(id)
    console.log(name)
    try {
        await db.query(updateFarm, [name, id]);
        res.send(true);
    } catch (error) {
        console.log(error)
        res.send(false);
    }
})

router.delete('/delete', async (req, res) => {
    const {idFarm} = req.body;
    try {
        await db.query(deleteUserFarm, [idFarm]);
        await db.query(deleteFarm, [idFarm]);
        res.send(true);
    } catch (error) {
        res.send(false);
    }
})

module.exports = router;