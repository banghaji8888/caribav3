'use strict';
var helper = require('../util/helper');

/*exports.store = function(req, res){
    logger.info("Store process");
    var params = req.body;

    //cek existing data
    try{
        flights.is_exists(params.seatKey,function(callback){
            if(callback != 'failed'){
                if(callback.hits.total > 0){
                    res.json(string.response("04","already_exists"));
                }else{
                    var url = string.get_url("/flights/schedule");
        
                    //insert to elasticsearch
                    curl.post(url, params, function(response){
                        if(response != "failed"){
                            var jsonObj = JSON.parse(response);
                            if(jsonObj.result == "created"){
                                var out = string.response("00","success");
                                out['data'] = jsonObj;
                                res.json(out);
                            }else{
                                res.json(string.response("01","insert_failed"));
                            }    
                        }else{
                            res.json(string.response("02","failed"));
                        }
                    });
                }
            }else{
                res.json(string.response("02","failed")); 
            }
        });
    }catch(e){
        logger.error(e);
        res.json(string.response("99","general_error"));
    }
}

exports.update_avail = function(req, res){
    logger.info("Update available process");

    var url = string.get_url("/flights/schedule/_update_by_query");
    try{
        flights.is_exists(req.body.seatKey,function(callback){
            if(callback != 'failed'){
                if(callback.hits.total > 0){
                    var params = string.set_update_avail_param(req.body.availability, req.body.seatKey);
        
                    curl.post(url, params, function(response){
                        if(response != "failed"){
                            var jsonObj = JSON.parse(response);
                            if(jsonObj.updated > 0){
                                var out = string.response("00","success");
                                out['data'] = jsonObj;
                                res.json(out);
                            }else{
                                res.json(string.response("05","failed_update_avail"));
                            }    
                        }else{
                            res.json(string.response("02","failed"));
                        }
                    });
                }else{
                    res.json(string.response("09","flight_not_found"));
                }
            }else{
                res.json(string.response("02","failed")); 
            }
        });
    }catch(e){
        logger.error(e);
        res.json(string.response("99","general_error"));
    }
}

exports.update_fare = function(req,res){
    logger.info("Update fare process");

    var url = string.get_url("/flights/schedule/_update_by_query");
    try{
        flights.is_exists(req.body.seatKey,function(callback){
            if(callback != 'failed'){
                if(callback.hits.total > 0){
                    var params = string.set_update_fare_param(req.body.price, req.body.seatKey);
        
                    curl.post(url, params, function(response){
                        if(response != "failed"){
                            var jsonObj = JSON.parse(response);
                            if(jsonObj.updated > 0){
                                var out = string.response("00","success");
                                out['data'] = jsonObj;
                                res.json(out);
                            }else{
                                res.json(string.response("06","failed_update_fare"));
                            }    
                        }else{
                            res.json(string.response("02","failed"));
                        }
                    });
                }else{
                    res.json(string.response("10","flight_not_found"));
                }
            }else{
                res.json(string.response("02","failed")); 
            }
        });
    }catch(e){
        logger.error(e);
        res.json(string.response("99","general_error"));
    }
}

exports.search = function(req,res){
    logger.info("Search process "+JSON.stringify(req.body));

    var url = string.get_url("/flights/schedule/_search");
    try{
        var params = string.set_search_param(req.body.key);
        
        curl.post(url, params, function(response){
            if(response != "failed"){
                var jsonObj = JSON.parse(response);
                if(jsonObj.hits.total > 0){
                    var out = string.response("00","success");
                    out['data'] = flights.parsing_search(jsonObj);
                    res.json(out);
                }else{
                    res.json(string.response("07","not_found"));
                }    
            }else{
                res.json(string.response("02","failed"));
            }
        });
    }catch(e){
        logger.error(e);
        res.json(string.response("99","general_error"));
    }
}

exports.search_fare = function(req,res){
    logger.info("Search fare process");

    try{
        flights.is_exists(req.body.seatKey,function(response){
            if(response != 'failed'){
                if(response.hits.total > 0){
                    var source = response.hits.hits[0]._source;

                    if(!flights.check_is_hplus(source.date) || !flights.check_expired_fare(source.updatedAt)){
                        // harga H -10 atau harga belum expired
                        var out = string.response("00","success");
                        out['data'] = { price: source.price};
                        res.json(out);
                    }else{
                        // harga sudah expired 
                        var out = string.response("08","expired_fare");
                        res.json(out);
                    }
                }else{
                    var out = string.response("09","flight_not_found");
                    res.json(out);
                }
            }else{
                res.json(string.response("02","failed"));
            }
        });
    }catch(e){
        logger.error(e);
        res.json(string.response("99","general_error"));
    }
}

exports.insert_routes = function(req,res){
    logger.info("Insert favorite route process");
    var params = req.body;

    try{
        var url = string.get_url("/favorite/route");
        curl.post(url, params, function(response){
            if(response != "failed"){
                var jsonObj = JSON.parse(response);
                if(jsonObj.result == "created"){
                    var out = string.response("00","success");
                    out['data'] = jsonObj;
                    res.json(out);
                }else{
                    res.json(string.response("01","insert_failed"));
                }    
            }else{
                res.json(string.response("02","failed"));
            }
        });
    }catch(e){
        logger.error(e);
        res.json(string.response("99","general_error"));
    }
}

exports.search_routes = function(req,res){
    logger.info("Search favorite route process");
    var params = req.body;

    try{
        var url = string.get_url("/favorite/route/_search");
        curl.post(url, params, function(response){
            if(response != "failed"){
                var jsonObj = JSON.parse(response);
                if(jsonObj.hits.total > 0){
                    var out = string.response("00","success");
                    out['data'] = jsonObj;
                    res.json(out);
                }else{
                    res.json(string.response("07","not_found"));
                }    
            }else{
                res.json(string.response("02","failed"));
            }
        });
    }catch(e){
        logger.error(e);
        res.json(string.response("99","general_error"));
    }
}

exports.search_sorted = function(req,res){
    logger.info("Search flights sorted process");
    var params = req.body;

    try{
        var url = string.get_url("/flights/schedule/_search");
        curl.post(url, params, function(response){
            if(response != "failed"){
                var jsonObj = JSON.parse(response);
                if(jsonObj.hits.total > 0){
                    var out = string.response("00","success");
                    out['data'] = jsonObj;
                    res.json(out);
                }else{
                    res.json(string.response("07","not_found"));
                }    
            }else{
                res.json(string.response("02","failed"));
            }
        });
    }catch(e){
        logger.error(e);
        res.json(string.response("99","general_error"));
    }
}

exports.force_update = force_update;

function force_update(req,res){
    try{
        var paramAvail = flights.setting_asterix(req.body,"AVAIL","",1);
        curl.lion_api(string.get_lion_api_url(paramAvail),function(response){
            if(response != "" && response.split("*")[49] != "" && response.split("*")[49] != "1"){
                var splitDate = req.body.date.split("/");
                var key = req.body.maskapai+req.body.depart+req.body.arrival+splitDate[2]+splitDate[0]+splitDate[1];
                var availResponse = flights.get_lion_api_response(key,response.split("*")[49]);
                // TODO delete
                flights.delete_flights(req.body);
                sleep.sleep(5);

                // TODO insert
                flights.insert_flights(availResponse);
                sleep.sleep(5);

                // TODO update fare
                for(var title in availResponse){
                    var data = availResponse[title];
                    for(var i = 0; i < data.length; i++){
                        var paramFare = flights.setting_asterix(req.body,"FAREOFFLINE",data[i],1);
                        flights.api_lion_fare(paramFare,data[i]);
                    }
                }
                //res.send(availResponse);
                res.json(string.response("00","success"));
            }else{
                res.json(string.response("02","failed"));
            }
        });
    }catch(e){
        logger.error(e);
        res.json(string.response("99","general_error"));
    }
}
exports.search_cheapest = function(req,res){    
    try{
        var paramAvail = flights.setting_asterix(req.body,"AVAIL","",2);
        curl.lion_api(string.get_lion_api_url(paramAvail),function(response){
            global.cheapest = [];
            if(response != "" && response.split("*")[49] != "" && response.split("*")[49] != "1"){
                var splitDate = req.body.date.split("/");
                var key = req.body.maskapai+req.body.depart+req.body.arrival+splitDate[2]+splitDate[0]+splitDate[1];
                cheapest = flights.get_lion_api_response(key,response.split("*")[49]);
                
                if(cheapest != ""){
                    var promiseFare = [];
                    for(var title in cheapest){
                        var data = cheapest[title];
                        for(var i = data.length - 1; i >= 0; i--){
                            var avail = data[i][0];
                            if(avail != "undefined" && avail != "" && avail != null){
                                var paramFare = flights.setting_asterix(req.body,"FARE",data[i],2);
                                var responseFare = flights.get_fare_promise(paramFare,title,i);
                                promiseFare.push(responseFare);
                                break;
                            }
                            
                        }
                    }

                    Promise.all(promiseFare)
                    .then(values => {
                        for(let val of values){
                            if(val != "" && val.split("*")[49].length > 1){
                                var asterix = val.split("*");
                                var msg = asterix[49].split("###");
                                //console.log(decodeURIComponent(asterix[50])+" "+parseInt(asterix[51])+" => "+msg[1]);
                                cheapest[decodeURIComponent(asterix[50])][parseInt(asterix[51])][0]['price'] = parseInt(msg[1]);
                            }
                        }

                        var out = string.response("00","success");
                        out['data'] = cheapest;
                        logger.info(JSON.stringify(out));
                        res.json(out);
                    })
                    .catch(e => {
                        logger.error(e);
                    });
                } else{
                    res.json(string.response("02","failed"));
                }
                
            }else{
                res.json(string.response("02","failed"));
            }
        });
    }catch(e){
        logger.error(e);
        res.json(string.response("99","general_error"));
    }
}
*/

