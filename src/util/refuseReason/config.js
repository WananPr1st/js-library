define(function () {
    'use strict';

    var config = {
        // 订单类型
        ORDER_TYPE: {
            WORD: 0,
            PIC: 1,
            VIDEO: 2,
            ORG: 3,
            ORG_HOME: 4,
            CLASS_COURSE: 5,
            VIDEO_COURSE: 6,
            ORG_VIDEO: 7,
            QUESTION: 8
        },
        // 视频课节
        VIDEO_COURSE_SECTION_TYPE: 1710,
        // 审核类型
        AUDIT_TYPES: {
            // 我的照片
            MY_PHONE: 700,
            // 授课科目
            SUBJECTS: 500,
            // 身份证
            ID_CARD: 800,
            // 老师视频
            TEACHER_VIDEO: 900,
            // 视频课
            VIDEO_COURSE: 1700,
            // 机构申请
            ORG_APPLY: 3000
        },
        // 拒绝原因分类，包括：班课、视频课、身份认证
        REFUSE_CLASS: [5, 6, 800, 1621],
        // 通用拒绝原因
        //COMMON_REFUSE_REASON: ['请不要放置QQ、微信、二维码、个人手机号、具体上课地址等联系方式哦，谢谢~', '涉及版权、色情、政治等问题', '其他'],
        COMMON_REFUSE_REASON: [
        '涉及暴力,色情,政治等内容',
        '垃圾广告',
        '无效内容（文不对题,无效问题等',
        '其他'],
        // 图片通用拒绝原因
        COMMON_PICTURE_REFUSE_REASONE: ['小编实在看不清楚', '与身份证信息不一致哦', '证件信息拍摄不完整', '涉及版权、色情、政治等问题', '不是相关证件照片', '其他'],
        // 类型1对应的审核类型
        REFUSE_REASON_1_TYPE: [200, 4030, 4040],
        // 班课拒绝分类
        ORDER_CLASS_COURSE_REFUSE_CLASS: [{
            code: 1510,
            title: '课程信息'
        }, {
            code: 1520,
            title: '课程照片'
        }, {
            code: 1530,
            title: '课程简介'
        }, {
            code: 1540,
            title: '教学计划'
        }],
        // 身份证审核的身份证拒绝原因分类
        ORDER_ID_CARD_ID_REFUSE_CLASS: [{
            code: 810,
            title: '手持身份照片'
        }, {
            code: 820,
            title: '身份证正面'
        }],
        // 身份证审核的身份证拒绝原因分类
        ORDER_ID_CARD_PASSPORT_REFUSE_CLASS: [{
            code: 840,
            title: '手持护照照片'
        }, {
            code: 850,
            title: '护照信息页'
        }, {
            code: 860,
            title: '护照签证页'
        }],
        // 视频课拒绝分类
        ORDER_VIDEO_COURSE_REFUSE_CLASS: [{
            code: 1701,
            title: '课程封面'
        }, {
            code: 1702,
            title: '课程标题'
        }, {
            code: 1703,
            title: '课程价格'
        }, {
            code: 1704,
            title: '观看期限'
        }, {
            code: 1705,
            title: '课程简介'
        }, {
            code: 1706,
            title: '课程分类'
        }, {
            code: 1707,
            title: '课程语言'
        }, {
            code: 1708,
            title: '课程标签'
        }, {
            code: 1709,
            title: '课程详情'
        }],
        // 视频课课件拒绝分类
        ORDER_VIDEO_COURSE_SECTION_REFUSE_CLASS: [{
            code: 1711,
            title: '视频标题'
        }, {
            code: 1712,
            title: '视频内容'
        }],
        // 机构X课课型拒绝分类
        ORDER_ORG_XCOURSE_TYPE_REFUSE_CLASS: [{
            code: 1630,
            title: '课程名称'
        }, {
            code: 1631,
            title: '课程主图'
        }, {
            code: 1632,
            title: '课程介绍视频'
        }, {
            code: 1633,
            title: '课程详情'
        }]
    };
    // 类型1的拒绝原因
    // '可能涉及推广信息（广告、联系方式、网址链接等）', '涉及版权、色情、政治等问题', '内容跑题啦', '其他'
    config.COMMON_REFUSE_REASON_1 = config.COMMON_REFUSE_REASON.slice(0);
    config.COMMON_REFUSE_REASON_1.splice(2, 0, '内容跑题啦');
    // 个性化拒绝原因配置项
    config.REFUSE_REASON_OTHER_TYPE = {
        '-1': ['其他'],
        // 头像
        1100: ['请上传老师自己个人的头像靓照哦~', '头像最好为清晰完整正面照啦，至少露出肩部及以上哦，谢谢', '请注意衣冠整齐哦，谢谢', '头像不必手持身份证件哦', '头像拍摄不完整', '请不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢~', '涉及版权、色情、政治等问题', '还不够清晰呀', '和身份证件不一致', '其他'],
        // 身份认证
        801: ['证件信息不清晰，请再单独上传一张身份证照片哦', '身份证件不要遮挡住您的面部五官哦', '证件照片实在太不清晰了', '没有手持身份证件哦', '证件信息拍摄不完整', '有部分信息不小心被遮挡了', '小编目测您不是身份证持有人哦', '不是相关证件照片', '与填写的姓名和证件号不一致', '其他'],
        // 护照
        802: ['证件信息不清晰，请再单独上传一张护照照片哦', '护照证件不要遮挡住您的面部五官哦', '护照照片实在太不清晰了', '没有手持护照哦', '证件信息拍摄不完整', '有部分信息不小心被遮挡了', '小编目测您不是护照持有人哦', '不是相关证件照片', '与填写的姓名和证件号不一致', '其他'],
        // 工作室
        3010: [
            '营业执照：小编发现机构经营范围不符合平台规定哦~ ',
            '没有手持身份证件拍摄',
            '身份证件不要遮挡住身份证号码哦',
            '公司全称：涉及版权、色情、政治等问题',
            '机构名称：(已废弃)涉及版权、色情、政治等问题',
            '联系人姓名：涉及版权、色情、政治等问题',
            '身份证：小编实在看不清楚',
            '身份证：证件信息拍摄不完整',
            '身份证：不要遮挡住你的面部五官哦',
            '身份证：与填写的姓名和证件号不一致',
            '身份证：不是相关证件照片',
            '其他'
        ],
        // 企业
        3020: [
            '营业执照：小编发现机构经营范围不符合平台规定哦~ ',
            '所填机构名称与证件信息不一致哦',
            '公司全称：涉及版权、色情、政治等问题',
            '机构名称：(已废弃)涉及版权、色情、政治等问题',
            '营业执照：小编实在看不清楚',
            '营业执照：证件信息拍摄不完整',
            '营业执照：证件号与证件不一致哦',
            '营业执照：不是相关证件照片',
            '其他'
        ],
        // 学校
        3030: [
            '营业执照：小编发现机构经营范围不符合平台规定哦~ ',
            '所填机构名称与证件信息不一致哦',
            '公司全称：涉及版权、色情、政治等问题',
            '机构名称：(已废弃)涉及版权、色情、政治等问题',
            '办学许可证：小编实在看不清楚',
            '办学许可证：证件信息拍摄不完整',
            '办学许可证：证件号与证件不一致哦',
            '办学许可证：不是相关证件照片',
            '其他'
        ],
        // 真实姓名
        101: ['不像是真实姓名', '请不要放置QQ、微信、二维码、个人手机号、具体上课地址等联系方式哦，谢谢~', '涉及版权、色情、政治等问题', '其他'],
        // 昵称
        102: ['请填写更为适合教师身份的昵称', '请不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢~', '涉及版权、色情、政治等问题', '其他'],
        // 基本信息：一句话简介
        103: ['请不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢~', '涉及版权、色情、政治等问题', '内容跑题啦', '其他'],
        // 基本信息：毕业院校
        104: ['请填写完整的毕业院校名称哦~', '请不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢~', '涉及版权、色情、政治等问题', '内容跑题啦', '其他'],
        // 所学专业
        105: ['内容跑题啦', '请不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢~', '涉及版权、色情、政治等问题', '其他'],
        // 具体位置
        106: ['请不要放置QQ、微信、二维码、个人手机号、具体上课地址等联系方式哦，谢谢~', '涉及版权、色情、政治等问题', '内容跑题啦', '其他'],
        // 基本信息-个性域名
        107: ['请不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢~', '涉及版权、色情、政治等问题', '其他'],
        // 基本信息-可上门授课范围
        108: ['请不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢~', '涉及版权、色情、政治等问题', '内容跑题啦', '其他'],
        // 基本信息-老师介绍
        109: ['请不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢~', '涉及版权、色情、政治等问题', '内容跑题啦', '其他'],
        // 背景资料-单位机构学校
        201: ['请不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢~', '涉及版权、色情、政治等问题', '内容跑题啦', '其他'],
        // 背景资料-教学特点
        202: ['请不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢~', '涉及版权、色情、政治等问题', '内容跑题啦', '其他'],
        // 教龄
        203: ['教龄偏长，与老师实际年龄不相符哦，修改一下吧！', '请不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢~', '涉及版权、色情、政治等问题', '内容跑题啦', '其他'],
        // 课时优惠包
        204: [
            '您填写的信息，不要放置QQ、微信、手机号等联系方式哦，请删除后重新填写，谢谢~', 
            '您填写的内容可能涉及版权、色情、政治等敏感信息，请重新填写，谢谢~', 
            '您填写的内容与实际情况差距较大哦，快根据实际情况给出确切的描述吧，谢谢~', 
            '其它'
        ],
        1000: ['内容跑题啦', '请不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢~', '涉及版权、色情、政治等问题', '其他'],
        // 工作单位认证
        1800: ['小编实在看不清楚', '与身份证信息不一致哦', '证件信息拍摄不完整', '涉及版权、色情、政治等问题', '不是相关证件照片', '其他'],
        // 机构主页-机构相册
        3201: ['请不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢', '图片不够清晰哦', '不要放外部链接', '请将联系方式放在指定的位置', '涉及版权、色情、政治等问题', '内容跑题啦', '其他'],
        // 机构主页-机构Logo
        3202: ['请上传机构LOGO哦，这张图片看起来不像是LOGO图片呢~', '不要放外部链接', '请将联系方式放在指定的位置', '涉及版权、色情、政治等问题', '内容跑题啦', '其他'],
        // 机构主页-焦点图
        3203: ['图片尺寸有点大，快重新调整一下吧~', '请不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢', '图片不够清晰哦', '不要放外部链接', '请将联系方式放在指定的位置', '涉及版权、色情、政治等问题', '内容跑题啦', '其他'],
        3108: ['请不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢', '涉及版权、色情、政治等问题', '垃圾广告', '内容跑题啦', '其他'],
        // 机构主页-自定义区
        3302: ['图片尺寸有点大，快重新调整一下吧~', '请不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢', '不要放外部链接', '请将联系方式放在指定的位置', '涉及版权、色情、政治等问题', '内容跑题啦', '其他'],
        // 机构主页-机构简介
        3301: ['图片尺寸有点大，快重新调整一下吧~', '请不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢', '不要放外部链接', '请将联系方式放在指定的位置', '涉及版权、色情、政治等问题', '内容跑题啦', '其他'],
        // 机构主页-一句话简介
        3101: ['不要放外部链接', '请将联系方式放在指定的位置', '涉及版权、色情、政治等问题', '内容跑题啦', '其他'],
        // 机构主页-特色标签
        3102: ['请不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢', '不要放外部链接', '请将联系方式放在指定的位置', '涉及版权、色情、政治等问题', '内容跑题啦', '其他'],
        // 机构主页-个性域名
        3104: ['不要放外部链接', '请将联系方式放在指定的位置', '涉及版权、色情、政治等问题', '其他'],
        // 机构主页-校区
        3105: ['请不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢', '不要放外部链接', '请将联系方式放在指定的位置', '涉及版权、色情、政治等问题', '内容跑题啦', '其他'],
        // 老师视频
        900: ['视频时长太短啦！上传一个内容丰富一点的吧~', '视频与老师授课科目不相关哦', '视频不够清晰流畅哦', '机构视频请上传至机构主页', '请不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢~', '涉及版权、色情、政治等问题', '其他'],
        // 机构视频
        3400: ['视频时长太短啦！上传一个内容丰富一点的吧~', '请不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢~', '涉及版权、色情、政治等问题', '其他'],
        // 可授课时间
        2600: ['请不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢~', '涉及版权、色情、政治等问题', '内容跑题啦', '其他'],
        // 课程信息
        1510: ['课程标题跑题啦~', '课时费设置较同行业偏高，请酌情修改，谢谢', '请不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢~', '涉及版权、色情、政治等问题', '其他'],
        // 课程照片
        1520: ['照片与课程内容不相关哦~', '请不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢~', '涉及版权、色情、政治等问题', '其他'],
        // 课程简介
        1530: ['请不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢~', '涉及版权、色情、政治等问题', '内容跑题啦', '其他'],
        // 教学计划
        1540: ['请不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢', '上课时间段设置不太合理哦，线上课早8点至晚23点，线下课早8点至晚22点，一天上课总时长不超过8小时，一个时间段不能超过4小时，请修改一下吧！', '课程安排与教学计划不太相符哦，修改一下吧！', '可能涉及推广信息（广告、联系方式、网址链接等）', '涉及版权、色情、政治等问题', '内容跑题啦', '其他'],
        // 视频课-课程封面
        1701: ['请不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢', '涉及版权、色情、政治等问题', '内容跑题啦', '其他'],
        // 视频课-课程标题
        1702: ['请不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢', '涉及版权、色情、政治等问题', '内容跑题啦', '其他'],
        // 视频课-课程价格
        1703: ['课时费设置较同行业偏高，请酌情修改，谢谢', '其他'],
        // 视频课-观看期限
        1704: ['其他'],
        // 视频课-课程简介
        1705: ['请不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢', '涉及版权、色情、政治等问题', '内容跑题啦', '其他'],
        // 视频课-课程分类
        1706: ['课程分类与课程内容不符', '其他'],
        // 视频课-课程语言
        1707: ['课程语言与课程内容不符', '其他'],
        // 视频课-课程标签
        1708: ['请不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢', '涉及版权、色情、政治等问题', '内容跑题啦', '其他'],
        // 视频课-课程详情
        1709: ['小编发现视频并非老师本人，请写明主讲老师的详情资料哦，谢谢~', '请不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢', '涉及版权、色情、政治等问题', '内容跑题啦', '其他'],
        // 视频课-标题
        1711: ['标题内容跑题啦~', '请不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢', '涉及版权、色情、政治等问题', '其他'],
        // 视频课-内容
        1712: ['小编发现课程并不是老师本人所讲，快修改一下吧~', '请不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢', '涉及版权、色情、政治等问题', '其他'],
        // 过往经历
        300: ['请按老师的实际情况填写过往经历哦~', '请注意合理使用标点符号哦~', '请按老师实际情况填写教学经历哦，小编发现您的过往经历跟其他老师一致呢~', '过往经历与老师授课科目不太相关哦，把您所授科目对应的经历展示出来更容易吸引学生哦', '请不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢~', '涉及版权、色情、政治等问题', '内容跑题啦', '其他'],
        // 成果分享
        400: ['小编发现您填写的内容并不太适合做成果分享呢，请填写您的教学成果哦~', '请注意合理使用标点符号哦~', '成果分享与老师授课科目太不相关呢', '老师的成果分享与过往经历填写重复了哦，修改一下吧！', '请按老师实际情况填写成果分享哦，小编发现您的成果分享跟其他老师一致呢~', '请不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢~', '涉及版权、色情、政治等问题', '内容跑题啦', '其他'],
        // 授课科目
        500: ['请填写详细的授课科目哦，便于学生跟您约课~', '课时费较同行业老师设置的有点高哦，请修改一下吧！', '自定义科目在科目分类中不相符哦', '专业背景介绍跑题啦~', '课程标题跑题啦~', '请不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢~', '涉及版权、色情、政治等问题', '其他'],
        // 更多详情
        600: ['请不要放置QQ、微信、二维码、个人手机号、具体上课地址等联系方式哦，谢谢~', '涉及版权、色情、政治等问题', '内容跑题啦', '其他'],
        // 我的照片
        700: ['请不要把身份证信息上传到照片里哦~', '图片跟老师授课科目不相关哦', '图片不清晰哦', '请不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢~', '涉及版权、色情、政治等问题', '其他'],
        // 身份证审核-手持身份证照片
        810: ['证件信息不清晰，请再单独上传一张身份证照片哦', '身份证件不要遮挡住您的面部五官哦', '证件照片实在太不清晰了', '没有手持身份证件哦', '证件信息拍摄不完整', '有部分信息不小心被遮挡了', '小编目测您不是身份证持有人哦', '不是相关证件照片', '与填写的姓名和证件号不一致', '其他'],
        // 身份证审核-身份证正面
        820: ['与填写的姓名和证件号不一致', '证件看不清楚哦，再拍一张高清的吧', '不是相关证件哦', '证件信息拍摄不完整', '其他'],
        // 身份证审核-手持护照照片
        840: ['证件信息不清晰，请再单独上传一张护照照片哦', '护照证件不要遮挡住您的面部五官哦', '护照照片实在太不清晰了', '没有手持护照哦', '证件信息拍摄不完整', '有部分信息不小心被遮挡了', '小编目测您不是护照持有人哦', '不是相关证件照片', '与填写的姓名和证件号不一致', '其他'],
        // 身份证审核-护照信息页
        850: ['与填写的姓名和证件号不一致', '证件看不清楚哦，再拍一张高清的吧', '不是相关证件哦', '证件信息拍摄不完整', '其他'],
        // 身份证审核-护照签证页
        860: ['证件已经过期啦', '证件看不清楚哦，再拍一张高清的吧', '不是相关证件哦', '证件信息拍摄不完整', '其他'],
        // 问答-问题
        1611: ['涉及暴力、色情、政治等问题', '垃圾广告', '无效内容（无效问题、文不对题等）', '其他'],
        // 问答-回答
        1612: ['涉及暴力、色情、政治等问题', '垃圾广告', '无效内容（无效问题、文不对题等）', '其他'],
        // 问答-评论
        1613: ['涉及暴力、色情、政治等问题', '垃圾广告', '无效内容（无效问题、文不对题等）', '其他'],
        // 课型
        1622: ['您填写的课型标题与所属课程标题有点不匹配哦，请重新描述下吧，谢谢~',
               '您填写的信息，不要放置QQ、微信、手机号等联系方式哦，请删除后重新填写，谢谢~',
               '您填写的内容可能涉及侵权、色情、政治等敏感信息，请重新填写，谢谢~',
               '其他'],
        // 课程-课程名称
        1630: ['您填写的课程名称有些模糊哦，请重新描述标题吧，谢谢~',
               '您填写的信息，不要放置QQ、微信、手机号等联系方式哦，请删除后重新填写，谢谢~',
               '您填写的内容可能涉及版权、色情、政治等敏感信息，请重新填写，谢谢~',
               '其他'],
        // 课程-课程主图
        1631: ['您上传的图片与课程内容不太相符哦，请检查后重新上传更贴切的图片吧，谢谢~',
               '请不要上传含有QQ、微信、二维码、手机号、具体地址等联系方式的照片哦，删除后重新上传吧，谢谢~',
               '您上传的图片可能涉及版权、色情、政治等敏感信息，请重新上传，谢谢~',
               '其他'],
        // 课程-课程介绍视频
        1632: ['您上传的视频内容和教学不太相关哦，请重新上传更合适的视频吧，谢谢~',
               '您上传的视频太短啦，请重新上传更丰富的视频吧，谢谢~',
               '您上传的视频信息，不要放置QQ、微信、手机号等联系方式哦，请删除后重新填写，谢谢~',
               '您上传的内容可能涉及版权、色情、政治等敏感信息，请重新填写，谢谢~',
               '您上传的视频信息中没有视频画面哦，请重新上传，谢谢~',
               '其他'],
        // 课程-课程详情
        1633: ['您填写的内容不要放置QQ、微信、二维码、个人手机号等联系方式哦，谢谢~',
               '您填写的内容太模糊了，请根据实际情况详细叙述一下吧，谢谢~',
               '您填写的内容和标题、科目不太相符哦，请再修改一下吧，谢谢~',
               '您填写的内容可能涉及版权、色情、政治等敏感信息，请重新填写，谢谢~',
               '课程详情的视频及语音不要放置QQ、微信、二维码、个人手机号等联系方式哦，请重新上传，谢谢~',
               '其他']
    };

    config.ORDER_REFUSE_TYPE = {
        1500: config.ORDER_CLASS_COURSE_REFUSE_CLASS,
        1700: config.ORDER_VIDEO_COURSE_REFUSE_CLASS,
        801: config.ORDER_ID_CARD_ID_REFUSE_CLASS,
        802: config.ORDER_ID_CARD_PASSPORT_REFUSE_CLASS,
        1710: config.ORDER_VIDEO_COURSE_SECTION_REFUSE_CLASS,
        1621: config.ORDER_ORG_XCOURSE_TYPE_REFUSE_CLASS
    };

    return config;
});