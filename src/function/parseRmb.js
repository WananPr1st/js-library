/**
 * @fileOverview 格式化人民币
 * @author XiaoBin Li (lixiaobin@baijiahulian.com)
 */

define(function() {

    'use strict';

    /**
     * @param {number} value 人民币金额
     * @param {boolean} hasPlus 大于0的数是否需要加上'+'符号
     */
    return function(value, hasPlus) {

        if (value === null || typeof value == 'undefined') {
            return '-';
        } else {
            // 正负数
            var negative = value < 0 ? '-' : (hasPlus ? '+' : '');
            // 整数部分
            var integer = parseInt(value = Math.abs(+value || 0)
                .toFixed(2), 10) + '';
            var part = (part = integer.length) > 3 ? part % 3 : 0;

            return '￥' + negative + (part ? integer.substr(0, part) + ',' : '') 
                + integer.substr(part).replace(/(\d{3})(?=\d)/g, '$1' + ',') 
                + ('.' + Math.abs(value - integer).toFixed(2).slice(2));
        }
    };
});