exports.search_in_store = function(req,res){
    try{
        var keywords = req.body;
        global.totalKeywords = parseInt(keywords.length);

        if(totalKeywords <= 5){
            var promiseKeywords = [];
            for(var i in keywords){
                var awaitRes = helper.search_promise(string.get_url(keywords[i]),'GET');
                promiseKeywords.push(awaitRes);
            }

            Promise.all(promiseKeywords)
            .then(values => {
                if(parseInt(values.length) == totalKeywords){
                    var stores = {};
                    var response = {};
                    
                    var index = 0;
                    for(let val of values){
                        var jsonData = JSON.parse(JSON.parse(val));
                        var products = jsonData['data']['products'];
                        var nameShop = [];
                        for(var i in products){
                            var product = products[i];
                            var item = {};
                            var storeItem = {};
                            var storeName = product['shop']['name'];

                            if (nameShop.indexOf(storeName) > -1) {
                                continue;
                            }
                            nameShop.push(storeName);
                            
                            if(index == 0 || !(stores[storeName] instanceof Object)){
                                storeItem['id'] = product['shop']['id'];
                                storeItem['name'] = storeName;
                                storeItem['url'] = product['shop']['url'];
                                storeItem['location'] = product['shop']['location'];
                                storeItem['data'] = [];
                                stores[storeName] = storeItem;
                            }

                            item['id'] = product['id'];
                            item['name'] = product['name'];
                            item['url'] = product['url'];
                            item['image_url'] = product['image_url_300'];
                            item['price'] = product['price'];

                            var i = index;
                            if(parseInt(stores[storeName]['data'].length) == 0){
                                stores[storeName]['data'] = [];
                                i = 0;
                            }

                            stores[storeName]['data'][i] = item;
                        }

                        index++;
                    }

                    for(var title in stores){
                        var products = stores[title]['data'];
                        if(parseInt(products.length) == parseInt(values.length)){
                            response[title] = stores[title];
                        }
                    }

                    var out = string.response("00","success");
                    out['results'] = response;
                    logger.info(JSON.stringify(out));
                    res.json(out);
                }else{
                    res.json(string.response("03","not_found"));
                }
            })
            .catch(e => {
                logger.error(e);
            });
        }else{
            res.json(string.response("10","keywords_offset"));
        } 
    }catch(e){
        logger.error(e);
        res.json(string.response("99","general_error"));
    }
}

