'use strict';

exports.get = function(url, callback){
    logger.info("REQUEST: " + url);

    const options = {  
        url: url,
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        },
        json: true
    };
    
    request(options, function(err, res, body) {  
        logger.info(res.statusCode);
        if(res.statusCode == 200 || res.statusCode == 201)
            callback(body);
        else
            callback("failed");
    });
}

exports.post = function(url, params, callback){
    try{
        logger.info("REQUEST: " + url);
        logger.info("PARAMS: " + JSON.stringify(params));
        const options = {  
            url: url,
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: params,
            json: true
        };

        request(options, function(err, res, body) {  
            var out = JSON.stringify(body);
            logger.info("RESPONSE " + url + " : "+out);
            logger.info(res.statusCode);

            if(res.statusCode == 200 || res.statusCode == 201)
                callback(out);
            else
                callback("failed");
                          
        });
    }catch(e){
        logger.error(e);
    }
}

exports.put = function(url, params, callback){
    logger.info("REQUEST: " + url);
    logger.info("PARAMS: " + params);

    const options = {  
        url: url,
        method: 'PUT',
        headers: {
            'Accept': 'application/json'
        },
        body: params,
        json: true
    };

    request(options, function(err, res, body) {  
        var out = JSON.stringify(body);
        logger.info("RESPONSE " + url + " : "+out);
        logger.info(res.statusCode);
        if(res.statusCode == 200 || res.statusCode == 201)
            callback(out);
        else
            callback("failed");
    });
}