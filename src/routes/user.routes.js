const { Router } = require('express');
const { create } = require('../controller/user.controller');
// const { ensureAuthenticated } = require('../middleware/ensureAuthenticated');

const userRoutes = Router();

userRoutes.post('/', create);
// userRoutes.post('/admin', ensureAuthenticated, createAdmin);

module.exports = { userRoutes };
