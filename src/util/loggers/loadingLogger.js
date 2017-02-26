/**
 * @file Provide the util to log the page loading events.
 *
 * @author: Zhifeng Lin (linzhifeng@baidu.com)
 * @author: Lijie Chen (chenlijie@baidu.com)
 */

define(function(require) {
    /**
     * The logger object to send the real element data log.
     *
     * @type {Object}
     */
    var logger = require('./logger');

    /**
     * The error logger.
     *
     * @type {Object}
     */
    var errorLogger = require('./errorLogger');

    /**
     * 记录进入每个页面的时间.
     * 主action和工具箱的进入和退出不是严格按“进入——退出——进入——退出”
     * 的顺序来的，可能存在“进入——进入——退出——退出”的顺序所以以
     * path为key记录每个页面的entertime.
     *
     * @type {Object}
     */
    var loggingStatus = {};

    /**
     * The exported object.
     */
    var loadingLogger = {};

    /**
     * ER manages the path in url hash. So we may re-enter a path by
     * ER. This is a flag to tell if it's the first time we open the page.
     *
     * @type {boolean}
     */
    var firstPageEntered = true;

    /**
     * The invalid timestamp.
     * @type {number}
     */
    var INVALID_TIMESTAMP = 0;

    /**
     * The key for the html loading timestamp.
     * @type {string}
     */
    var KEY_HTML = 'html';

    /**
     * The key for the page entering timestamp.
     * @type {string}
     */
    var KEY_ENTER = 'enter';

    function getNow() {
        return +(new Date());
    }

    function getTimeStamp(key) {
        var timeStampGroup = loggingStatus[logger.getPagePath()];
        if (!timeStampGroup) {
            return INVALID_TIMESTAMP;
        }

        var timeStamp = timeStampGroup[key];
        return timeStamp ? timeStamp : INVALID_TIMESTAMP;
    }

    /**
     * Log the page loading event.
     *
     * @param {string} target The target of the event.
     * @param {boolean=} opt_firstLoading (optinal)
     * @param {string} eventId (optiinal) Id of the event
     */
    function logEvent(target, opt_firstLoading, eventId) {
        var enterStamp = getTimeStamp(KEY_ENTER);
        // Check the necessary param.
        if (enterStamp == INVALID_TIMESTAMP) {
            return;
        }

        var pagePath = logger.getPagePath();

        // Generate the basic params.
        var now = getNow();
        var params = {
            path: pagePath,
            bizTimeSpan: now - enterStamp,
            eventStamp: now
        };

        if (eventId) {
            params.eventId = eventId;
        }

        // If needed, record the static resource loading time span.
        var htmlStamp = getTimeStamp(KEY_HTML);
        if (htmlStamp != INVALID_TIMESTAMP) {
            params.resTimeSpan = enterStamp - htmlStamp;
        } else {
            // Send -1 as a flag to tell backend this is not the first loading
            // request.
            params.resTimeSpan = -1;
        }

        return logger.log(params, target, true);
    }

    /**
     * Records the time when entering the page.
     *
     * @param {?number} opt_resourceStamp The time when the HTML and other
     *     static resource start to load, which is before the business JS
     *     logic is loaded.
     */
    loadingLogger.enterPage = function (opt_resourceStamp) {
        var path = logger.getPagePath();
        if (!path) {
            errorLogger.error('Page path in logger is invalid.');
            return;
        }
        var timeGroup = {};
        if (firstPageEntered && opt_resourceStamp) {
            timeGroup[KEY_HTML] = opt_resourceStamp;
            firstPageEntered = false;
        }
        timeGroup[KEY_ENTER] = getNow();
        loggingStatus[logger.getPagePath()] = timeGroup;
    };

    /**
     * Records the time that the render is done.
     *
     * @return The content logged. Mainly for testing.
     */
    loadingLogger.logPageEnter = function() {
        return logEvent('page_enter');
    };

    /**
     * Log the time the page render is done, which is ready to serve users's
     * action.
     *
     * @return The content logged. Mainly for testing.
     */
    loadingLogger.logPageReady = function() {
        return logEvent('page_ready');
    };

    /**
     * Records the time user leave the page.
     *
     * @return The content logged. Mainly for testing.
     */
    loadingLogger.logPageExit = function() {
        return logEvent('page_exit');
    };

    /**
     * Records the time of a general event.
     *
     * @param {?boolean} opt_firstLoading True if the page is in first loading.
     *
     * @return The content logged. Mainly for testing.
     */
    loadingLogger.logGeneralEvent = function (
        target, opt_firstLoading, eventId) {
        return logEvent(target, opt_firstLoading, eventId);
    };

    /**
     * Records the window's performance.
     *
     * @param {Object} pageLoadingTimer The extra timer object to be send
     *     to server.
     * @return The content logged. Mainly for testing.
     */
    loadingLogger.logTiming = function(pageLoadingTimer) {
        var strings = require('../../base/strings');
        var params = {
            performanceRecord: strings.stringify(pageLoadingTimer),
            nav: require('../../base/browsers').getUserAgent()
        };
        if (window.performance && window.performance.timing) {
            /**
             * NOTE(linzhifeng):
             * HTML5 performance API 草案
             * http://w3c-test.org/webperf/specs/NavigationTiming/
             * 对支持该草案的浏览器呢发送timing监控
             * 目前,IE9+和 chrome11+,Firefox7+已经实现了该草案定义的接口.
             */
            params.timingRecord = strings.stringify(window.performance.timing);
        }
        return logger.log(params, 'timing',
                          true  /* only use basic params */);
    };

    loadingLogger.resetForTesting = function () {
        loggingStatus = {};
        firstPageEntered = true;
    };

    return loadingLogger;
});
