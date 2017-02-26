/**
 * @fileOverview 百分比显示
 * @author Helinfeng (helinfeng@baijiahulian.com)
 */

define(function (require) {

    'use strict';
    
    angular.module('library.filters')
        .filter('percentage', function () {
            return function (value, pointNum) {
            	if ($.isNumeric(value)) {
            		var num = pointNum || 0;
                	return (value * 100).toFixed(num) + '%';
            	} else if (!value) {
            		return '--';
            	} 
            	return value;
            };
        });
});
