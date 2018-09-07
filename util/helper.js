'use strict';

function prety_price(price){
    var out = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'IDR' }).format(price);
    out = out.replace("IDR","Rp ");
    out = out.replace(/\,/g,".");

    return out;
}

exports.search_promise = function(url, method, vendor){
    try{
        var Promise = require("bluebird");
        return new Promise((resolve, reject) => {
            try{

                const options = {  
                    url: url,
                    method: method
                };

                if(vendor == "shopee"){
                    options['headers'] = {
                        'content-type': 'application/json',
                        'referer' : 'https://shopee.co.id',
                        'user-agent' : 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
                    };
                }
                
                request(options, function(err, res, body) { 
                    var resp = JSON.stringify(body);
                    resolve(resp);
                });
            }catch(e){
                logger.error(e);
                reject(e);
            }
        });
    }catch(e){
        logger.error(e);
    }
}

exports.parse_shopee = function(data){
    var products = [];
    for(var i = 0; i < data.length; i++){
        var item = data[i];

        // skip ads items
        if(item['ads_keyword'] != null) continue;

        var replaced_name = item['name'].replace(/\|/g,"");
        var replaced_name = replaced_name.replace(/\s+/g,"-");
        var price = item['price'] / 100000;
        var product = {
            id : item['itemid'],
            image : "https://cf.shopee.co.id/file/"+item['image']+"_tn",
            name : item['name'],
            price : price,
            prety_price : prety_price(price),
            url : "https://shopee.co.id/"+replaced_name+"-i."+item['shopid']+"."+item['itemid'],
            location : "",
            vendor : "Shopee"
        };

        products.push(product);
    }

    return products;
}

exports.parse_toped = function(data){
    var products = [];
    for(var i = 0; i < data.length; i++){
        var item = data[i];

        var product = {
            id : item['id'],
            image : item['image_url'],
            name : item['name'],
            price : item['price_int'],
            prety_price : item['price'],
            url : item['url'],
            location : item['shop']['city'],
            vendor : "Tokopedia"
        };

        products.push(product);
    }

    return products;
}