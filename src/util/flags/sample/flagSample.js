/**
 * @file This is a sample file to load the flag lib by a given config.
 *
 * @author: Lijie Chen (chenlijie@baidu.com)
 * Date: 2013-09-18
 */

define(function(require, exports, module) {
    var EjFlag = require('src/framework/flags/EjFlag');

    // config is defined in ../test/run.html
    var config = null;
    if (module) {
        config = module.config();
    }

    if (config && config.version && config.version == 'debug') {
        return new EjFlag(require(
            'src/framework/flags/sample/flagConfigSampleDebug'));
    } else {
        return new EjFlag(require(
            'src/framework/flags/sample/flagConfigSample'));
    }
});
