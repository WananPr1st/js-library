/**
 * @file This is a sample file for the flag config definitions.
 *
 * @author: Lijie Chen (chenlijie@baidu.com)
 * Date: 2013-09-18
 */

define(function(require) {
    var FlagConfig = require('src/framework/flags/FlagConfig');
    return [
        new FlagConfig('REAL_DUMMY', true, 'The is a dummy flag for testing')
    ];
});
