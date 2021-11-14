"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const utils_1 = require("../utils");
const WEAK_CIPHERS = ['bf', 'blowfish', 'des', 'rc2', 'rc4'];
exports.rule = {
    create(context) {
        return {
            CallExpression(node) {
                var _a;
                const callExpression = node;
                if (utils_1.isCallToFQN(context, callExpression, 'crypto', 'createCipheriv')) {
                    const algorithm = utils_1.getValueOfExpression(context, callExpression.arguments[0], 'Literal');
                    const algorithmValue = (_a = algorithm === null || algorithm === void 0 ? void 0 : algorithm.value) === null || _a === void 0 ? void 0 : _a.toString().toLowerCase();
                    if (algorithm &&
                        algorithmValue &&
                        WEAK_CIPHERS.findIndex(cipher => algorithmValue.startsWith(cipher)) >= 0) {
                        context.report({
                            message: 'Use a strong cipher algorithm.',
                            node: algorithm,
                        });
                    }
                }
            },
        };
    },
};
//# sourceMappingURL=no-weak-cipher.js.map