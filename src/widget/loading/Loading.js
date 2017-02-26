define(function () {
    /**
     * 显示
     * @param  {?Object} options 参数设置
     * @param  {Object|string} options.elem
     *         dom元素或者dom选择器，一个elem只能有一个实例
     *         class: 例如：'.loading'
     *         id: 例如：'#loading'
     * @param  {number} options.zIndex 设置zIndex, 默认1060
     * @param  {boolean} options.isShowMask 是否隐藏背景遮挡层，默认隐藏
     */
	function Loading(options) {
        options = options || {};
        if (options.elem + '' === options.elem) {
            options.elem = $(options.elem);
        }
        if (options.elem) {
            options.isAppendBody = false;
        }
		this.options = $.extend({}, defaultOptions, options);
		render(this.options);
	}

    var defaultOptions = {
        elem: $('body'),
        zIndex: 1060,
        isHideMask: true,
        isAppendBody: true
    };

	Loading.prototype = {
		// 显示
        show: function () {
            this.options.loading.show();
        },
        // 隐藏
        hide: function () {
            this.options.loading.hide();
        },
        // 重新渲染
        resize: function () {
            render(this.options);
        },
        // 析构函数
        destroy: function () {
            this.options.loading.remove();
            this.options.loading = null;
            delete this.options.loading;
            this.options = null;
            delete this.options;
        }
	};

	function render(options) {
        if (options.elem.children('.app-loading').length) {
            // 只渲染一次
            options.loading = options.elem.children('.app-loading');
            return;
        }

        var loadingDom =  $(''
            + '<div id="loading" class="app-loading">'
            +   '<div class="spinner">'
            +       '<div class="bounce1"></div>'
            +       '<div class="bounce2"></div>'
            +       '<div class="bounce3"></div>'
            +   '</div>'
            + '</div>'
        );
        // var spinner = loadingDom.children('.spinner');
        // 位置
        var position = 'fixed';
        if (!options.isAppendBody) {
            options.elem.css({
                position: 'relative'
            });
            position = 'absolute';
            // spinner.css({
            //     margin: '20% auto 0'
            // });
        }
        var cssObj = {
            position: position,
            zIndex: options.zIndex + 1
        };
        if (options.isShowMask) {
            cssObj.backgroundColor = 'rgba(172, 172, 172, 0.5)';
            // cssObj.opacity = 0.5;
        }
        loadingDom.css(cssObj);

        options.loading = loadingDom;
        options.elem.append(loadingDom);
    }

	return Loading;
});