/**
 * @file Provide the interface to log the error.
 *
 * @author: Lijie Chen (chenlijie@baidu.com)
 */

define(function(require) {
    /**
     * The logger object to send the real error log.
     *
     * @type {Object}
     */
    var logger = require('./logger');

    /**
     * The logging target.
     *
     * @const
     * @type {string}
     */
    var TARGET = 'errorlogging';

    /**
     * The exported object.
     * @type {Object}
     */
    var errorLogger = {};

    /**
     * The level definition.
     *
     * @const
     * @type {string}
     */
    errorLogger.LEVEL_INFO = 'info';

    /**
     * The level definition.
     *
     * @const
     * @type {string}
     */
    errorLogger.LEVEL_WARNING = 'warning';

    /**
     * The level definition.
     *
     * @const
     * @type {string}
     */
    errorLogger.LEVEL_ERROR = 'error';

    /**
     * The method to log the information.
     *
     * @param {string} message The message to be logged.
     * @param {Object=} opt_params The customized params.
     * @param {Object=} opt_exception The exception object if given.
     */
    errorLogger.info = function(message, opt_params, opt_exception) {
        return errorLogger.log(message, errorLogger.LEVEL_INFO,
                               opt_params, opt_exception);
    };

    /**
     * The method to log the warning.
     *
     * @param {string} message The message to be logged.
     * @param {Object=} opt_params The customized params.
     * @param {Object=} opt_exception The exception object if given.
     */
    errorLogger.warning = function(message, opt_params, opt_exception) {
        return errorLogger.log(message, errorLogger.LEVEL_WARNING,
                               opt_params, opt_exception);
    };

    /**
     * The method to log the error.
     *
     * @param {string} message The message to be logged.
     * @param {Object=} opt_params The customized params.
     * @param {Object=} opt_exception The exception object if given.
     */
    errorLogger.error = function(message, opt_params, opt_exception) {
        return errorLogger.log(message, errorLogger.LEVEL_ERROR,
                               opt_params, opt_exception);
    };

    /**
     * The common logging method to log different level of errors.
     *
     * @param {string} message The message to be logged.
     * @param {string} level The level of the error.
     * @param {Object=} opt_params The customized params.
     * @param {Object=} opt_exception The exception object if given.
     */
    errorLogger.log = function(message, level, opt_params, opt_exception) {
        var params = opt_params || {};
        params.msg = message;
        params.level = level;
        if (opt_exception && opt_exception.toString) {
            params.exception = opt_exception.toString();
        };

        // Check the global debug mode, the local debug mode and the console.
        if ((window.IS_DEBUG_MODE || logger.isDebugMode()) && console) {
            var strings = require('../../base/strings');
            console.log('(' + TARGET + '): ', strings.stringify(params));
        }

        return logger.log(params, TARGET, true  /* onlyUseBasicParams */);
    };

    return errorLogger;
});
