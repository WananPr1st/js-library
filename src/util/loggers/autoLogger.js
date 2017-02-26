/**
 * @file Provide the auto logger that install the specificLogger into the
 * methods.
 *
 * Usage:
 * Install the specLogger to a specif class/object. A specLogger is defined
 * as such an object:
 * {
 *    methodName1: {
 *       before: function() {...},
 *       after: function() {...}
 *    },
 *    methodName2: {
 *       before: function() {...},
 *       after: function() {...}
 *    }
 * }
 * This logger methods (before and after) will be called when the methods
 * (methodName1 and methodName2) in the class/object are called.
 * This is a kind of concretely usage of AOP.
 *
 * @author: Lijie Chen (chenlijie@baidu.com)
 * @author: Leo Wang (wangkemiao@baidu.com)
 */

define(function(require) {

    /**
     * The AOP library.
     */
    var aop = require('../../base/aop');

    /**
     * The object to be exported.
     */
    var autoLogger = {};

    /**
     * Makes an object support automatically log.
     * 请注意：
     *     1. 将自动遍历对象自身所有方法，并添加后置性质的支持
     *     2. 对于后置性重新定义的方法，有可能无效
     *     3. 不支持闭包中的私有方法
     *
     * @param {Object} to The object to be monitored.
     * @param {Object} specLogger The specific logger which is used to write
     *     concrete content.
     */
    autoLogger.enableWith = function(to, specLogger) {
        for (var method in specLogger) {
            if (to[method] && 'function' === typeof to[method]) {
                aop.around(to, method,
                           specLogger[method].before, specLogger[method].after);
            }
        }
    };

    /**
     * Makes an class to support automatically log.
     *   请注意：
     *      1. 将自动遍历类的prototype的自身所有方法，并添加后置性质的支持
     *      2. 对于后置性重新定义的方法，有可能无效
     *      3. 不支持闭包中的私有方法
     *
     * @param {Object} target The class to be monitored.
     * @param {Object} specLogger The specific logger which is used to write
     *     concrete content.
     */
    autoLogger.inheritWith = function(target, specLogger) {
        autoLogger.enableWith(target.prototype, specLogger);
    };

    return autoLogger;
});
