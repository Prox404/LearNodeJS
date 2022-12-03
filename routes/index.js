const site = require('./site');
const usersRoutes = require('./users');
const linksRoutes = require('./links');

function route(app) {
    app.use('/', site);
    app.use('/users', usersRoutes);
    app.use('/links', linksRoutes);
}

module.exports = route