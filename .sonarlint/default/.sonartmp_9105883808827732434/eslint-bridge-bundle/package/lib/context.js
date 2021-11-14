"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setContext = exports.getContext = void 0;
let context;
function getContext() {
    return context;
}
exports.getContext = getContext;
function setContext(ctx) {
    context = { ...ctx };
}
exports.setContext = setContext;
//# sourceMappingURL=context.js.map