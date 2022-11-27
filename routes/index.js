const home = require('./home');

function route(app) {
    app.use('/', home);
}

module.exports = route