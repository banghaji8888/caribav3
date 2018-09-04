'use strict';
var dateFormat = require('./date');
var url = "https://ace.tokopedia.com/search/product/v3?scheme=https&device=desktop&_catalog_rows=5&catalog_rows=5&_rows=500&source=search&ob=23&st=product&rows=500&q=";
var RD = {
    success: "Success",
    failed: "Failed",
    general_error: "General error",
    keywords_offset: "Keywords tidak boleh lebih dari 5 produk!",
    not_found: "Produk tidak ditemukan"
};

exports.get_url = function(keyword){
    return url+encodeURIComponent(keyword);
}

exports.get_lion_api_url = function(path){
    return lion_api_url+path;
}

exports.response = function(rc,rd){
    var data = {
        rc: rc,
        rd: RD[rd]
    };

    return data;
}

exports.set_update_avail_param = function(avail, seatKey){
    var data = {
        script : {
            inline: "ctx._source.availability = params.avail; ctx._source.updatedAt = params.updatedAt;",
            lang: "painless",
            params : {
                avail : avail,
                updatedAt : dateFormat.format()
            }
        },
        query: {
            term: {
                seatKey: seatKey
            }
        }
    }

    //return JSON.stringify(data);
    return data;
}

exports.set_update_fare_param = function(fare, seatKey){
    var data = {
        script : {
            inline: "ctx._source.price = params.price; ctx._source.updatedAt = params.updatedAt;",
            lang: "painless",
            params : {
                price : fare,
                updatedAt : dateFormat.format()
            }
        },
        query: {
            term: {
                seatKey: seatKey
            }
        }
    }

    //return JSON.stringify(data);
    return data;
}

exports.set_search_param = function(key){
    var data = {
        size : 100,
        query: {
            match: {
                  key: key
            }
        }
    };

    //return JSON.stringify(data);
    return data;
}

exports.set_data_exists = function(seatKey){
    var data = {
        size:1,
        query: {
            match: {
                seatKey : seatKey
            }
        }
    }

    //return JSON.stringify(data);
    return data;
}