const consultas = {
    loginUser: "SELECT * FROM users WHERE username = ?",
    loginId: "SELECT * FROM users WHERE id = ?",
    insertPerson: "INSERT INTO persons (id, name, lastname, email, phone) VALUES (?,?,?,?,?)",
    insertUser: "INSERT INTO users (username, password, user_type, id_person) VALUES (?,?,?,?)",
    getFarms: "Select f.id, f.name from farms f join users_farms u on f.id = u.id_farm join users us on u.id_user = us.id where us.username = ?",
    createFarm: "INSERT INTO farms (name) VALUES (?)",
    lastIdLot: "Select id from lots order by id DESC limit 1",
    createUserFarm: "INSERT INTO users_farms (id_user, id_farm, date) VALUES (?,?,DATE(NOW()))",
    updateFarm: "UPDATE farms SET name = ? WHERE id = ?",
    deleteFarm: "DELETE FROM farms WHERE id = ?",
    deleteUserFarm: "DELETE FROM users_farms WHERE id_farm = ?",
    createShed: "INSERT INTO sheds (shedNumber, width, length, id_farm) VALUES (?,?,?,?)",
    getSheds: "Select id, shedNumber, width, length, coalesce(( select sum(amount_hens) from sheds s join lots l on s.id = l.id_shed group by id_shed having id_shed = id),0) as amount_hens from sheds where id_farm = ?",
    getShed: "Select * from sheds where id_farm = ? and shedNumber = ?",
    updateShed: "UPDATE sheds SET shedNumber = ?, width = ?, length = ? WHERE id = ?",
    deleteShed: "DELETE FROM sheds WHERE id = ?",
    createDailyReport: "INSERT INTO daily_reports (date, numberOfDeaths, waterConsumption, id_lot) VALUES (?,?,?,?)",
    getDailyReports: "SELECT d.id_lot, d.date, d.numberOfDeaths, d.waterConsumption, l.lotNumber FROM daily_reports d join lots l on l.id = d.id_lot WHERE d.id_lot = ?",
    verifyDateReport: "SELECT * FROM daily_reports WHERE daily_reports.date = ? AND id_lot = ?",
    updateConsumption: "UPDATE daily_reports SET waterConsumption = ? WHERE id_lot = ?  AND daily_reports.date = ?",
    updateDeaths: "UPDATE daily_reports SET numberOfDeaths = ? WHERE id_lot = ?  AND daily_reports.date = ? ",
    createFood: "INSERT INTO foods (id, name, mark, weight) VALUES (?, ?, ?, ?)",
    searchFoodById: "SELECT * FROM foods WHERE id = ?",
    getFoods: "SELECT * FROM foods",
    getFood: "SELECT * FROM foods WHERE id = ?",
    createFoodInventory: "INSERT INTO food_inventory (price, amount, id_food, id_farm) VALUES (?, ?, ?, ?)",
    getFoodInventory: "SELECT * FROM food_inventory WHERE id = ?",
    getAllLots: "Select l.id, lotNumber, dateOfBirth, shedNumber, amount_hens, race from lots l join sheds s on l.id_shed = s.id join farms f on f.id = s.id_farm where f.id = ?",
    getLots: "Select * from lots where id_shed = ?",
    getLot: "Select * from lots where id_shed = ? and lotNumber = ?",
    createLot: "INSERT INTO lots (race, amount_hens, lotNumber, dateOfBirth, id_shed) VALUES (?,?,?,?,?)",
    updateLot: "UPDATE lots SET race = ?, amount_hens = ?, lotNumber = ?, dateOfBirth = ? WHERE id = ?",
    deleteLot: "DELETE FROM lots WHERE id = ?",
    createVaccinationDate: "INSERT INTO vaccination_date (initialDate, finalDate, illness, application_method, id_lot) VALUES (?, ?, ?, ?, ?)",
    getCosts: "Select * from costs where id_lot = ?",
    getCost: "Select * from costs where id_cost = ?",
    createCost: "INSERT INTO costs (description, price, date, id_lot) VALUES (?,?,?,?)",
    updateCost: "UPDATE costs SET description = ?, price = ?, date = ? WHERE id = ?",
    deleteCost: "DELETE FROM costs WHERE id = ?",
    deleteCosts: "DELETE FROM costs WHERE id_lot = ?",
    updateVaccinationDate: "UPDATE vaccination_date SET observations = ? WHERE id = ?",
    deleteVaccinationDate: "DELETE FROM vaccination_date WHERE id_lot = ?",
    updateVaccinationDate: "UPDATE vaccination_date SET observations = ? WHERE id = ?",
    deleteDailyReports: "DELETE FROM daily_reports WHERE id_lot = ?",
    deleteWeightHistory: "DELETE FROM weight_history WHERE id_lot = ?",
    getAllUsernames: "SELECT username from users",
    getUserWithSocialN: "SELECT * FROM users u join persons p on p.id = u.id_person where username=?",
    getInfoUser: "SELECT u.id, p.name, p.lastname, p.email, p.phone, u.user_type, u.id_person from persons p join users u on p.id = u.id_person where u.username = ?",
    updateInventory: "UPDATE food_inventory SET price = ?, amount = ?, id_food = ? WHERE id = ?",
    createFoodWarehouse: "INSERT INTO food_warehouse (id_user, id_food_inventory, date, amount) VALUES (?, ?, now() ,?)",
    getLastFoodWarehouse: "SELECT * FROM food_warehouse fw JOIN food_inventory fi ON fw.id_food_inventory = fi.id WHERE fi.id_food = ? and fi.id_farm = ? and date = (SELECT max(date) FROM food_warehouse)",
    updateFoodWarehouse: "UPDATE food_warehouse SET amount = (amount+?) WHERE id_user = ? AND id_food_inventory = ?",
    getAmountOffOOD: "SELECT sum(fi.amount) FROM food_warehouse fw JOIN food_inventory fi ON fw.id_food_inventory = fi.id where fi.id_food = 2222 and fi.id_farm = 1 group by fi.id_food, fi.id_farm",
    lastId: "Select id from farms order by id DESC limit 1",
    lastIdFoodInventory: "Select id from food_inventory order by id DESC limit 1",
    addAmountFoodInventory: "UPDATE food_inventory SET amount = (amount+?) WHERE id = ?",
    updateFoodInventory: "UPDATE food_inventory SET amount = ? WHERE id = ?",
    getFoodInventories: "SELECT id_food, name, mark, weight/1000 as weight, sum(amount) as cantidad FROM food_inventory fi JOIN foods f ON fi.id_food = f.id WHERE id_farm = ? GROUP BY id_food",
    updateFoodInventory: "UPDATE food_warehouse SET amount = ? WHERE id_user = ? AND id_food_inventory = ?",
    // getFoodInventories: "SELECT id_food, name, mark, weight, sum(amount) as cantidad FROM food_inventory fi JOIN foods f ON fi.id_food = f.id WHERE id_farm = ? GROUP BY id_food",
    // getFoodInventories:"SELECT id_food, name, mark, weight, sum(fi.amount)- COALESCE(sum(eh.amount),0) as cantidad FROM eating_history eh RIGHT JOIN food_inventory fi ON eh.id_food_inventory = fi.id INNER JOIN foods f ON fi.id_food = f.id WHERE id_farm = ? GROUP BY id_food",
    calculateAmountInInventory: "SELECT sum(amount) FROM food_inventory WHERE id_food = ?",
    getFoodInventoryHistory: "SELECT id_food, name , mark, weight/1000 as weight, price, date, fw.amount as cantidad, id_food_inventory FROM food_warehouse fw JOIN food_inventory fi ON fw.id_food_inventory = fi.id JOIN foods f ON fi.id_food = f.id WHERE id_food = ? AND id_farm = ?",
    getLots: "Select * from lots where id_shed = ?",
    getWeight: "Select w.id, w.date, w.weight, l.lotNumber from weight_history w join lots l on l.id = w.id_lot where l.id = ?",
    createWeight: "INSERT INTO weight_history (weight, date, id_lot) VALUES (?,?,?)",
    updateWeight: "UPDATE weight_history SET weight = ? WHERE date = ? and id_lot=?",
    deleteWeight: "DELETE FROM weight_history WHERE id = ?",
    getVaccinationDate: "Select * from vaccination_date where id_lot = ? order by initialDate",
    //getNextInventory: "SELECT id, fi.amount, consumed FROM food_inventory fi JOIN food_warehouse fw ON fi.id = fw.id_food_inventory WHERE consumed<fi.amount AND id_food = ? ORDER BY date LIMIT 1;",
    setFoodConsumed: "UPDATE food_inventory SET amount = ? WHERE id = ?",
    //addFoodConsumed: "UPDATE food_inventory SET consumed = (SELECT sum(amount) FROM eating_history WHERE id_food_inventory = ?) WHERE id = ?",
    getReportDailyFood: `Select h.id_lot, s.shedNumber, l.lotNumber, date_format(foodDate, "%Y-%m-%d") as foodDate, sum(h.amount*a.weight) as alimento_consumido
    from eating_history h join food_inventory f on h.id_food_inventory = f.id
    join foods a on f.id_food = a.id
    join farms g on f.id_farm = g.id
    join lots l on h.id_lot = l.id
    join sheds s on l.id_shed = s.id
    where h.foodDate between ? and ? and g.id = ?
    group by h.id_lot,  date_format(foodDate, "%Y-%m-%d");`,
    getReportFoodAll: `Select h.id_lot, s.shedNumber, l.lotNumber, sum(h.amount*a.weight) as total_consumido,sum(h.amount*a.weight)/l.amount_hens as promedio
    from eating_history h join food_inventory f on h.id_food_inventory = f.id
    join foods a on f.id_food = a.id
    join farms g on f.id_farm = g.id
    join lots l on h.id_lot = l.id
    join sheds s on l.id_shed = s.id
    where h.foodDate between ? and ? and g.id = ?
    group by h.id_lot`,
    getReportDailyWater: `Select 	l.id, s.shedNumber, l.lotNumber, r.date, r.waterConsumption
    from lots l join daily_reports r on r.id_lot = l.id
    join sheds s on l.id_shed = s.id
    join farms f on s.id_farm = f.id
    where r.date between ? and ? and f.id = ?`,
    getReportWaterAll: `Select 	l.id, s.shedNumber, l.lotNumber, sum(r.waterConsumption) as Consumo_total, sum(r.waterConsumption)/l.amount_hens as promedio
    from lots l join daily_reports r on r.id_lot = l.id
    join sheds s on l.id_shed = s.id
    join farms f on s.id_farm = f.id
    where r.date between ? and ? and f.id = ?
    group by l.id`,
    getReportDailyDeath: `Select l.id, s.shedNumber, l.lotNumber, r.date, r.numberOfDeaths
    from lots l join daily_reports r on r.id_lot = l.id
    join sheds s on l.id_shed = s.id
    join farms f on s.id_farm = f.id
    where r.date between ? and ? and f.id = ?`,
    getReportDeathAll: `Select l.id, s.shedNumber, l.lotNumber, sum(r.numberOfDeaths) as Muertes_totales
    from lots l join daily_reports r on r.id_lot = l.id
    join sheds s on l.id_shed = s.id
    join farms f on s.id_farm = f.id
    where r.date between ? and ? and f.id = ?
    group by l.id`,
    getReportDailyCosts: `Select l.id, s.shedNumber, l.lotNumber, c.date, c.description, c.price
    from lots l join costs c on c.id_lot = l.id
    join sheds s on l.id_shed = s.id
    join farms f on s.id_farm = f.id
    where c.date between ? and ? and f.id = ?`,
    getReportCostsAll: `Select l.id, s.shedNumber, l.lotNumber, sum(c.price) as Costo_total
    from lots l join costs c on c.id_lot = l.id
    join sheds s on l.id_shed = s.id
    join farms f on s.id_farm = f.id
    where c.date between ? and ? and f.id = ?
    group by l.id`,
    getNextInventory: "SELECT id, fi.amount, consumed FROM food_inventory fi JOIN food_warehouse fw ON fi.id = fw.id_food_inventory WHERE consumed<fi.amount AND id_food = ? ORDER BY date LIMIT 1;",
    setFoodConsumed: "UPDATE food_inventory SET amount = ? WHERE id = ?",
    addFoodConsumed: "UPDATE food_inventory SET amount = (SELECT sum(amount) FROM eating_history WHERE id_food_inventory = ?) WHERE id = ?",
    addEatingHistory: "INSERT INTO eating_history (id_lot, id_food_inventory, amount, foodDate) VALUES (?, ?, ?, NOW())",
    getEatingHistory: "SELECT id_food, name, mark, date_format(foodDate, \"%d/%m/%Y\") as date, sum(eh.amount) as cantidad FROM eating_history eh JOIN food_inventory fi ON eh.id_food_inventory = fi.id JOIN foods f ON fi.id_food = f.id WHERE id_lot = ? GROUP BY date_format(foodDate, \"%d/%m/%Y\"),id_food",
    getEatingHistory: "SELECT eh.id, id_food, name, mark, date_format(foodDate, \"%d/%m/%Y\") as date, (eh.amount) as cantidad FROM eating_history eh JOIN food_inventory fi ON eh.id_food_inventory = fi.id JOIN foods f ON fi.id_food = f.id WHERE id_lot = ?",
    updateEatingHistory: "UPDATE eating_history SET amount = ? WHERE id = ?",
    getRecoveryCode: "SELECT recoveryCode FROM users WHERE username = ?",
    createRecoveryCode: "UPDATE users SET recoveryCode = ? WHERE username = ?",
    changePass: "UPDATE users SET password = ? WHERE username = ?"
};

module.exports = consultas;