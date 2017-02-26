/**
 * @file 时区转换服务
 * @author hanrui
 * @date   2015/12/03
 */
define(function (require) {
    var timezone = require('../../util/timezone');
    // require('../module');
    angular.module('library.services')
        .factory('timezoneService', function () {
            return {
                /**
                 * 把当前时区相等转换为指定时区时间
                 * 例如：
                 *      1、当前时区：东9区，当前时间：2015-11-11 00:00:00
                 *      2、指定时区：东8区
                 *      var ts = equalTranfer(new Date('2015-11-11 00:00:00'), -8);
                 *      返回结果，需要通过moment验证
                 *      moment(返回时间戳).zone('+0800').format('YYYY-MM-DD HH:mm:ss');
                 *      输出如下：
                 *      2015-11-11 00:00:00
                 * @param  {Date} currentDate   要处理的时间
                 * @param  {number} zoneIndex   东几区：-几 西几区：几
                 * 例如：
                 *      东8区，就是-8
                 *      new Date().getTimezoneOffset() / 60
                 * @return {number}             返回时间戳
                 */
                equalTranfer: function (currentDate, zoneIndex) {
                    return timezone.equalTranfer(currentDate, zoneIndex);
                }
            };
        });
});