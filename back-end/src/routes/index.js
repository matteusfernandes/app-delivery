const express = require('express');

const login = require('./loginRoute');
const sales = require('./salesRouter');
const user = require('./userRoute');

const route = express.Router();

route.use('/login', login);
route.use('/', login);
route.use('/customer/orders', sales);
route.use('/sales/user', user);

module.exports = route;
