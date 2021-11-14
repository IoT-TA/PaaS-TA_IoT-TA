"use strict";
/*
 * SonarQube JavaScript Plugin
 * Copyright (C) 2011-2021 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
// https://jira.sonarsource.com/browse/RSPEC-4507
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const utils_1 = require("../utils");
const ERRORHANDLER_MODULE = 'errorhandler';
const message = 'Make sure this debug feature is deactivated before delivering the code in production.';
exports.rule = {
    create(context) {
        return {
            CallExpression(node) {
                const callExpression = node;
                // app.use(...)
                checkErrorHandlerMiddleware(context, callExpression);
            },
        };
    },
};
function checkErrorHandlerMiddleware(context, callExpression) {
    var _a;
    const { callee, arguments: args } = callExpression;
    if (callee.type === 'MemberExpression' &&
        utils_1.isIdentifier(callee.property, 'use') &&
        args.length > 0 &&
        !isInsideConditional(context)) {
        for (const m of utils_1.flattenArgs(context, args)) {
            const middleware = utils_1.getUniqueWriteUsageOrNode(context, m);
            if (middleware &&
                middleware.type === 'CallExpression' &&
                ((_a = utils_1.getModuleNameOfNode(context, middleware.callee)) === null || _a === void 0 ? void 0 : _a.value) === ERRORHANDLER_MODULE) {
                context.report({
                    node: middleware,
                    message,
                });
            }
        }
    }
}
function isInsideConditional(context) {
    const ancestors = context.getAncestors();
    return ancestors.some(ancestor => ancestor.type === 'IfStatement');
}
//# sourceMappingURL=production-debug.js.map