/**
 * @fileOverview 格式化人民币
 * @author XiaoBin Li (lixiaobin@baijiahulian.com)
 */

define(function (require) {

    'use strict';
    
    var parseRmb = require('../function/parseRmb');

    angular.module('library.filters')
        .filter('rmb', function () {
            return parseRmb;
        });
});