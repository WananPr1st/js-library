define(function (require) {
    var config = require('./config');
    var util = {
	    // 获取拒绝原因配置项
	    getRefuseReasonConfig: function (type, refuseType) {
	        var refuseConfig = config.COMMON_REFUSE_REASON;
	        if (config.REFUSE_REASON_OTHER_TYPE[refuseType]) {
	            // 个性化
	            refuseConfig = config.REFUSE_REASON_OTHER_TYPE[refuseType];
	        } else if ($.inArray(refuseType, config.REFUSE_REASON_1_TYPE) > -1) {
	            // 类型1
	            refuseConfig = config.COMMON_REFUSE_REASON_1;
	        } else if (type === config.ORDER_TYPE.PIC) {
	            // 图片
	            refuseConfig = config.COMMON_PICTURE_REFUSE_REASONE;
	        }

	        return refuseConfig;
	    },
		/**
         * 转换拒绝原因
         *
         * @param  {number} type  订单类型：
         *     0: 文字；1: 图片；2: 视频 老师视频3: 机构申请
         *     4: 机构主页5: 班课6: 视频课7: 机构视频
         * @param  {number} auditType    审核类型
         * // 文字信息
		​​ *   100: '基本信息',
		 *   200: '背景资料',
		 *   300: '过往经历',
		 *   400: '成果分享',
		 *   500: '授课科目',
		 *   1000: '课时优惠包',
		 *   600: '其他信息',
		 *   4000: '可授课时间'
		 *   // 图片审核类型：
		 *   1100: '头像',
		 *   700: '我的照片',
		 *   800: '身份认证', // 包括身份证和护照
		 *   1200: '学历认证',
		 *   1300: '专业资质认证',
		 *   1400: '教师证认证',
		 *   // 视频审核类型：
		 *   900: '老师视频',
		 *   3400: '机构视频'
		 *   3000: '机构申请',
		 *   3100: '机构主页',
		 *   1500: '班课'
		 *   1700: '视频课'
         * @param  {Array<Object>} refuseReason [description]
         * @return {Array<Object>}              [description]
         *         {Object.title}              标题
         *         {Object.content}            内容
         *         {Object.subs}               下级，结构和上面一样
         */
        getRefuseReason: function(type, auditType, sectionType, refuseReason, videoSections) {
            var result = [];
            var section = config.ORDER_REFUSE_TYPE[sectionType] || config.ORDER_REFUSE_TYPE[auditType];
            var sectionObj = {};
            if (Array.isArray(section) && section.length) {
                section.forEach(function (type) {
                    sectionObj[type.code] = type.title;
                });
            }
            if (Array.isArray(refuseReason) && refuseReason.length) {
                refuseReason.forEach(function (item) {
                    if (+item.section === config.VIDEO_COURSE_SECTION_TYPE && item.children && item.children.length) {
                        // 视频章节
                        var subs = [];
                        result.push({
                            title: '视频课节',
                            subs: subs
                        });
                        if (Array.isArray(item.children) && item.children.length) {
                            item.children.forEach(function (child) {
                                var sectionSubs = [];
                                subs.push({
                                    title: '[第' + (videoSections && videoSections.indexOf(child.section) + 1) + '节]',
                                    subs: sectionSubs
                                });
                                if (child.title) {
                                    var videoTitle = [];
                                    sectionSubs.push({
                                        title: '视频标题',
                                        subs: videoTitle
                                    });
                                    getRefuseReason(type, auditType, sectionType, 1711, child.title, videoTitle);
                                }
                                if (child.content) {
                                    var videoContent = [];
                                    sectionSubs.push({
                                        title: '视频内容',
                                        subs: videoContent
                                    });
                                    getRefuseReason(type, auditType, sectionType, 1712, child.content, videoContent);
                                }
                            });
                        }
                    }
                    else if (item.reason) {
                        var commonSubs = [];
                        if (item.section) {
                            result.push({
                                title: sectionObj[item.section],
                                subs: commonSubs
                            });
                        }
                        getRefuseReason(
                            type, auditType, sectionType,
                            item.section, item,
                            item.section ? commonSubs : result
                        );
                    }
                });
            }

            return result;
        }
	};

    function getRefuseReason(type, auditType, sectionType, section, item, result) {
        var refuseConfig = util.getRefuseReasonConfig(type, section || sectionType || auditType);
        var reasons = item.reason.split('');
        // 加补齐逻辑 zhanwentao
        //completeResonItemReason(reasons, refuseConfig);
        var lastIndex = refuseConfig.length;
        for (var i = reasons.length, reason; (reason = reasons[--i]);) {
            lastIndex--;
            if (reason === '1') {
                // 其他
                if (i === reasons.length - 1) {
                    result.unshift({
                        title: '[' + refuseConfig[lastIndex] + ']',
                        content: item.content
                    });
                } else {
                    result.unshift({
                        content: refuseConfig[lastIndex]
                    });
                }
            }
        }
    }

    /**
     * 
     * 当返回的拒绝原因条数比真实条数少的时候，前后端约定，
     * 前面的不变，倒数第二条之前补零至和config配置条数一样
     * 将item中话术补齐
     * 
     * @param  {Array} reasons 后端返回拒绝原因数组，由0，1组成，其中0表示未选中，1表示选中
     * @param  {Array} refuseConfig  配置原因中前端配置话术数组 
     * 
     */
    function completeResonItemReason(reasons, refuseConfig) {
        var configLength = refuseConfig.length;
        var reasonLength = reasons.length;
        var length = configLength - reasonLength;
        if (length) {
            var temp = [];
            for (var i = 0; i < length; i++) {
                reasons.splice(reasonLength - 1, 0, '0');
            }
        }
    }

	return util;
});