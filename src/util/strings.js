/**
 * @file This file defines the util functions related to string.
 *
 * @author: Yangji (yangji01@baidu.com)
 * Date: 2013-10-22
 */

define(function (require) {
    var strings = {};

    /**
     * Escapes the html chars to safe characters, include & " < >
     * @param {?string} str
     *
     * @return {string} Escaped string
     */
    strings.escapeHTML = function (str) {
        return ('' + str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };

    /**
     * Reverses escapeHTML
     * @param {?string} str
     *
     * @return {string} unescaped string
     */
    strings.unescapeHTML = function (str) {
        return ('' + str).replace(/&lt;/g, '<').replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&').replace(/&quot;/g, '"');
    };

    /**
     * Escapes quote
     * @param {string} str
     *
     * @return {string} escaped string
     */
    strings.escapeQuote = function (str) {
        return str.replace(/'/g, '&#39;').replace(/"/g, '&quot;');
    };

    /**
     * Gets string length(full-width),1 chinese character's length is 2.
     * @param {string} str
     *
     * @return {number} string's length
     */
    strings.getLength = function (str) {
        var len = str.length;
        str.replace(/[\u0080-\ufff0]/g, function () { len++; });
        return len;
    };

    /**
     * Gets subString(full-width), could not return half of chinese character.
     * @param {string} str
     * @param {number} len  subString length
     *
     * @return {string} subString
     */
    strings.subString = function (str, len) {
        while (strings.getLength(str) > len) {
            str = str.substr(0, str.length - 1);
        }
        return str;
    };

    /**
     * Cut long string(full-width), add a tail.
     * @param {string} str
     * @param {number} len  allowed length
     * @param {string=} tailStr  tail string, .. is default
     *
     * @return {string} cut string
     */
    strings.getCutString = function (str, len, tailStr) {
        var tmp = strings.unescapeHTML(str);
        if (typeof tailStr == 'undefined') {
            tailStr = '..';
        }
        if (strings.getLength(tmp) > len) {
            return strings.escapeHTML(strings.subString(tmp, len)) + tailStr;
        } else {
            return strings.escapeHTML(tmp);
        }
    };

    /**
     * Adds slashes after quote.
     * @param {string} str
     *
     * @return {string} final string
     */
    strings.addSlashes = function (str) {
        return str.replace(/'/g, '\\\\\'').replace(/"/g, '\\\\\"');
    };

    /**
     * id for a span to calculate string width.
     * @const
     * @private
     */
    var _SPAN_ID = 'string-hidden-span';

    /**
     * Gets string display width in browser.
     * @param {string} str
     * @param {Object} style
     *
     * @return string width
     */
    strings.getDisplayWidth = function (str, style) {
        var tmp = strings.escapeHTML(str);
        style = style || {};
        var span = $('#' + _SPAN_ID);

        if (!span.length) {
            span = $('<span>').attr('id', _SPAN_ID);
            $('<div>').css({
                position: 'absolute',
                left: '-10000px',
                top: '-10000px'
            })
                .append(span)
                .appendTo(document.body);
        }
        span.attr('style', '').css(style).html(tmp);

        return span.width();
    };

    /**
     * Cut too wide string and adds a tail string.
     * @param {string} str
     * @param {number} width
     * @param {string=} tailStr  tail string, default ..
     * @param {Object=} style
     *
     * @return {string} cut string
     */
    strings.cutStringByWidth = function (str, width, tailStr, style) {
        var tmp = strings.unescapeHTML(str);
        tailStr = tailStr || '..';
        style = style || {};
        var tempStr = tmp;
        var tempWidth = 0;
        var START = 0;
        var TOOLONG = 1;
        var DONE = 2;
        var flag = START;

        while (1) {
            tempWidth = strings.getDisplayWidth(tempStr, style);
            if (tempWidth > width && flag == START) {
                flag = TOOLONG;
                tempStr = tmp.substring(0,
                    Math.ceil(width / tempWidth * tmp.length));
            } else if (tempWidth > width && flag != START) {
                tempStr = tmp.substring(0, tempStr.length - 1);
                flag = DONE;
            } else if (tempWidth <= width && flag == START) {
                return strings.escapeHTML(tmp);
            } else if (tempWidth <= width && flag == TOOLONG) {
                tempStr = tmp.substring(0, tempStr.length + 1);
            } else {
                return strings.escapeHTML(tempStr) + tailStr;
            }
        }
    };

    /**
     * Inserts wbr element.
     * @param {string} str
     *
     * @return {string} final string
     */
    strings.insertWbr = function (str) {
        return (str + '')
            .replace(/(?:<[^>]+>)|(?:&[0-9a-z]{2,6};)|(.{1})/g, '$&<wbr>')
            .replace(/><wbr>/g, '>');
    };

    /**
     * Gets words from string,words are splited by \n.
     * @param {string} str
     *
     * @return {Array.<string>} words
     */
    strings.getWordsFromString = function (str) {
        str = str.replace(/\r/g, '');
        var words = str.split('\n');
        $.each(words, function (index, item) {
            words[index] = $.trim(item);
        });
        // the params sequence of $.grep's callback is different
        // do unique here rather than use $.unique which designed for dom
        $.grep(words, function (item, index) {
            return item !== '' && index == $.inArray(item, words);
        });
        return words;
    };

    /**
     * Changes first character to upper case.
     * @param {string} str
     *
     * @return {string} final string
     */
    strings.upperCaseFirstChar = function (str) {
        return str.slice(0, 1).toUpperCase() + str.slice(1);
    };

    return strings;
});
