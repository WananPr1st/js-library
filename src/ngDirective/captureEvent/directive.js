/**
 * 在事件捕获阶段处理JS事件
 * @author xiabaiyang
 * @params eventHandler: 事件处理函数
 * @params eventType: 捕获事件类型
 */
define(function (require) {
    angular
        .module('library.directives')
        .directive('captureEvent', function () {
            return {
                restrict: 'A',
                scope: {
                    eventHandler: '&'
                },
                link: function postLink(scope, iElement, iAttrs) {
                    iElement[0].addEventListener(iAttrs.eventType, function ($event) {
                        scope.$apply(function () {
                            scope.eventHandler({
                                $event: $event
                            });
                        });
                    }, true);
                }
            }
        });
});