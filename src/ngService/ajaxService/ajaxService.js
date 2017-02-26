/**
 * @file ajax service
 * @author hanrui
 * @date   2015/11/03
 */
define(function (require) {
    require('../module');
    angular
        .module('library.services')
        .factory('ajaxService', ['$http', '$q', '$cacheFactory', '$timeout', function ($http, $q, $cacheFactory, $timeout) {
            var ajaxCache;
            var deferred = $q.defer();
            // cache的key值
            var key;
            // 成功状态码，默认200
            var doneCode;
            // 失败状态码，默认400
            var failCode;
            // 状态码对应字段，默认status
            var dataField;
            return {
                /**
                 * 发送请求
                 * @param {string} path 请求的path
                 * @param {Object} options 请求的参数
                 * @param {string} options.method 请求的method，默认'POST'
                 * @param {string} options.responseType 请求的responseType，默认'json'
                 * @param {string} options.contentType 请求的contentType，默认'application/json'
                 * @param {Function} options.transformRequest 请求的参数二次处理
                 * @param {Object} options.data 请求的参数，没有-直接发送options
                 * @param {boolean} options.isResponseFilter 是否对response返回数据做过滤，会过滤掉\u0001-\u001f之间控制字符，默认false
                 * @param {Function} options.successHandler 成功回调函数
                 * @param {Function} options.failHandler 失败回调函数
                 * @param {Function} options.partSuccessHandler 部分成功回调函数
                 * @param {Function} options.logoutUrl 700异常，退出操作
                 * @param {Function} options.alert 提示框
                 * @param {Object|boolean} options.cache
                 * 缓存
                 *    boolean: == true, 通过$cacheFactory创建
                 *    {} 有缓存从缓存读取，没有写入，key: path + '_' + JSON.stringify(options)
                 * @param {number} options.cacheExpires 缓存过期时间，单位毫秒
                 * @param {Object} options.userDefineErrors 用户自定义error code
                 * @param {string} options.userDefineErrors.doneCode 成功状态码，默认200
                 * @param {string} options.userDefineErrors.failCode 失败状态码，默认400
                 * @param {string} options.userDefineErrors.dataField 状态码对应字段，默认是status
                 * @param {Array<Object>} options.userDefineErrors.otherCodes 其他自定义状态码
                 * @param {string} options.userDefineErrors.otherCodes.code 状态码
                 * @param {Function} options.userDefineErrors.otherCodes.handler 对应处理函数
                 * @param {Object} options.options 如果我这里都不能满足你，请直接设置该属性
                 * @return {Object}         promise
                 */
                send: function(path, options) {
                    return doRequest(path, options);
                },
                /**
                 * 清空指定path的缓存
                 * @param path
                 */
                clearCache: function () {
                    ajaxCache && ajaxCache.destroy();
                }
            };
            // 请求
            function doRequest(path, options) {
                options = options || {};
                var params = initParams(path, options);
                var data;
                if (options.cache) {
                    key = path + '_' + JSON.stringify(options);
                    data = ajaxCache.get(key);
                    if (data && options.cacheExpires && new Date().getTime() - data.createTime > options.cacheExpires) {
                        data = null;
                        ajaxCache.remove(key);
                    }
                }
                if (data) {
                    $timeout(function () {
                        successCallback(data.data, options, params);
                    });
                } else {
                    $http(params)
                        .success(function (data) {
                            successCallback(data, options, params);
                        })
                        .error(function (er) {
                            options.alert ? options.alert('网络异常') : window.alert('网络异常');
                            deferred.reject(er);
                        });
                }
                return deferred.promise;
            }
            // 初始化参数
            function initParams(path, options) {
                doneCode = options.userDefineCodes && options.userDefineCodes.doneCode || 200;
                failCode = options.userDefineCodes && options.userDefineCodes.failCode || 400;
                dataField = options.userDefineCodes && options.userDefineCodes.dataField || 'status';
                if (options.cache) {
                    if (angular.isObject(options.cache)) {
                        ajaxCache = options.cache;
                    } else {
                        ajaxCache = $cacheFactory('ajax_cache_' + new Date().getTime());
                    }
                }
                var params = options.options || {
                    method: options.method || 'POST',
                    responseType: options.responseType || 'json',
                    headers: {
                        'Content-Type': options.contentType || 'application/json'
                    },
                    transformRequest: function (obj) {
                        if ($.isFunction(options.transformRequest)) {
                            return options.transformRequest(obj);
                        }
                        return obj;
                    },
                    url: path,
                    data: options.data ? JSON.stringify(options.data) : JSON.stringify(options)
                };
                // 后端json.stringify问题，没有过滤掉\u0001-\u001f字符
                if (options.isResponseFilter && Array.isArray($http.defaults.transformResponse)) {
                    $http.defaults.transformResponse.unshift(function (value) {
                        if (value.startsWith('{"data"')) {
                            var rx_escapable = /[\u0000-\u001f]/g;
                            var data = rx_escapable.test(value)
                                ? value.replace(rx_escapable, function (a) {
                                    return '\\u' + ('0000' + a.charCodeAt(0).toString(16));
                                })
                                : value;
                            return data;
                        }
                        return value;
                    });
                }
                return params;
            }
            // 成功回调
            function successCallback(data, options) {
                var status = data[dataField];
                switch (status) {
                    case doneCode:
                        // 成功
                        if (options.successHandler && angular.isFunction(options.successHandler)) {
                            options.successHandler(data);
                        }
                        if (options.cache) {
                            ajaxCache.put(key, {
                                data: data,
                                createTime: new Date().getTime()
                            });
                        }
                        deferred.resolve(data);
                        break;
                    case 300:
                        // 部分成功
                        if (options.partSuccessHandler && angular.isFunction(options.partSuccessHandler)) {
                            options.partSuccessHandler(data);
                        }
                        deferred.resolve(data);
                        break;
                    case failCode:
                        if (options.failHandler && angular.isFunction(options.failHandler)) {
                            options.failHandler(data);
                        }
                        deferred.reject(data);
                        break;
                    case 500:
                        options.alert ? options.alert('系统异常') : window.alert('系统异常');
                        deferred.reject(data);
                        break;
                    case 700:
                        // 登录异常
                        if (options.logoutUrl) {
                            return $http({
                                method: options.method || 'GET',
                                url: options.logoutUrl,
                                data: {}
                            });
                        }
                        break;
                    default:
                        if (!options.userDefineErrors || !options.userDefineErrors.otherCodes) {
                            deferred.reject(data);
                            return;
                        }
                        // 其他状态码
                        var otherCodes = options.userDefineErrors.otherCodes;
                        if (Array.isArray) {
                            otherCodes.forEach(function (error) {
                                error.code === status && $.isFunction(error.handler) && error.handler(data);
                            });
                        } else {
                            for (var i = 0, error; (error = otherCodes[i++]); ) {
                                error.code === status && $.isFunction(error.handler) && error.handler(data);
                            }
                        }
                        break;
                }
            }
        }]);
});