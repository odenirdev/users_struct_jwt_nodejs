const express = require('express');
const mongoose = require('mongoose');
const requireDir = require('require-dir');

const app = express();

app.use(express.json());

const mongodbStr = '';  

mongoose.connect(mongodbStr, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);

requireDir('./src/models');

// Rotas
app.use('/authenticate', require('./src/controllers/authenticateController'));

app.use('/api', require('./src/routes'));

app.listen(3001);