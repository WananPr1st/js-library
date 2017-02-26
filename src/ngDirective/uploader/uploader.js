/**
 * @file 简单的上传插件，支持单文件、多文件、大小、扩展名校验、拖动上传
 *   通过多次单个文件上传来模拟多文件批量上传
 *   注意：只在 chrome 下进行过测试
 * @author yangji
 *
 * @property {string} path  上次文件的接口地址
 * @property {?Array<string>} accept 接收的文件类型，可以不传，['jpg', 'gif']，不填即都接收
 * @property {?boolean} multiple 是否是多文件
 * @property {number} size 文件大小限制
 * @property {?boolean} draggable 是否支持拖动上传
 * @property {?string} fieldName 接口中放文件的字段名, 默认为 file
 * @property {?boolean} mimeType 使用mimeType校验文件类型,accept不为空时有用, 默认为 true
 * @property {Object} eventHandler 事件处理方法，其中error 方法必须，用提示大小、扩展名校验
 *       包括 dragenter\dragleave\dragover\drop
 *           uploadprogress\uploadcomplete  这些方法每次上传文件都会调用
 *           uploadstart 上传开始
 *           uploadsuccess 全部上传完成调用
 *           error
 */

define(function (require) {

    'use strict';

    var module = require('../module');
    var config = require('./config');

    module.directive(
        'uploader',
        ['$sce',
            function ($sce) {

                return {
                    template: ''
                    +   '<div class="yunying-upload">'
                    +       '<div ng-bind-html="content"></div>'
                    +       '<input type="file">'
                    +   '</div>',
                    restrict: 'EA',
                    replace: true,
                    scope: {
                        path: '@',
                        accept: '=?',
                        multiple: '=?',
                        size: '@',
                        draggable: '=?',
                        eventHandler: '=',
                        fieldName: '@',
                        text: '@',
                        mimeType: '=?',
                        content: '=?'
                    },
                    link: function ($scope, $element) {

                        $element = $($element);

                        initValue();
                        setInput();
                        bindEvent();

                        function initValue() {
                            $scope.content = $sce.trustAsHtml(
                                $scope.content || config.content
                            );
                        }

                        function setInput() {
                            var accept = $scope.accept;
                            var input = getInput();
                            var mimeType = [];
                            var prop = {};

                            if ($scope.multiple) {
                                prop.multiple = true;
                            }

                            if (accept && $scope.mimeType !== false) {
                                $.each(accept, function (index, item) {
                                    mimeType.push(config.ext2MimeType[item]);
                                });
                                prop.accept = $.unique(mimeType).join(',');
                            }

                            $(input).prop(prop);
                        }

                        function bindEvent() {

                            inputChangeHandler();
                            bindDragEvent();
                        }

                        /**
                         * 初始化inputchange
                         */
                        function inputChangeHandler() {
                            $element.on(
                                'change', 'input', function () {
                                    var input = getInput();
                                    fileHandler(input.files);
                                }
                            );
                        }

                        function getInput() {
                            return $element.find('input').get(0);
                        }

                        /**
                         * 绑定拖拽事件
                         */
                        function bindDragEvent() {
                            if ($scope.draggable) {
                                var eventList = ['dragenter', 'dragleave', 'dragover'];

                                $.each(eventList, function (index, event) {
                                    $element.bind(
                                        event,
                                        function (e) {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            fire(event);
                                        }
                                    );
                                });

                                $element
                                .bind(
                                    'drop',
                                    function (e) {
                                        e.stopPropagation();
                                        e.preventDefault();

                                        fire('drop');
                                        fileHandler(e.originalEvent.dataTransfer.files);
                                    }
                                );


                            }
                        }

                        /**
                         * 触发事件
                         */
                        function fire(event, data) {
                            var eventHandler = $scope.eventHandler || {};

                            eventHandler[event] && eventHandler[event](data);
                        }

                        /**
                         * 错误提示
                         */
                        function error(data, file) {
                            var temp = $.extend(true, {}, data);
                            var input = getInput();
                            if (file) {
                                temp.file = file;
                            }

                            fire('error', temp);
                            $(input).val('');
                        }

                        /**
                         * 文件处理
                         */
                        function fileHandler(files) {

                            if (!$scope.multiple && files.length > 1) {
                                error(
                                    config.error.multiple
                                );
                                return;
                            }

                            var flag = 1;
                            $.each(files, function (index, file) {
                                if (checkSize(file) || checkAccept(file)) {
                                    flag = 0;
                                    return false;
                                }
                            });

                            if (!flag) {
                                return;
                            }

                            fire('uploadstart', {
                                files: files
                            });

                            upload(files, 0);
                        }

                        /**
                         * 检测文件大小
                         */
                        function checkSize(file) {
                            if ($scope.size && file.size > $scope.size) {
                                error(
                                    config.error.size,
                                    file
                                );
                                return true;
                            }
                        }

                        /**
                         * 检测文件类型
                         */
                        function checkAccept(file) {
                            var accept = $scope.accept;
                            var temp = file.name.split('.');
                            var type = temp[temp.length - 1];
                            if (accept && $scope.mimeType === false && $.inArray(type, accept) == -1) {
                                error(
                                    config.error.accept,
                                    file
                                );
                                return true;
                            }
                        }


                        /**
                         * 开始上传
                         */
                        function upload(files, index) {
                            if (index < files.length) {
                                var file = files[index];
                                var xhr = new XMLHttpRequest();

                                xhr.onload = function () {
                                    var response = $.parseJSON(xhr.responseText);

                                    fire('uploadcomplete', {
                                        response: response,
                                        file: file
                                    });
                                    upload(files, index + 1);
                                };

                                xhr.onerror = function () {
                                    error(
                                        config.error.xhr,
                                        file
                                    );
                                };
                                xhr.upload.addEventListener(
                                    "progress",
                                    function (e) {
                                        fire(
                                            'uploadprogress',
                                            {
                                                file: file,
                                                loaded: e.loaded,
                                                total: e.total
                                            }
                                        );
                                    },
                                    false
                                );

                                xhr.open('post', $scope.path, true);

                                var formData = new FormData();

                                formData.append(
                                    $scope.fieldName || config.fieldName,
                                     file
                                );

                                xhr.send(formData);
                            }
                            else {
                                fire('uploadsuccess', files);
                            }
                        }
                    }
                }
            }
        ]
    );
});