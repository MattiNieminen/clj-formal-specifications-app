define("ace/theme/clj-formal-specifications-app", ["require", "exports",
    "module", "ace/lib/dom"], function(require, exports, module) {

exports.isDark = true;
exports.cssClass = "ace-clj-formal-specifications-app";
exports.cssText = ".ace-clj-formal-specifications-app .ace_gutter {\
background: #0F171D;\
color: #33475F;\
border-right: 1px solid #151E26;\
}\
.ace-clj-formal-specifications-app .ace_gutter-cell.ace_warning {\
background-image: none;\
background: #FC0;\
border-left: none;\
padding-left: 0;\
color: #000;\
}\
.ace-clj-formal-specifications-app .ace_gutter-cell.ace_error {\
background-position: -6px center;\
background-image: none;\
background: #F10;\
border-left: none;\
padding-left: 0;\
color: #000;\
}\
.ace-clj-formal-specifications-app .ace_print-margin {\
border-left: 1px solid #263440;\
right: 0;\
background: #0E151B;\
}\
.ace-clj-formal-specifications-app {\
background-color: #0E151B;\
color: #FFF;\
}\
.ace-clj-formal-specifications-app .ace_cursor {\
border-left: 2px solid #FFFFFF;\
}\
.ace-clj-formal-specifications-app .ace_cursor.ace_overwrite {\
border-left: 0px;\
border-bottom: 1px solid #FFFFFF;\
}\
.ace-clj-formal-specifications-app .ace_marker-layer .ace_selection {\
background: #2D3B4B;\
}\
.ace-clj-formal-specifications-app .ace_marker-layer .ace_step {\
background: rgb(198, 219, 213);\
}\
.ace-clj-formal-specifications-app .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid #FDBF2C;\
}\
.ace-clj-formal-specifications-app .ace_marker-layer .ace_active-line {\
background: #222F3C;\
}\
.ace-clj-formal-specifications-app .ace_gutter-active-line {\
background-color: #19232E;\
}\
.ace-clj-formal-specifications-app .ace_invisible {\
color: #2B3840;\
}\
.ace-clj-formal-specifications-app .ace_keyword {\
color:#2BB7D9;\
}\
.ace-clj-formal-specifications-app .ace_keyword.ace_operator {\
color:#F13288;\
}\
.ace-clj-formal-specifications-app .ace_constant {\
color:#68FFCC;\
}\
.ace-clj-formal-specifications-app .ace_constant.ace_language {\
color:#FFC032;\
}\
.ace-clj-formal-specifications-app .ace_constant.ace_library {\
color:#99F855;\
}\
.ace-clj-formal-specifications-app .ace_constant.ace_numeric {\
color:#69E964;\
}\
.ace-clj-formal-specifications-app .ace_invalid {\
color:#FFFFFF;\
background-color:#990000;\
}\
.ace-clj-formal-specifications-app .ace_invalid.ace_deprecated {\
color:#FFFFFF;\
background-color:#990000;\
}\
.ace-clj-formal-specifications-app .ace_support {\
color: #536D98;\
}\
.ace-clj-formal-specifications-app .ace_support.ace_function {\
color:#38C5F1;\
}\
.ace-clj-formal-specifications-app .ace_function {\
color:#38C5F1;\
}\
.ace-clj-formal-specifications-app .ace_string {\
color:#EE5740;\
}\
.ace-clj-formal-specifications-app .ace_comment {\
color:#323D54;\
font-style:italic;\
padding-bottom: 0px;\
}\
.ace-clj-formal-specifications-app .ace_variable {\
color:#FFFFA7;\
}\
.ace-clj-formal-specifications-app .ace_meta.ace_tag {\
color:#E980DC;\
}\
.ace-clj-formal-specifications-app .ace_entity.ace_other.ace_attribute-name {\
color:#FFFF89;\
}\
.ace-clj-formal-specifications-app .ace_markup.ace_underline {\
text-decoration: underline;\
}\
.ace-clj-formal-specifications-app .ace_fold-widget {\
text-align: center;\
}\
.ace-clj-formal-specifications-app .ace_fold-widget:hover {\
color: #525E76;\
}\
.ace-clj-formal-specifications-app .ace_fold-widget.ace_start,\
.ace-clj-formal-specifications-app .ace_fold-widget.ace_end,\
.ace-clj-formal-specifications-app .ace_fold-widget.ace_closed{\
background: none;\
border: none;\
box-shadow: none;\
}\
.ace-clj-formal-specifications-app .ace_fold-widget.ace_start:after {\
content: '▾'\
}\
.ace-clj-formal-specifications-app .ace_fold-widget.ace_end:after {\
content: '▴'\
}\
.ace-clj-formal-specifications-app .ace_fold-widget.ace_closed:after {\
content: '‣'\
}\
.ace-clj-formal-specifications-app .ace_indent-guide {\
border-right:1px dotted #26394B;\
margin-right:-1px;\
}\
.ace-clj-formal-specifications-app .ace_fold { \
background: #222; \
border-radius: 3px; \
color: #7AF; \
border: none; \
}\
.ace-clj-formal-specifications-app .ace_fold:hover {\
background: #ADC7CC; \
color: #000;\
}\
";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);

});
