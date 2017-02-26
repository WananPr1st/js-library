'use strict'

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    grunt.initConfig({
        connect: {
            server: {
                options: {
                    port: 8848,
                    hostname: '0.0.0.0',
                    keepalive: true,
                    base: '../',
                    debug: true,
                    middleware: function (connect, options, middlewares) {
                        // 伪造ajax数据
                        // middlewares.unshift(require('./grunt/mock')(grunt));

                        // 对less文件做处理
                        //  middlewares.unshift(require('./grunt/lessMock')(grunt));

                        return middlewares;
                    }
                }
            }
        }
    });

    /**
     * 構建任務
     */
    grunt.registerTask('server', [
        'connect:server'
    ]);
};