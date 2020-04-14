const mongoose = require('mongoose');
const md5 = require('md5');
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth');

const User = mongoose.model('User');

module.exports = {
    async index(req, res) {
        try {
            const users = await User.find({ status: true });

            return res.json(users);
        } catch (err) {
            return res.status(400).send("Listagem de usuários falhou!");
        }
    },

    async show(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.id, status: true });

            return res.json(user);
        } catch (err) {
            return res.status(400).send("Listagem de usuários falhou!");
        }
    },

    async store(req, res) {
        try {
            const { username, email, password } = req.body;

            if (await User.findOne({ username })) {
                return res.status(400).send(`Username ${username} já está cadastrado!`);
            }

            if (await User.findOne({ email })) {
                return res.status(400).send(`E-mail ${email} já está cadastrado!`);
            }

            const user = await User.create({...req.body, password: md5(password), status: true });

            return res.json(user);
        } catch (err) {
            return res.status(400).send(`Cadastro de usuário falhou! ${err}`);
        }

    },

    async update(req, res) {
        try {
            const { username, email } = req.body;

            if (await User.findOne({ username, _id:{ $ne: req.params.id } })) {
                return res.status(400).send(`Username ${username} já está cadastrado!`);
            }

            if (await User.findOne({ email, _id:{ $ne: req.params.id } })) {
                return res.status(400).send(`E-mail ${email} já está cadastrado!`);
            }

            if (req.body.hasOwnProperty("password")) {
                req.body.password = md5(req.body.password);
            }

            const user = await User.findByIdAndUpdate(req.params.id, {...req.body }, { new: true, useFindAndModify: false });

            return res.json(user);
        } catch (err) {
            return res.status(400).send('Atualização de usuário falhou!' + err);
        }
        
    },

    async destroy(req, res) {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, { status: false }, { new: true, useFindAndModify: false });

            return res.send();
        } catch (err) {
            return res.status(400).send("Deleção do usuário falhou!");
        }
        
    },

    async login(req, res) {
        const { entry, password } = req.body;

        const user = await User.findOne({ $or: [{ username: entry, password: md5(password), status: true }, { email: entry, password: md5(password), status: true }] });
        
        if (user) {
            const token = jwt.sign({ id: user._id }, authConfig.secret, {
                expiresIn: 86400
            }); 
    
            return res.json({user, token});
        }
        
        return res.status(400).send();
    }
}