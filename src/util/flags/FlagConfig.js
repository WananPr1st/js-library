/**
 * @file This file defines the flag's config format.
 *
 * @author: Lijie Chen (chenlijie@baidu.com)
 * Date: 2013-09-18
 */

define(function(require) {
    /**
     * The config of a single flag, including the name, the value and the
     * description.
     *
     * @param {string} name The name of the flag.
     * @param {string|boolean|number} value The value that supported in 3 types.
     * @param {string} description A paragraph of the descripiton about the
     *     flag.
     * @constructor
     */
    var FlagConfig = function(name, value, description) {
        /**
         * The name of the flag.
         * @type {string}
         * @private
         */
        this._name = name;

        /**
         * The value of the flag.
         * @type {string|boolean|number}
         * @private
         */
        this._value = value;

        /**
         * The description of the flag.
         * @type {string}
         * @private
         */
        this._description = description;
    }

    /**
     * Retuns the name of the flag.
     * @return {string}
     */
    FlagConfig.prototype.getName = function() {
        return this._name;
    }

    /**
     * Retuns the value of the flag.
     * @return {string|boolean|number}
     */
    FlagConfig.prototype.getValue = function() {
        return this._value;
    }

    /**
     * Retuns true if the flag type is boolean.
     * @return {boolean}
     */
    FlagConfig.prototype.isBoolean = function() {
        return typeof(this._value) == 'boolean';
    }

    /**
     * Retuns the content of this flag config.
     * @return {string}
     */
    FlagConfig.prototype.toString = function() {
        return [this._name, '=', this._value, ' Desc: ',
                this._description].join('');
    }
    return FlagConfig;
});
