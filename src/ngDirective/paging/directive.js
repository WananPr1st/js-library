/**
 * @file 分页
 * @author  Helinfeng (helinfeng@baijiahulian.com)
 *
 * usage: 
 * <paging total-count="{{totalCount}}" current-page="{{currentPage}}"></paging>
 *
 *
 */

define(function (require) {

    'use strict';

    angular
        .module('paging')
        .directive('paging', function () {
        return {
            restrict: 'AE',
            scope: {
                totalCount: '@',
                currentPage: '@',
                from: '@'
            },
            template: 
                '<div class="page-wrapper" ng-show="totalCount>0">' +
                '   <pagination' +
                '       total-items="totalCount"' +
                '       class="pull-right"' +
                '       ng-model="currentPage"' +
                '       items-per-page="{{$parent.pageSize || 20}}"' +
                '       max-size="5"' +
                '       boundary-links="true"' +
                '       rotate="false"' +
                '       previous-text="<"' +
                '       next-text=">"' +
                '       first-text="<<"' +
                '       last-text=">>"' +
                '       ng-change="changePage()"' +
                '       align = "right">' +
                '   </pagination>' +
                '</div>',
            link: function ($scope, $element, $attr) {
                $scope.pageSize = $scope.$parent.pageSize || 20;

                $scope.changePage = function () {
                    $scope.$emit('changepage', {
                        page: $scope.currentPage,
                        target: $element,
                        from: $attr.from || ''
                    });
                };
            }
        };
    });
});