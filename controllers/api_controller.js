'use strict';
var helper = require('../util/helper');

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

