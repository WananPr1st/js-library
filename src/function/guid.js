/**
 * @file Provide the guid util to generate a guid string.
 *
 * @author wanekemiao@baidu.com (Kemiao Wang)
 * @author chenlijie@baidu.com (Lijie Chen)
 */

define(function (require) {

    /**
     * Generates a random GUID legal string of the given length.
     */
    function rand16Num(len) {
        len = len || 0;
        var result = [];
        for (var i = 0; i < len; i++) {
            result.push('0123456789abcdef'.charAt(
                Math.floor(Math.random() * 16))
            );
        }
        return result.join('');
    }

    /**
     * 生成一个唯一的guid，且格式符合guid规范
     * GUID 的格式为“xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx”
     * 其中每个 x 是 0-9 或 a-f 范围内的一个32位十六进制数
     * 第四版的GUID使用了新的算法，其产生的数字是一个伪随机数。
     * 它生成的GUID的第三组数字的第一位是4
     */
    return function() {
        var curr = (new Date()).valueOf().toString();
        return ['4b534c46',  // Fixed first group.
                rand16Num(4),
                '4' + rand16Num(3),  // The first character of 3rd group is '4'.
                rand16Num(4),
                curr.substring(0, 12)].join('-');
    }
});
