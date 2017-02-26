/**
 * @file Provide the util to travel the event target elements and send the
 * content in data-log attribute to server.
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
     * The user behavior index which is used to log the user behavior.
     */
    var ubIndex = 0;

    /**
     * The handler of the data-log attribute.
     *
     * @param {Event} e The event status.
     */
    function dataLogHandler(e) {
        var event = e || window.event;
        var element = event.target || event.srcElement;
        while (element && element.nodeType != 9 //上溯到HTML对象
               && element.getAttribute) {
            var param = element.getAttribute('data-log');
            if (param) {
                // 针对非UI，没有定义logSwitch
                // 针对UI，logSwitch为true(label,button,textInput),
                // 在IE下得到的logSwitch为boolean类型，在FF下得到的是String类型
                if (!element.attributes.getNamedItem('logSwitch')
                    || element.getAttribute('logSwitch').toString() == 'true') {
                    var eventType = event.type;

                    // Ignore input behavior.
                    if (eventType == 'keypress' && element.tagName == 'INPUT') {
                        return;
                    }

                    eval('param = ' + param);
                    if (typeof param == 'function') {
                        param = param();
                    }
                    param.eventType = eventType;
                    param.logType = 'UBC';  // User Behavior Capture
                    param.ubIndex = ubIndex++;
                    return logger.log(param);
                }
            }
            element = element.parentNode;
        }
    };

    /**
     * The exported object.
     */
    var elementLogger = {};

    /**
     * Installs the elementLogger on an element.
     *
     * @param {Element} element The element that trigger the logging.
     * @param {Event} event The event that trigger the logging.
     */
    elementLogger.on = function(element, event) {
        $(element).on(event, dataLogHandler);
    }

    /**
     * Exports the handler function. Mainly for testing.
     */
    elementLogger.handler = dataLogHandler;

    /**
     * Method to reset the internal status for testing.
     * Never call this method in prod code.
     */
    elementLogger.resetForTest = function() {
        ubIndex = 0;
    }

    return elementLogger;
});
