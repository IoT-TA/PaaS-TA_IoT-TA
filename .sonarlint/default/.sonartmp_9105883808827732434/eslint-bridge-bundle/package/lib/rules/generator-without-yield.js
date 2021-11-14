"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const locations_1 = require("eslint-plugin-sonarjs/lib/utils/locations");
const utils_1 = require("../utils");
const MESSAGE = 'Add a "yield" statement to this generator.';
exports.rule = {
    create(context) {
        const yieldStack = [];
        function enterFunction() {
            yieldStack.push(0);
        }
        function exitFunction(node) {
            const functionNode = node;
            const countYield = yieldStack.pop();
            if (countYield === 0 && functionNode.body.body.length > 0) {
                context.report({
                    message: MESSAGE,
                    loc: locations_1.getMainFunctionTokenLocation(functionNode, utils_1.getParent(context), context),
                });
            }
        }
        return {
            ':function[generator=true]': enterFunction,
            ':function[generator=true]:exit': exitFunction,
            YieldExpression() {
                if (yieldStack.length > 0) {
                    yieldStack[yieldStack.length - 1] += 1;
                }
            },
        };
    },
};
//# sourceMappingURL=generator-without-yield.js.map