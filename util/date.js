'use strict';

var dateFormat = require('dateformat');

exports.format = function(date = new Date() , format = "yyyy-mm-dd HH:MM:ss"){
    if(date == null || format == null) return "";

    return dateFormat(date, format);
}

exports.string_to_obj = function(text){
    var splited = text.split(" ");
    var splitedDate = splited[0].split("-");
    var splitedTime = splited[1].split(":");
    return new Date(splitedDate[0],splitedDate[1] - 1,splitedDate[2],splitedTime[0],splitedTime[1],splitedTime[2]);
}