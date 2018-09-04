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