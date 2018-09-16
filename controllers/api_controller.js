'use strict';
var helper = require('../util/helper');

exports.search_in_store = function(req,res){
    try{
        var keywords = req.body;
        global.totalKeywords = parseInt(keywords.length);

        if(totalKeywords <= 5){
            var promiseKeywords = [];
            for(var i in keywords){
                var awaitRes = helper.search_promise(string.get_url_toped(keywords[i]),'GET');
                promiseKeywords.push(awaitRes);
            }

            Promise.all(promiseKeywords)
            .then(values => {
                if(parseInt(values.length) == totalKeywords){
                    var stores = {};
                    var response = [];
                    
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
                            item['image'] = product['image_url'];
                            item['prety_price'] = product['price'];
                            item['price'] = product['price_int'];

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
                            response.push(stores[title]);
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

exports.search = function(req,res){
    try{
        var keyword = req.body.keyword;
        logger.info(keyword);
        var vendor = ["tokopedia"];
        var promiseVendors = [];

        for(var i in vendor){
            var url = "";
            if(vendor[i] == "shopee")
                url = string.get_url_shopee(keyword);
            else
                url = string.get_url_toped(keyword);

            var awaitRes = helper.search_promise(url,'GET',vendor[i]);
            promiseVendors.push(awaitRes);
        }

        Promise.all(promiseVendors)
            .then(values => {
                var response = [];
                var count = [];
                var total = 0;
                for(let val of values){
                    var jsonData = JSON.parse(JSON.parse(val));
                    var items;
                    if("algorithm" in jsonData){
                        // shopee
                        items = helper.parse_shopee(jsonData['items']);
                    }else{
                        items = helper.parse_toped(jsonData['data']['products']);
                    }

                    total += items.length;
                    response.push(items); 
                    count.push(0); 
                }
                
                var out = [];
                var j = 0;
                for(var i = 0; i < total; i++){
                    var each = response[j][count[j]];
                    if(each == null){
                        count.splice(j,1);
                        j -= 1;
                        each = response[j][count[j]];
                    } 

                    out.push(each);

                    count[j] = parseInt(count[j]) + 1;
                    j++;

                    if(j >= count.length) j = 0;
                }   

                res.json(out);
            })
            .catch(e => {
                logger.error(e);
            });
    }catch(e){
        logger.error(e);
        res.json(string.response("99","general_error"));
    }
}