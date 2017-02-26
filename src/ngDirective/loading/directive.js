/**
 * @file loading
 * @author hanrui(hanrui@baijiahulian.com)
 * @date   2015/11/03
 */
define(function (require) {
	'use strict';
	require('../module');
	angular
		.module('library.directives')
		.directive('loading', ['$timeout', function ($timeout) {
		return {
			restrict: 'AE',
			replace: true,
			scope: {
				isLoading: '=ngModel',
				// 是否全屏遮挡，false-只遮挡父元素
				isFullScreen: '=',
				// 是否重新加载，true-重新加载
				isResize: '=',
				// 加载url
				imgUrl: '=',
				// 指定zIndex，默认1060，>bootstrap的$modal的zIndex
				zIndex: '='
			},
			template: ''
				+ '<div class="modal-loading" ng-show="isLoading">'
				+	'<div class="modal-loading-backdrop">'
				+	'</div>'
				+	'<div class="modal-loading-tips">'
	    		// +		'<img src="src/resource/img/loading.gif">'
	   			+ 		'数据加载中...'
				+	'</div>'
				+ '</div>',
			compile: function () {
                return {
                    pre: function preLink($scope, element, attr) {
                    	if ($scope.isFullScreen && !$('body').children('.modal-loading').length) {
                    		$(element).appendTo('body');
                    	}
                    },
                    post: function postLine($scope, elem, attr) {
                    	var backdropStyle;
                    	var tipStyle;
                    	$scope.$watch('isResize', function (newValue) {
                    		if (newValue) {
                    			init();
                    		}
                    	});
                    	init();
                    	function initParams(parentWidth) {
                    		$scope.zIndex = $scope.zIndex || 1060;
                    		backdropStyle = {
								top: '0px',
								left: '0px',
								bottom: '0px',
								right: '0px',
								zIndex: $scope.zIndex,
								backgroundColor: '#3d3d3d',
								opacity: 0.5
							};
							tipStyle = {
								left: parentWidth / 2,
								position: 'absolute',
								marginTop: '-25px',
								marginLeft: '-75px',
								zIndex: $scope.zIndex + 2,
								width: '150px',
								height: '50px',
								lineHeight: '50px',
								border: '1px solid #c9c9c9',
								backgroundColor: '#ffffff',
								textAlign: 'center',
								borderRadius: '6px'
							};
                    	}
                    	function insertImg(loadTips) {
                    		if ($scope.imgUrl) {
                    			var img = $('<img>')
                    				.attr('src', $scope.imgUrl)
                    				.css({
                    					width: '15px',
                    					height: '15px'
                    				});
                    			loadTips.prepend(img);
                    		}
                    	}
                    	function init() {
                    		var parent = $scope.isFullScreen ? $('body') : $(elem).parent();
							var parentWidth = parent.width();
							var parentHeight = parent.height() || 200;
							// 最低高度
							parentHeight = parentHeight >= 200 ? parentHeight : 200;
							// 父控件没有加载
							if (!parentWidth) {
								$timeout(function () {
									init();
								}, 300);
							}
                    		var backdropDiv = $(elem).children('.modal-loading-backdrop');
							var tipsDiv = $(elem).children('.modal-loading-tips');
							initParams(parentWidth);
							insertImg(tipsDiv);
							if (!$scope.isFullScreen) {
								parent.css({
									position: 'relative'
								});
								backdropStyle.position = 'absolute';
								backdropStyle.width = parentWidth;
								backdropStyle.height = parentHeight;
								// backdropDiv.hide();
								tipStyle.top = parentHeight / 2;
							} else {
								backdropStyle.position = 'fixed';
								backdropDiv.show();
								tipStyle.top = '200px';
							}
							backdropDiv.css(backdropStyle);
							tipsDiv.css(tipStyle);
                    	}
                    }
                };
            }
		};
	}]);
});