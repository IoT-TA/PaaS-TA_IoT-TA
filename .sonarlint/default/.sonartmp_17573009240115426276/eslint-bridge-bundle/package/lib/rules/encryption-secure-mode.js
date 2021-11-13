"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const utils_1 = require("../utils");
const aliases = [
    'AES128',
    'AES192',
    'AES256',
    'BF',
    'blowfish',
    'CAMELLIA128',
    'CAMELLIA192',
    'CAMELLIA256',
    'CAST',
    'DES',
    'DES-EDE',
    'DES-EDE3',
    'DES3',
    'DESX',
    'RC2',
    'RC2-40',
    'RC2-64',
    'RC2-128',
    'SEED',
];
exports.rule = {
    create(context) {
        const patterns = [new RegExp('CBC', 'i'), new RegExp('ECB', 'i')];
        aliases.forEach(alias => patterns.push(new RegExp(`^${alias}$`, 'i')));
        return {
            CallExpression: (node) => {
                const callExpression = node;
                if (!utils_1.isCallToFQN(context, callExpression, 'crypto', 'createCipheriv')) {
                    return;
                }
                const sensitiveArgument = callExpression.arguments[0];
                const sensitiveArgumentValue = utils_1.getValueOfExpression(context, sensitiveArgument, 'Literal');
                if (!sensitiveArgumentValue) {
                    return;
                }
                const { value } = sensitiveArgumentValue;
                if (typeof value !== 'string') {
                    return;
                }
                if (patterns.some(pattern => pattern.test(value))) {
                    context.report({
                        message: 'Use a secure mode and padding scheme.',
                        node: sensitiveArgument,
                    });
                }
            },
        };
    },
};
//# sourceMappingURL=encryption-secure-mode.js.map