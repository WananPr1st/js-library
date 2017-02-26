/**
 * @file 时间选择
 * @author yanlingling(yanlingling@baijiahulian.com)
 * 该指令在使用的时候只能以属性的形式挂在input元素上，
 * 通过ng-model进行双向数据绑定。ng-model的值即为当前选定日期0点的时间戳
 * 如：<input datetimepicker options="options" ng-model="selectedTime" />
 * @date   2015/11/06
 */
define(function (require) {
    'use strict';
    require('../module');
    require('../../widget/datetimepicker/index');
    angular
        .module('library.directives')
        .directive('datetimepicker', ['$timeout', function ($timeout) {
            return {
                restrict: 'EA',
                scope: {

                    /**
                     * @param {number} options.selectableBegin 可选时间的开始时间戳
                     * @param {number} options.selectableEnd 可选时间的结束结束时间戳
                     * @param {number} options.onDateSelect 选择时间以后的回调
                     */
                    options: '=options'
                },
                require: '?ngModel',
                link: function (scope, element, attrs, ngModelCtrl) {

                    /**
                     * modelValue转为视图用的数据
                     */
                    ngModelCtrl.$formatters.push(function (modelValue) {
                        if (modelValue) {
                            scope.selectedDate = modelValue;
                        }
                        return modelValue;
                    });


                    ngModelCtrl.$parsers.push(function (viewValue) {
                        return viewValue;
                    });

                    ngModelCtrl.$render = function () {
                        var options = scope.options;
                        var uiParam = {
                            selectedDate: new Date(scope.selectedDate),
                            isAppendBody: true,
                            zIndex: options.zIndex || 1100,
                            selectableDateRange: {
                                from: new Date(options.selectableBegin) || new Date('2000-1-1'),
                                to: new Date(options.selectableEnd) || new Date()
                            },
                            onDateSelect: function (val) {
                                var val = new Date(val).getTime();
                                ngModelCtrl.$setViewValue(val);
                                options.onDateSelect && options.onDateSelect(val);
                            }
                        };
                        $(element).datetimepicker(uiParam).prop('readonly', true);
                    };
                }
            };
        }]);
});