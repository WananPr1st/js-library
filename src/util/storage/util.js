/**
 * @file storage的公共工具集
 * @author Leo Wang(wangkemiao@baidu.com)
 */

define(function (require) {

    /**
     * 基础toString方法
     */
    function toString(target) {
        return Object.prototype.toString.call(target);
    }

    /**
     * 拓展对象
     * 不用$.extend是因为$.extend在对象属性值为数组的时候，
     * 对数组做的是merge而不是替换
     * @param {Object} source 源对象
     * @param {Object} destination 用于扩展的对象
     * @returns {*} 扩展以后的对象
     */
    function extend(source, destination) {
        for (var key in destination) {
            if (destination.hasOwnProperty(key)) {
                source[key] = destination[key];
            }
        }
        return source;
    }
    var util = {

        /**
         * 扩展webstorage方法
         * @param {Object} storage 实例
         * @returns {Object} 扩展后的工具集
         */
        getExtendedStorageMethods: function (storage) {
            var methods = {

                /**
                 * 获取数据
                 * @param {string} key 键
                 */
                getItem: function (key) {
                    var value = null;
                    try {
                        value = JSON.parse(storage.getItem(key));
                    } catch (e) { }

                    return value;
                },

                /**
                 * 设置数据
                 * @param {string} key 键
                 * @param {*} value 值
                 * @returns {*} 返回新值
                 */
                setItem: function (key, value) {
                    if (typeof key != 'string' || !key) {
                        throw new Error('错误的storage.setItem使用，非法键值');
                    }
                    storage.setItem(key, JSON.stringify(value));
                    return storage.getItem(key);
                },

                /**
                 * 更新数据
                 * @param {string} key 键
                 * @param {*} value 要更新的值
                 * @returns {*} 返回新值
                 */
                updateItem: function (key, value) {
                    if (typeof key != 'string' || !key) {
                        throw new Error('错误的storage.updateItem使用，'
                            + '非法键值');
                    }
                    var origValue = methods.getItem(key);
                    if (toString(origValue) !== toString(value)) {
                        methods.setItem(key, value);
                        return;
                    }

                    if ($.isPlainObject(value)) {
                        methods.setItem(key, extend(origValue, value));
                    } else {
                        methods.setItem(key, value);
                    }
                    return methods.getItem(key);
                },

                /**
                 * 删除数据
                 * @param {string} key 键
                 */
                removeItem: function (key) {
                    storage.removeItem(key);
                },

                /**
                 * 清空数据
                 */
                clear: function () {
                    storage.clear();
                }
            };

            return methods;
        }
    };

    return util;
});