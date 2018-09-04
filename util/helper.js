'use strict';

exports.search_promise = function(url, method){
    try{
        var Promise = require("bluebird");
        return new Promise((resolve, reject) => {
            try{

                const options = {  
                    url: url,
                    method: method
                };
                
                request(options, function(err, res, body) {  
                    var resp = JSON.stringify(body);
                    resolve(resp);
                });
            }catch(e){
                console.log(e);
                reject(e);
            }
        });
    }catch(e){
        logger.error(e);
    }
}