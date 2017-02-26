/**
 * @file 时间范围选择
 * 该指令在使用的时候只能以属性的形式挂在input元素上，
 * 通过ng-model进行双向数据绑定。
 * ng-model的数据结构为
 * {
 *    begin: 1403020800000, // 范围开始时间戳
 *    end: 1405612800000 // 范围结束时间戳
 * }
 * 如：<input daterangepicker options="options" ng-model="dateRange" />
 *
 * @author yanlingling(yanlingling@baijiahulian.com)
 * @date   2015/11/06
 */
define(function (require) {
    'use strict';
    require('../module');
    require('../../widget/daterangepicker/index');
    require('../../widget/datetimepicker/index');
    angular
        .module('library.directives')
        .directive('daterangepicker', ['$timeout', function ($timeout) {
            return {
                restrict: 'A',
                scope: {

                    /**
                     * @param {number} options.selectableBegin 可选时间的开始
                     * @param {number} options.selectableEnd 可选时间的结束
                     * @param {number} options.maxDuration 最大时间间隔
                     * @param {function} options.onDateSelect 选择时间以后的回调
                     */
                    options: '=options'
                },
                require: '?ngModel',
                link: function (scope, element, attrs, ngModelCtrl) {

                    var options = scope.options || {};
                    if (options &&
                        (typeof options.selectableBegin !== 'number'
                            || typeof options.selectableEnd !== 'number')) {
                        console.error('selectableBegin,selectableEnd请传入时间戳');
                        return;
                    }

                    /**
                     * modelValue转为视图用的数据
                     */
                    ngModelCtrl.$formatters.push(function (modelValue) {
                        if (modelValue) {
                            scope.begin = modelValue.begin;
                            scope.end = modelValue.end;
                        }
                        return modelValue;
                    });


                    ngModelCtrl.$parsers.push(function (viewValue) {
                        return viewValue;
                    });


                    ngModelCtrl.$render = function () {
                        if (typeof scope.begin == 'undefined'
                            || typeof scope.end == 'undefined') {
                            console.error('请为ngModel初始化');
                            return;
                        }
                        if (typeof scope.begin != 'number'
                            || typeof scope.end != 'number') {
                            console.error('请为ngModel传入时间戳');
                            return;
                        }
                        var uiParam = {
                            selectableDateRange: {
                                from: new Date(options.selectableBegin) || new Date('2000-1-1'),
                                to: new Date(options.selectableEnd) || new Date()
                            },
                            isAppendBody: true,
                            zIndex: options.zIndex || 1060,
                            maxDuration: options.maxDuration || 30,
                            // 当前选择的时间段
                            selectedRange: {
                                from: new Date(scope.begin),
                                to: new Date(scope.end)
                            },
                            onDateSelect: function (val) {
                                var split = val.split('-');
                                var begin = split[0];
                                var end = split[1];
                                var res = {
                                    begin: new Date(begin).getTime(),
                                    // 结束时间为选中日期的23点59分59秒
                                    end: new Date(end).getTime() + (24 * 60 * 60 * 1000 - 1)
                                };
                                ngModelCtrl.$setViewValue(res);
                                options.onDateSelect && options.onDateSelect(res);
                            }
                        };
                        $(element).daterangepicker(uiParam).prop('readonly', true);
                    };
                }
            };
        }]);
});