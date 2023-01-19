const bcrypt = require('bcryptjs');
const helpers = {};

// bcrypt cifra la contraseña y la retorna en hash
helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

// Verifica la contraseña y returna true o false
helpers.matchPassword = async (password, savedPassword) => {
    try {
        return await bcrypt.compare(password, savedPassword);
    } catch (error) {
        console.error(error);
    }
   
};

module.exports = helpers;