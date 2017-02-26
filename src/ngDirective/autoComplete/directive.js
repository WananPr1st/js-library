/**
 * @fileOverview autoComplete reference angucomplete
 * 
 *    usage: 
 * 
 *    <auto-complete id="ex1"
 *       placeholder="Search countries"
 *       pause="100"
 *       selectedobject="selectedCountry"
 *       localdata="countries"
 *       searchfields="name"
 *       titlefield="name"
 *       minlength="1"
 *       inputclass="form-control form-control-small">
 *   </auto-complete>
 *   
 * @author XiaoBin Li 
 */

define(function (require) {

    'use strict';

    angular.module('library.directives')
        .directive('autoComplete', ['$parse', '$http', '$sce', '$timeout',
                function ($parse, $http, $sce, $timeout) {

        return {
            restrict: 'EA',
            scope: {
                'id': '@id',
                'placeholder': '@placeholder',
                'selectedObject': '=selectedobject',
                'url': '@url',
                'dataField': '@datafield',
                'titleField': '@titlefield',
                'descriptionField': '@descriptionfield',
                'imageField': '@imagefield',
                'imageUri': '@imageuri',
                'inputClass': '@inputclass',
                'userPause': '@pause',
                'localData': '=localdata',
                'searchFields': '@searchfields',
                'minLengthUser': '@minlength',
                'matchClass': '@matchclass',
                'requestParams': '=',
                'searchKey': '@',
                'adaptResult': '&',
                'onSelected': '&',
                'defaultSearchKey': '='
            },
            
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || '/src/ngDirective/autoComplete/tpl.html';
            },
            link: function($scope, elem, attrs) {
                $scope.lastSearchTerm = null;
                $scope.currentIndex = null;
                $scope.justChanged = false;
                $scope.searchTimer = null;
                $scope.hideTimer = null;
                $scope.searching = false;
                $scope.pause = 500;
                $scope.minLength = 3;
                $scope.searchStr = '';//zhanwentao
                // hanrui  处理在编辑时，文本框左右移动光标，清空数据的问题
                $scope.$watch('defaultSearchKey', function (newVal) {
                    if (newVal) {
                        $scope.searchStr = newVal || '';
                    }
                });

                if ($scope.minLengthUser && $scope.minLengthUser != '') {
                    $scope.minLength = $scope.minLengthUser;
                }

                if ($scope.userPause) {
                    $scope.pause = $scope.userPause;
                }

                var isNewSearchNeeded = function(newTerm, oldTerm) {
                    return newTerm.length >= $scope.minLength && newTerm != oldTerm;
                };

                $scope.processResults = function(responseData, str) {
                    if (responseData && responseData.length > 0) {
                        $scope.results = [];

                        var titleFields = [];
                        if ($scope.titleField && $scope.titleField != '') {
                            titleFields = $scope.titleField.split(',');
                        }

                        for (var i = 0; i < responseData.length; i++) {
                            // Get title variables
                            var titleCode = [];

                            for (var t = 0; t < titleFields.length; t++) {
                                titleCode.push(responseData[i][titleFields[t]]);
                            }

                            var description = '';
                            if ($scope.descriptionField) {
                                description = responseData[i][$scope.descriptionField];
                            }

                            var imageUri = '';
                            if ($scope.imageUri) {
                                imageUri = $scope.imageUri;
                            }

                            var image = '';
                            if ($scope.imageField) {
                                image = imageUri + responseData[i][$scope.imageField];
                            }

                            var text = titleCode.join(' ');
                            if ($scope.matchClass) {
                                var re = new RegExp(str, 'i');
                                var strPart = text.match(re)[0];
                                text = $sce.trustAsHtml(
                                    text.replace(re, '<span class="'+ $scope.matchClass + '">' + strPart + '</span>')
                                );
                            }

                            var resultRow = {
                                title: text,
                                description: description,
                                image: image,
                                originalObject: responseData[i]
                            };

                            $scope.results[$scope.results.length] = resultRow;
                        }


                    } else {
                        $scope.results = [];
                    }
                };

                $scope.searchTimerComplete = function(str) {
                    // Begin the search

                    if (str.length >= $scope.minLength) {
                        if ($scope.localData) {
                            var searchFields = $scope.searchFields.split(',');

                            var matches = [];

                            for (var i = 0; i < $scope.localData.length; i++) {
                                var match = false;

                                for (var s = 0; s < searchFields.length; s++) {
                                    match = match || (typeof $scope.localData[i][searchFields[s]] === 'string' && typeof str === 'string' && $scope.localData[i][searchFields[s]].toLowerCase().indexOf(str.toLowerCase()) >= 0);
                                }

                                if (match) {
                                    matches[matches.length] = $scope.localData[i];
                                }
                            }

                            $scope.searching = false;
                            $scope.processResults(matches, str);

                        } else {
                            var requestParams = $scope.requestParams || {};
                            var params = {};
                            params[$scope.searchKey || 'searchKey'] = str;
                            $.extend(requestParams, params);
                            $.ajax({
                                url: $scope.url,
                                type: 'POST',
                                data: JSON.stringify(requestParams),
                                dataType: 'json',
                                contentType: 'application/json',
                                processData: false
                            })
                            .done(function (responseData, status, headers, config) {
                                $timeout(function () {
                                    var adaptResult = $scope.adaptResult;
                                    if (adaptResult && $.type(adaptResult) === 'function') {
                                        adaptResult({
                                            results: responseData
                                        });
                                    }
                                    $scope.searching = false;
                                    $scope.processResults((($scope.dataField) ? responseData[$scope.dataField] : responseData ), str);
                                });
                            });

                            // get 请求方式，暂时用不上，先禁用掉
                            return;

                            $http.get($scope.url + str, {}).
                                success(function(responseData, status, headers, config) {
                                    $scope.searching = false;
                                    $scope.processResults((($scope.dataField) ? responseData[$scope.dataField] : responseData ), str);
                                }).
                                error(function(data, status, headers, config) {
                                    console.log('error');
                                });
                        }
                    }
                };
                $scope.hideResults = function() {
                    $scope.hideTimer = $timeout(function() {
                        $scope.showDropdown = false;
                    }, $scope.pause);
                };

                $scope.resetHideResults = function() {
                    if($scope.hideTimer) {
                        $timeout.cancel($scope.hideTimer);
                    }
                    // focus时，关键词长度大于suggestion的最小长度，做一次查询
                    if ($scope.searchStr.length > $scope.minLength) {
                        search();
                    } 
                };

                $scope.hoverRow = function(index) {
                    $scope.currentIndex = index;
                };

                function search() {
                    $scope.lastSearchTerm = $scope.searchStr;
                    $scope.showDropdown = true;
                    $scope.currentIndex = -1;
                    $scope.results = [];

                    if ($scope.searchTimer) {
                        $timeout.cancel($scope.searchTimer);
                    }

                    $scope.searching = true;

                    $scope.searchTimer = $timeout(function() {
                        $scope.searchTimerComplete($scope.searchStr);
                    }, $scope.pause);
                }

                $scope.keyPressed = function(event) {
                    var keyCode = event.keyCode;
                    // 文本框回车允许查询数据
                    // 在输入框里输入上下键不要请求数据
                    var isSpecialInput = keyCode == 38 
                        || keyCode == 40
                        || (keyCode == 13 && angular.isNumber($scope.currentIndex) && $scope.currentIndex >= 0);
                    if (isSpecialInput) {
                        event.preventDefault();
                    } else {
                        if (!$scope.searchStr || $scope.searchStr === '') {
                            $scope.showDropdown = false;
                            $scope.lastSearchTerm = null;
                            $scope.selectedObject = null;
                            if ($.isFunction($scope.onSelected)) {
                                $scope.onSelected({
                                    data: null,
                                    scope: $scope
                                });
                            }
                        } else if (isNewSearchNeeded($scope.searchStr, $scope.lastSearchTerm)) {
                            search();
                        }
                    }
                };

                $scope.selectResult = function(result) {
                    if ($scope.matchClass) {
                        result.title = result.title.toString().replace(/(<([^>]+)>)/ig, '');
                    }
                    $scope.searchStr = $scope.lastSearchTerm = result.title;
                    $scope.selectedObject = result;
                    $scope.showDropdown = false;
                    $scope.results = [];
                    if ($.isFunction($scope.onSelected)) {
                        //zhanwentao
                        $scope.searchStr = $scope.onSelected({
                            data: result,
                            scope: $scope
                        });
                    }
                    // $scope.$apply();
                };

                var inputField = elem.find('input');

                inputField.on('keyup', $scope.keyPressed);

                elem.on('keyup', function (event) {
                    if(event.which === 40) {
                        if ($scope.results && ($scope.currentIndex + 1) < $scope.results.length) {
                            $scope.currentIndex ++;
                            $scope.$apply();
                            event.preventDefault;
                            event.stopPropagation();
                        }

                        $scope.$apply();
                    } else if(event.which == 38) {
                        if ($scope.currentIndex >= 1) {
                            $scope.currentIndex --;
                            $scope.$apply();
                            event.preventDefault;
                            event.stopPropagation();
                        }

                    }
                    else if (event.which == 13) {
                        if ($scope.results && $scope.currentIndex >= 0 && $scope.currentIndex < $scope.results.length) {
                            $scope.selectResult($scope.results[$scope.currentIndex]);
                            $scope.$apply();
                        }
                        // hanrui 修改，已和xiaobin确认，避免回车清楚数据
                        event.preventDefault;
                        event.stopPropagation();
                    }
                    else if (event.which == 27) {
                        $scope.results = [];
                        $scope.showDropdown = false;
                        $scope.$apply();
                    } else if (event.which == 8) {
                        $scope.selectedObject = null;
                        $scope.$apply();
                    }
                });

            }
        };
    }]);
});
