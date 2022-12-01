const site = require('./site');
const usersRoutes = require('./users');

function route(app) {
    app.use('/', site);
    app.use('/users', usersRoutes);
}

module.exports = route