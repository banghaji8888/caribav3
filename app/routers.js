'use strict';

module.exports = function(app){
    var api = require('../controllers/api_controller');

    app.post('/search_in_store',api.search_in_store);

}