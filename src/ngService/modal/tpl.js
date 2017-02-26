
define(function () {

    'use strict';

    angular.module("template/modal/tpl.html", []).run(["$templateCache", function($templateCache) {
      $templateCache.put("template/modal/backdrop.html",
        "<div class=\"modal-backdrop fade {{ backdropClass }}\"\n" +
        "     ng-class=\"{in: animate}\"\n" +
        "     ng-style=\"{'z-index': 1040 + (index && 1 || 0) + index*10}\"\n" +
        "></div>\n" +
        "");
      $templateCache.put("template/modal/window.html", ''
        +   '<div modal-render="{{$isRendered}}" tabindex="-1" role="dialog" class="modal"'
        +       'modal-animation-class="fade"'
        +       'modal-in-class="in"'
        +       'ng-style="{\'z-index\': 1050 + index*10, display: \'block\'}"'
        +       'ng-click="close($event)">'
        +       '<div class="modal-dialog" ng-class="size ? \'modal-\' + size : \'\'">'
        +           '<div class="modal-content" modal-transclude></div>'
        +       '</div>'
        +   '</div>'

        );
    }]);

});