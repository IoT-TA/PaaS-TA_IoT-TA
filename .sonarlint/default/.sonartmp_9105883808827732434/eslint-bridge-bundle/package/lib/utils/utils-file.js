"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTestCode = exports.isMainCode = exports.FileType = void 0;
var FileType;
(function (FileType) {
    FileType["MAIN"] = "MAIN";
    FileType["TEST"] = "TEST";
})(FileType = exports.FileType || (exports.FileType = {}));
function isMainCode(context) {
    return !isTestCode(context);
}
exports.isMainCode = isMainCode;
function isTestCode(context) {
    return getFileType(context) === FileType.TEST;
}
exports.isTestCode = isTestCode;
function getFileType(context) {
    return context.settings['fileType'];
}
//# sourceMappingURL=utils-file.js.map