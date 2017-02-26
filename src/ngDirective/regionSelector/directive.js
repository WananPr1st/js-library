/**
 * @file 省市的选择
 * @author xiabaiyang
 *
 * usage:
 *
 * <div region-selector></div>
 *
 */
define(function () {
    angular.module('regionSelector', [])
        .directive('regionSelector', ['$http', function ($http) {
            return {
                restrict: 'EA',
                scope: true,
                templateUrl: '/src/ngDirective/regionSelector/tpl.html',
                replace: false,
                link: function ($scope, elem, attrs) {
                    var url = 'http://www.genshuixue.com/area/list?callback=JSON_CALLBACK';
                    if (location.href.indexOf('https') === 0) {
                        url = 'https://www.genshuixue.com/area/list?callback=JSON_CALLBACK';
                    }
                    $http.jsonp(url, {cache: true}).success(
                        function (data) {
                            $scope.provinces = data;
                        }
                    );

                    /**
                     * 查询条件变化的时候及时请求
                     */
                    $scope.$watch('query.province', function (newVal, oldVal) {
                        if (newVal !== oldVal) {
                            $scope.query.city = null;
                            $scope.query.county = null;
                            if (newVal) {
                                $http.jsonp(url + '&p_id=' + newVal + '&level=2', {cache: true}).success(
                                    function (data) {
                                        $scope.citys = data;
                                    }
                                );
                            } else {
                                $scope.citys = [];
                                $scope.countys = [];
                            }
                        }
                    }, true);

                    /**
                     * 查询条件变化的时候及时请求
                     */
                    if ($scope.showCounty) {
                        $scope.$watch('query.city', function (newVal, oldVal) {
                            if (newVal !== oldVal) {
                                $scope.query.county = null;
                                if (newVal) {
                                    $http.jsonp(url + '&p_id=' + newVal + '&level=3', {cache: true}).success(
                                        function (data) {
                                            $scope.countys = data;
                                        }
                                    );
                                } else {
                                    $scope.countys = [];
                                }
                            }
                        }, true);
                    }
                }
            };
        }])
});