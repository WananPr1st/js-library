/**
 * @fileOverview 动画view-slide动画
 * @author XiaoBin Li(lixiaobin@baijiahulian.com)
 */

define(function () {
    
    'use strict';

    angular.module('library.animation')
        .animation('.view-slide-in', function() {
            return {
                enter: function(element, done) {
                    element.css({
                            position: 'relative',
                            top: '10px',
                            left: '20px'
                        })
                        .animate({
                            top: 0,
                            left: 0,
                            opacity: 1
                        }, 100, done);
                }
            };
    });
});
