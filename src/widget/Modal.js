/*
 * @file modal.js
 *
 * 对原有modal的封装
 * @author hanrui(hanrui@baijiahulian.com)
 */
define(function (require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var tpl = require('text!./modal/index.html');

    function noop() {}

    require('jModal');

    var OPTIONS = {
        title: '提示', // modal头部内容
        content: '<div style="text-align:center;">加载中，请稍候...</div>', // modal内容区
        type: 'modal', // 设置modal类型，只有confirm与alert特殊处理
        size: '',
        onClose: noop,
        onOk: noop,
        onCancle: noop
    };

    /**
     * Modal工厂，根据配置返回modal实例
     * @param {Object} config Modal配置
     */
    function Modal(config) {
        var me = this;
        config = $.extend(true, {}, OPTIONS, config);

        var oldOnClose = config.onClose;
        if (!config.id) {
            config.id = 'modal' + (new Date()).valueOf();
        }

        // 根据配置生成modal插入dom
        // 这里把underscore模板写两次是因为config不是纯数据源
        // 直接_.template(tpl,data)会报错
        var modalCompiled = _.template(tpl);
        var modalTpl = modalCompiled(config);
        modalCompiled = null;

        if ($('#' + config.id).length) {
            me._config = config;
            me.modal = $('#' + config.id);
            // hanrui 已存在重新设置title和content
            me.setContent(config.content);
            if (config.title) {
                me.setTitle(config.title);
            }
        } else {
            me._config = config;
            me.modal = $(modalTpl);
        }

        if (config.type === 'confirm') {
            me.modal.on('click', '[data-callback="cancle"]', config.onCancle);
            me.modal.on('click', '[data-callback="ok"]', config.onOk);
        }

        if (config.type === 'alert') {
            config.onClose = function() {
                me.dispose();
                oldOnClose();
            };
        }

        $('body').append(me.modal);
        me.modal.modal({
            show: false,
            backdrop: config.backdrop === false ? false : true
        });
        me.modal.on('hidden.bs.modal', config.onClose);
    }

    /**
     * modal显示
     */
    Modal.prototype.show = function() {
        this.modal.modal('show');
    };

    /**
     * modal隐藏
     */
    Modal.prototype.hide = function() {
        this.modal.modal('hide');
    };

    /**
     * 设置modal内容
     */
    Modal.prototype.setContent = function(content) {
        this.modal.find('.modal-body').html(content);
    };

    /**
     * 设置modal头部
     */
    Modal.prototype.setTitle = function(title) {
        this.modal.find('.modal-title').html(title);
    };

    /**
     * 销毁modal
     */
    Modal.prototype.dispose = function() {
        var me = this;
        if(!me.modal.is(':visible')){
            me.modal.remove();
            me.modal = null;
            return;
        }
        // old hanrui 2015/8/25 
        // 修改内容：
        // 统一id多次dispose抛脚本异常原因
        // 原因：
        //  me.modal.modal('hide')中会trigger触发hidden.bs.modal
        //  代码先后顺序导致后一次dispose执行了上一次的方式，导致me.modal为null
        //  导致me.modal.modal('hide');之后代码继续使用me.modal抛异常
        // me.modal.modal('hide');
        // me.modal.on('hidden.bs.modal',function(){
        //     if (me.modal) {
        //         me.modal.remove();
        //         me.modal = null;
        //     }
        // });
        me.modal.on('hidden.bs.modal',function(){
            if (me.modal) {
                me.modal.remove();
                me.modal = null;
            }
        });
        me.modal.modal('hide');
    };

    return Modal;
});