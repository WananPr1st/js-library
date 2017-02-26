/**
 * @file jockey统一服务方法
 * 
 * @author hanrui(hanrui@baijiahulian.com)
 * @date   2015/05/09
 */
define(function (require) {
	'use strict';
	// var module = require('../module');
    var jockey = require('jockey');
    // 是否线上
    var isRelease = '@@isRelease';
    // var isRelease = '1';
    // var isOnline = 'online' === 'online';

	angular
        .module('library.services')
        .factory('jockeyService', ['ajaxService', function (ajaxService) {
        return {
            /**
             * jockey统一处理函数
             * 
             * @param  {Object} options [description]
             * @param  {string} options.eventName jockey.send第一个参数
             * @param  {Object} options.eventParams jockey.send第二个参数
             * @param  {string} options.eventParams.jockeyType jockey.send的回调类型
             * @param  {Function} options.jockeyCallback options.eventParams.jockeyType对应回调函数
             * @param  {Object} options.callbackContext options.eventParams.jockeyType对应回调函数上下文
             * @param  {boolean} options.isOff 是否注销，默认注销
             * @param  {string} options.mockPath mock数据的path
             * @return {[type]}         [description]
             */
            sendJockey: function (options) {
                var defaultOptions = {
                    isOff: true
                };
                options = $.extend(defaultOptions, options);
                // 只执行一次
                var word = false;
                if ($.isFunction(options.jockeyCallback)) {
                    jockey.off(options.eventParams.jockeyType);
                    jockey.on(options.eventParams.jockeyType, function (data) {
                        // if (!word) {
                            word = true;
                            options.jockeyCallback(data);
                            if (options.isOff) {
                                jockey.off(options.eventParams.jockeyType);
                            }
                        // }
                    });
                    // 安卓部分机型jockey通信有2s限制，使用其他方式通信
                    if (isRelease === '1' && /android/i.test(navigator.userAgent)
                        && window.javaFunc && window.javaFunc[options.eventName] && !word) {
                        setTimeout(function () {
                            if (!word) {
                                console.log(JSON.stringify(options.eventParams));
                                window.javaFunc[options.eventName](JSON.stringify(options.eventParams));
                            }
                        }, 200);
                    }

                    if (isRelease !== '1') {
                        this._mockJockey(options);
                    }
                }
                jockey.send(options.eventName, options.eventParams);
            },
            _mockJockey: function (options) {
                ajaxService
                    .send(options.mockPath, { jockeyType: options.eventParams.jockeyType })
                    .then(function (res) {
                        // jockey.send(options.eventParams.jockeyType, res);
                        options.jockeyCallback.bind(options.callbackContext)(res);
                    });
            }
        };
    }]);
});