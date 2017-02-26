/**
 * @file loading服务
 * 支持多实例和单实例
 * 1、单实例：基于整个窗口
 * 2、多实例：基于父dom，只遮挡父dom
 * @author hanrui
 * @date   2015/11/18
 */
define(function (require) {
    var Loading = require('../../widget/loading/Loading');
    // require('../module');
    angular.module('library.services')
        .factory('loadingService', function () {
            var loadingObj;
            return {
                /**
                 * 创建新实例，支持多实例
                 * @param  {?Object} options 参数设置
                 * @param  {Object|string} options.elem dom元素或者dom选择器，为number时，按照zIndex处理
                 *         class: 例如：'.loading'
                 *         id: 例如：'#loading'
                 * @param  {number} options.zIndex 设置zIndex, 默认1060
                 * @param  {boolean} options.isShowMask 是否隐藏背景遮挡层
                 * @return {Object} Loading的新实例
                 * @public
                 */
                create: function (options) {
                    // if (!loadingObj) {
                        loadingObj = new Loading(options);
                    // }
                    return loadingObj;
                },
                /**
                 * 创建新实例，支持多实例
                 * @param  {?Object} options 参数设置
                 * @param  {Object|string} options.elem dom元素或者dom选择器，为number时，按照zIndex处理
                 *         class: 例如：'.loading'
                 *         id: 例如：'#loading'
                 * @param  {number} options.zIndex 设置zIndex, 默认1060
                 * @param  {boolean} options.isShowMask 是否隐藏背景遮挡层
                 * @return {Object} Loading的新实例
                 * @public
                 */
                show: function (options) {
                    if (!loadingObj || !loadingObj.options) {
                        loadingObj = new Loading(options);
                    }
                    loadingObj.show();
                    return loadingObj;
                },
                /**
                 * 隐藏
                 * @public
                 */
                hide: function () {
                    loadingObj.hide();
                },
                /**
                 * 重新渲染，只有局部渲染才有意义
                 * @public
                 */
                resize: function () {
                    loadingObj.resize();
                },
                /**
                 * 析构函数
                 * @public
                 */
                destroy: function () {
                    loadingObj.destroy();
                    loadingObj = null;
                }
            };
        });
});