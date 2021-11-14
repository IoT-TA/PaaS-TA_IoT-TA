"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const cookie_flag_check_1 = require("./cookie-flag-check");
exports.rule = {
    meta: {
        schema: [
            {
                // internal parameter for rules having secondary locations
                enum: ['sonar-runtime'],
            },
        ],
    },
    create(context) {
        return {
            CallExpression: (node) => new cookie_flag_check_1.CookieFlagCheck(context, 'httpOnly').checkCookiesFromCallExpression(node),
        };
    },
};
//# sourceMappingURL=cookie-no-httponly.js.map