const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require('../util/database')
const helpers = require('../lib/helpers');
const transporter = require('../util/mailer');
const secpass = '!8231cnas1ASd1';
const { changePass, getRecoveryCode ,getAllUsernames, loginUser, updateProfile, getUserWithSocialN, insertPerson, insertUser, getInfoUser, createRecoveryCode } = require("../util/consultas");

router.post('/login', function (req, res, next) {
    passport.authenticate('local.login', function (err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/login'); }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            return res.send(userLogged = { id: user.id, type: user.user_type, username: user.username });
        });
    })(req, res, next);
});

router.post('/signup', async (req, res) => {
    const { id, names, lastnames, email, phone, username, pass } = req.body;
    const usernameInto = await db.query(loginUser, [username]);
    if (usernameInto.length == 0) {
        try {
            await db.query(insertPerson, [id, names, lastnames, email, phone]);
            const passEncrypted = await helpers.encryptPassword(pass);
            const result = await db.query(insertUser, [username, passEncrypted, 'Admin', id]);
            const newUser = {
                username,
                password: pass,
                user_type: "Admin",
                id_person: id
            }
            newUser.id = result.insertId;
            console.log('finalmente por aca');
            res.json(newUser);

        } catch (error) {
            console.log(error)
            res.send("Usuario con esa identificación ya existe");      // Modificar para la vista
        }
    } else {
        res.send("Nombre de usuario ya existe");                        // Modificar para la vista
    }
});


router.get('/login', (req, res) => {
    res.send('Bienvenido al login');
});

router.get('/users', async (req, res) => {
    const rows = await db.query(getAllUsernames);
    res.send(rows);
})

router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login');
});

router.post('/profile', async (req, res) => {
    try {
        const { email } = req.body;
        const rows = await db.query(getInfoUser, [email]);
        res.send(rows);
    } catch (error) {
        console.log(error)
    }
});

router.get('/signup', (req, res) => {
    res.send("Inicio de sesión");
});

router.post('/forgotpass', async (req, res) => {
    try {
        const { email } = req.body;
        const rows = await db.query(getUserWithSocialN, [email]);
        if (rows.length > 0) {
            await helpers.matchPassword(secpass, rows[0].password).then(
                async (res2) => {
                    if (!res2) {
                        var recoveryCode = getRandomInt(100000, 999999);
                        await db.query(createRecoveryCode, [recoveryCode, email]);
                        transporter.sendMail({
                            from: '"RECUPERACIÓN DE CONTRASEÑA - SIGEAVI" <sigeavi.soporte@gmail.com>', // sender address
                            to: email, // list of receivers
                            subject: "🐔 Código de confirmación recuperación de contraseña 🐔", // Subject line
                            html: `
                                 <b>Cordial Saludo!</b>
                                 <br>
                                 <p>Estimado ${rows[0].name} ${rows[0].lastname}</p>
                                 <br>
                                 <p>Desde el equipo de SIGEAVI hemos detectado que has olvidado tu contraseña a continuacion tendrás que registrar el siguiente código en tu aplicación SIGEAVI para que puedas elegir una nueva contraseña y asi poder ingresar nuevamente a disfrutar de nuestros servicios 🐔</p>
                                 <br>
                                 <img src='https://i.postimg.cc/McxFzXSz/logo.png' alt='' width='100px'>
                                 <br>
                                 <b style='font-size:20px;'>Codigo: ${recoveryCode}</b>
                                 <br>
                                 <br>
                                 <b>Sistema de gestión y trazabilidad de granjas avicolas SIGEAVI</b>
                                 <br>
                                 <br>
                                 <p>Este correo ha sido autogenerado. Porfavor evite responder este mensaje</p>
                            `
                        });
                        res.send('1');
                    } else {
                        res.send('0');
                    }
                }
            ).catch(
                err => console.log(err)
            );

        } else { // -1 no existe, 1 exitoso, 0 servicio externo
            res.send('-1')
        }
    } catch (error) {
    }
});

router.put('/profile/:idPerson', async (req, res) => {
    const idPerson = req.params.idPerson;
    const { names, lastnames, phone } = req.body;
    try {
        await db.query(updateProfile, [names, lastnames, phone, idPerson]);
        res.send(true);
    } catch (error) {
        res.send(false);
    }
})

router.get('/login/recoveryCode/:username', async(req, res)=> {
    const username = req.params.username;
    const code = await db.query(getRecoveryCode, [username]);
    res.send(code);
});

router.put('/changePass', async(req, res)=>{
    const {email, pass} = req.body;
    console.log(email)
    console.log(pass)
    try {
        const passEncrypted = await helpers.encryptPassword(pass);
        await db.query(changePass, [passEncrypted, email]);
        res.send(true);
    } catch (error) {
        console.log(error)
        res.send(false);
    }
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

module.exports = router;
