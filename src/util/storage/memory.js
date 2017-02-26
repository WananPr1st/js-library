/**
 * @file storage的内存模式
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
     * 内存模式存储类，不对外暴露
     * @constructor
     */
    function MemoryStorage() {

        var data = {};

        /**
         * 支持状态，memory模式肯定是true，浏览器都支持
         * 除非当作其他存储模式的替身，例如localStorage，需要手动标记为false
         * @type {boolean}
         */
        this.supported = true;

        // 构造函数中定义下列四个方法，是为了能够调用私有变量data
        /**
         * 获取数据
         * @param {string} key 键
         */
        this.getItem = function (key) {
            return data[key];
        };

        /**
         * 设置数据
         * @param {string} key 键
         * @param {*} value 值
         * @returns {*} 返回新值
         */
        this.setItem = function (key, value) {
            if (typeof key != 'string' || !key) {
                throw new Error('错误的storage.memory.setItem使用，非法键值');
            }
            data[key] = value;
            return data[key];
        };

        /**
         * 更新数据
         * @param {string} key 键
         * @param {*} value 要更新的值
         * @returns {*} 返回新值
         */
        this.updateItem = function (key, value) {
            if (typeof key != 'string' || !key) {
                throw new Error('错误的storage.memory.updateItem使用，'
                    + '非法键值');
            }
            var origValue = this.getItem(key);
            if (toString(origValue) !== toString(value)) {
                this.setItem(key, value);
                return value;
            }

            if ($.isArray(value) || $.isPlainObject(value)) {
                this.setItem(key, $.extend(true, origValue, value));
            } else {
                this.setItem(key, value);
            }
            return value;
        };

        /**
         * 删除数据
         * @param {string} key 键
         */
        this.removeItem = function (key) {
            delete data[key];
        };

        /**
         * 清空数据
         */
        this.clear = function () {
            data = {};
        };
    }

    /**
     * 默认memory存储实例
     */
    var storage = new MemoryStorage();

    /**
     * 扩展默认memory存储实例，增加一个方法：创建一个新的memory存储实例
     * 它可以用于自定义的位置，例如独立的模块中
     */
    storage.createInstance = function () {
        return new MemoryStorage();
    };

    return storage;
});