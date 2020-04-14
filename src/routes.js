const express = require('express');
const routes = express.Router();
const authMiddlewares = require('./middlewares/auth');

const userController = require('./controllers/userController');

routes.use(authMiddlewares);

routes.get('/users', userController.index);

routes.get('/users/:id', userController.show);

routes.post('/users', userController.store);

routes.put('/users/:id', userController.update);

routes.delete('/users/:id', userController.destroy);

module.exports = routes;