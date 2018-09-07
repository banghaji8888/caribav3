'use strict';
var url_toped = "https://ace.tokopedia.com/search/product/v3?scheme=https&device=desktop&_catalog_rows=5&catalog_rows=5&_rows=500&source=search&ob=23&st=product&rows=500&q=";
var url_shopee = "https://shopee.co.id/api/v2/search_items/?by=relevancy&keyword=";

var RD = {
    success: "Success",
    failed: "Failed",
    general_error: "General error",
    keywords_offset: "Keywords tidak boleh lebih dari 5 produk!",
    not_found: "Produk tidak ditemukan"
};

exports.get_url_toped = function(keyword){
    return url_toped+encodeURIComponent(keyword);
}

exports.get_url_shopee = function(keyword){
    return url_shopee + encodeURIComponent(keyword) + "&limit=100&newest=0&order=desc&page_type=search";
}

exports.response = function(rc,rd){
    var out = {
        rc : rc,
        rd : RD[rd]
    };

    return out;
}