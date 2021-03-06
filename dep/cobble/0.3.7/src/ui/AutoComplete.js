/**
 * @file AutoComplete
 * @author zhujl
 */
define(function (require, exports, module) {

    'use strict';

    /**
     * 90%
     */

    var timer = require('../function/timer');
    var jquerify = require('../function/jquerify');
    var lifeCycle = require('../function/lifeCycle');

    var Input = require('../helper/Input');
    var Popup = require('../helper/Popup');
    var Iterator = require('../helper/Iterator');

    /**
     * 自动补全
     *
     * @constructor
     * @param {Object} options
     * @property {jQuery} options.element 输入框元素
     * @property {jQuery} options.menu 补全菜单，菜单最好使用绝对定位，这样直接 show 出来，无需涉及定位逻辑
     *
     * @property {string=} options.itemSelector 菜单项选择器，默认是 li
     *
     * @property {number=} options.delay 长按上下键遍历的等待间隔时间，默认 60ms
     * @property {boolean=} options.includeInput 上下遍历是否包含输入框，默认包含
     * @property {boolean=} options.autoScroll 遍历时是否自动滚动，菜单出现滚动条时可开启，默认不开启
     *
     * @property {string=} options.activeClass 菜单项 active 时的 className
     *
     * @property {Object} options.show
     * @property {number=} options.show.delay 显示延时
     * @property {Function=} options.show.animation 显示动画
     *
     * @property {Object} options.hide
     * @property {number=} options.hide.delay 隐藏延时
     * @property {Function=} options.hide.animation 隐藏动画
     *
     * @property {string=} options.template 菜单模板
     * @property {Function=} options.renderTemplate 配置模板引擎的 render 方法，方法签名是 (data, tpl): string
     *
     * @property {Function} options.load 加载数据，可以是远程或本地数据
     * @argument {string} options.load.text 用户输入的文本
     * @argument {Function} options.load.callback 拉取完数据后的回调
     *
     * @property {Function=} options.onSelect 用户点击选中某个菜单项触发
     * @property {Function=} options.onEnter 用户按下回车触发
     * @property {Function=} options.onChange 当遍历导致输入框值变化时触发
     * @property {Function=} options.onBeforeRender 渲染菜单之前触发
     * @property {Function=} options.onAfterRender 渲染菜单之后触发
     */
    function AutoComplete(options) {
        return lifeCycle.init(this, options);
    }

    AutoComplete.prototype = {

        constructor: AutoComplete,

        type: 'AutoComplete',

        /**
         * 初始化
         */
        init: function () {

            var me = this;

            var menu = me.menu;
            var element = me.element;
            var activeClass = me.activeClass;

            // 当前选中数据
            var target;

            // 缓存结果
            me.cache = { };

            var iterator =
            me.iterator = new Iterator({
                element: element,
                startIndex: 0,
                minIndex: me.includeInput ? 0 : 1,
                delay: me.delay,
                onChange: function (e, data) {

                    var to = data.to;
                    var from = data.from;
                    var action = data.action;

                    target = this.data[to];

                    data = target.data;
                    var item = target.element;

                    if (me.autoScroll) {


                        if (action === 'prev') {

                            // item 在 menu 视窗区域不需要滚动
                            var min = menu.scrollTop();
                            var max = min + menu.height();

                            var top = item.prop('offsetTop');

                            if (top < min || top > max) {
                                menu.scrollTop(top);
                            }
                        }
                        else {

                            var menuHeight = menu.height();

                            // item 在 menu 视窗区域不需要滚动
                            var min = menu.scrollTop();
                            var max = min + menuHeight;

                            var top = item.prop('offsetTop') + item.outerHeight(true);

                            if (top < min || top > max) {
                                menu.scrollTop(
                                    top
                                  - menuHeight
                                );
                            }
                        }
                    }


                    item.addClass(activeClass);

                    this.data[from].element.removeClass(activeClass);

                    if (action !== 'render') {
                        element.val(
                            data.text
                        );
                    }

                    me.emit(
                        'change',
                        {
                            // 对外界使用来说，要隐藏 input 为 0 的实现
                            index: to - 1,
                            data: data
                        }
                    );

                }
            });

            me.input = new Input({
                element: element,
                smart: true,
                longPress: false,
                action: {
                    enter: function () {

                        me.close();

                        me.emit('enter', target.data);

                    }
                },
                onChange: function () {
                    suggest(me);
                }
            });

            me.popup = createPopup(me);

            var itemSelector = me.itemSelector;

            menu.on(
                'click', itemSelector, function (e) {

                    var index = $(this).data(indexKey);

                    iterator.to(index);

                    me.close();

                    me.emit(
                        'select',
                        target.data
                    );
                }
            )
            .on(
                'mouseenter', itemSelector, function (e) {

                    var index = $(this).data(indexKey);

                    if (target && index !== iterator.index) {
                        target.element.removeClass(activeClass);
                    }

                    iterator.index = index;
                }
            )
            .on(
                'mouseleave', itemSelector, function (e) {

                    iterator.to(
                        iterator.startIndex
                    );

                }
            );

        },

        /**
         * 渲染数据
         *
         * @param {Array} data
         */
        render: function (data) {

            var me = this;

            if ($.isArray(data) && data.length > 0) {

                me.emit('beforeRender');

                var menu = me.menu;
                menu.html(
                    me.renderTemplate(data, me.template)
                );

                var element = me.element;

                var list = [
                    {
                        element: element,
                        data: {
                            text: element.val()
                        }
                    }
                ];

                menu
                .find(me.itemSelector)
                .each(function (index) {

                    var item = $(this);

                    var result = item.data();
                    if (result.text == null) {
                        result.text = item.html();
                    }

                    var len =
                    list.push({
                        element: item,
                        data: result
                    });

                    item.data(indexKey, len - 1);

                });

                var iterator = me.iterator;
                iterator.setData(list);

                // 可以在 renderTemplate 时设置某一项选中
                var activeItem = menu.find('.' + me.activeClass);

                if (activeItem.length === 1) {
                    var index = activeItem.data(indexKey);
                    if ($.type(index) === 'number') {
                        iterator.to(index, 'render');
                    }
                }

                me.emit('afterRender');

                me.open();

            }
            else {
                me.close();
            }
        },

        /**
         * 显示下拉菜单
         */
        open: function () {

            var me = this;

            me.emit('beforeOpen');

            me.popup.open();

            me.emit('afterOpen');

        },

        /**
         * 隐藏下拉菜单
         */
        close: function () {

            var me = this;

            me.emit('beforeClose');

            me.popup.close();

            me.emit('afterClose');
        },

        /**
         * 销毁对象
         */
        dispose: function () {

            var me = this;

            lifeCycle.dispose(me);

            me.menu.off(namespace);

            me.input.dispose();
            me.popup.dispose();

            me.element =
            me.menu =
            me.data =
            me.items =
            me.cache = null;
        }
    };

    jquerify(AutoComplete.prototype);

    /**
     * 默认配置
     *
     * @static
     * @type {Object}
     */
    AutoComplete.defaultOptions = {
        delay: 60,
        includeInput: true,
        itemSelector: 'li',
        show: { },
        hide: { }
    };

    /**
     * jquery 事件命名空间
     *
     * @inner
     * @type {string}
     */
    var namespace = '.cobble_ui_autocomplete';

    var indexKey = '__index__';

    /**
     * 用 Popup 处理提示层的显示隐藏逻辑
     *
     * @inner
     * @param {AutoComplete} autoComplete
     * @return {Popup}
     */
    function createPopup(autoComplete) {

        var element = autoComplete.element;

        var show = autoComplete.show;
        var hide = autoComplete.hide;

        if (!show.trigger) {
            show.trigger = 'focus';
        }
        if (!hide.trigger) {
            hide.trigger = 'click';
        }

        var animation = show.animation;
        if ($.isFunction(animation)) {
            show.animation = $.proxy(animation, autoComplete);
        }

        animation = hide.animation;
        if ($.isFunction(animation)) {
            hide.animation = $.proxy(animation, autoComplete);
        }

        return new Popup({
            element: element,
            layer: autoComplete.menu,
            show: show,
            hide: hide,
            onBeforeShow: function (e) {
                // 通过元素 focus 触发
                if ('eventPhase' in e) {
                    suggest(autoComplete);
                    return false;
                }
            },
            onBeforeHide: function (e) {

                var result;

                // 点击 input 不触发失焦隐藏
                if ('eventPhase' in e) {
                    result = e.target !== element[0];
                }

                if (result) {
                    autoComplete.iterator.stop();
                }

                return result;
            }
        });
    }

    /**
     * 触发 autoComplete
     *
     * @inner
     * @param {AutoComplete} autoComplete
     */
    function suggest(autoComplete) {

        var cache = autoComplete.cache;
        var query = $.trim(autoComplete.element.val());
        var data = cache[query];

        if (data) {
            autoComplete.render(data);
        }
        else {
            autoComplete.load(
                query,
                function (data) {
                    cache[query] = data;
                    autoComplete.render(data);
                }
            );
        }
    }


    return AutoComplete;

});
