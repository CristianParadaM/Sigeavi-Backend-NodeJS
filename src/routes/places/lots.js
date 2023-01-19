const db = require('../../util/database')
const express = require('express');
const router = express.Router();
const { getLots, updateVaccinationDate, getAllLots, getLot, createLot, updateLot, deleteLot, lastIdLot, createVaccinationDate, deleteCosts, deleteVaccinationDate, deleteDailyReports, deleteWeightHistory, getVaccinationDate } = require("../../util/consultas");
const diseases = ["Newcastle", "Gumboro", "Bronquitis Infecciosa", "Coriza", "Viruela", "Salmonella"];
const applicationMethod = ["Agua de bebida", "Spray", "Gota ocular", "Puncion alar", "Inyeccion intramuscular", "Inyeccion subcutanea"];

router.get('/:id_farm/:id_shed/lots', async (req, res) => {
    const id_shed = req.params.id_shed;
    const rows = await db.query(getLots, [id_shed]);
    res.send(rows);
});

router.get('/:id_farm/lots', async (req, res) => {
    const idFarm = req.params.id_farm;
    const rows = await db.query(getAllLots,[idFarm]);
    res.send(rows);
});

router.put('/:id_farm/lots/vaccination_date/update', async (req, res) => {
    const { id, observations } = req.body;
    try {
        await db.query(updateVaccinationDate, [observations, id]);
        res.send(true);
    } catch (error) {
        res.send(false);
    }
});

router.get('/:id_farm/lots/:id_lot/vaccination_date', async (req, res) => {
    const id_lot = req.params.id_lot;
    const rows = await db.query(getVaccinationDate, [id_lot]);
    res.send(rows);
});

router.put('/:id_farm/lots/:id_lot/vaccination_date/update', async (req, res) => {
    const { id, observations } = req.body;
    await db.query(updateVaccinationDate, [observations, id]);
    res.send(true);
});

router.post('/:id_farm/:id_shed/lots/add', async (req, res) => {
    const id_shed = req.params.id_shed;
    const { race, amount_hens, lotNumber, dateOfBirth } = req.body;
    const lot = await db.query(getLot, [id_shed, lotNumber]);
    if (lot.length == 0) {
        await db.query(createLot, [race, amount_hens, lotNumber, dateOfBirth, id_shed]);
        var id = (await db.query(lastIdLot))[0].id;
        createVaccinationPlan(id, dateOfBirth);
        res.send(true)
    } else {
        res.send(false)
    }
})

router.put('/:id_farm/lots/update', async (req, res) => {
    const { id, race, amount_hens, lotNumber, dateOfBirth } = req.body;
    await db.query(updateLot, [race, amount_hens, lotNumber, dateOfBirth, id]);
    await db.query(deleteVaccinationDate, [id]);
    createVaccinationPlan(id, dateOfBirth);
    res.send(true);
})

router.delete('/:id_farm/lots/delete', async (req, res) => {
    const { id } = req.body;
    console.log('id que llega: ' + id);
    await db.query(deleteCosts, [id]);
    await db.query(deleteVaccinationDate, [id]);
    await db.query(deleteDailyReports, [id]);
    await db.query(deleteWeightHistory, [id]);
    await db.query(deleteLot, [id]);
    res.send(true);
})

function createVaccinationPlan(id, dateOfBirth) {
    var currentDate = new Date(dateOfBirth);
    insertVaccinationDate(currentDate, sumDays(7, dateOfBirth), diseases[0], applicationMethod[0] + ", " + applicationMethod[1] + ", " + applicationMethod[5] + ", " + applicationMethod[4], id);
    insertVaccinationDate(currentDate, sumDays(7, dateOfBirth), diseases[1], applicationMethod[0], id);
    insertVaccinationDate(sumDays(7, dateOfBirth), sumDays(14, dateOfBirth), diseases[0], applicationMethod[0] + ", " + applicationMethod[1] + ", " + applicationMethod[5] + ", " + applicationMethod[4], id);
    insertVaccinationDate(sumDays(7, dateOfBirth), sumDays(14, dateOfBirth), diseases[1], applicationMethod[0], id);
    insertVaccinationDate(sumDays(14, dateOfBirth), sumDays(21, dateOfBirth), diseases[0], applicationMethod[0] + ", " + applicationMethod[1] + ", " + applicationMethod[5] + ", " + applicationMethod[4], id);
    insertVaccinationDate(sumDays(14, dateOfBirth), sumDays(21, dateOfBirth), diseases[1], applicationMethod[0], id);
    insertVaccinationDate(sumDays(35, dateOfBirth), sumDays(42, dateOfBirth), diseases[3], applicationMethod[5], id);
    insertVaccinationDate(sumDays(35, dateOfBirth), sumDays(42, dateOfBirth), diseases[4], applicationMethod[3], id);
    insertVaccinationDate(sumDays(63, dateOfBirth), sumDays(70, dateOfBirth), diseases[0], applicationMethod[0] + ", " + applicationMethod[1] + ", " + applicationMethod[5] + ", " + applicationMethod[4], id);
    insertVaccinationDate(sumDays(77, dateOfBirth), sumDays(84, dateOfBirth), diseases[3], applicationMethod[5], id);
    insertVaccinationDate(sumDays(77, dateOfBirth), sumDays(84, dateOfBirth), diseases[4], applicationMethod[3], id);
    insertVaccinationDate(sumDays(91, dateOfBirth), sumDays(98, dateOfBirth), diseases[0], applicationMethod[0] + ", " + applicationMethod[1] + ", " + applicationMethod[5] + ", " + applicationMethod[4], id);
    insertVaccinationDate(sumDays(112, dateOfBirth), sumDays(119, dateOfBirth), diseases[5], applicationMethod[0] + ", " + applicationMethod[1] + ", " + applicationMethod[4], id);
}

function sumDays(days, dateOfBirth) {
    var currentDate = new Date(dateOfBirth);
    currentDate.setDate(currentDate.getDate() + days);
    return currentDate;
}

async function insertVaccinationDate(initialDate, finalDate, illness, application_method, id_lot) {
    var dateInitial = initialDate.getFullYear() + "-" + (initialDate.getMonth() + 1) + "-" + initialDate.getDate();
    var dateFinal = finalDate.getFullYear() + "-" + (finalDate.getMonth() + 1) + "-" + finalDate.getDate();
    await db.query(createVaccinationDate, [dateInitial, dateFinal, illness, application_method, id_lot]);
}

module.exports = router;