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
// https://jira.sonarsource.com/browse/RSPEC-3735
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
exports.rule = {
    create(context) {
        function checkNode(node) {
            const unaryExpression = node;
            if (isVoid0(unaryExpression) || isIIFE(unaryExpression)) {
                return;
            }
            const operatorToken = context.getSourceCode().getTokenBefore(unaryExpression.argument);
            context.report({
                loc: operatorToken.loc,
                message: 'Remove this use of the "void" operator.',
            });
        }
        function isVoid0(expr) {
            return expr.argument.type === 'Literal' && 0 === expr.argument.value;
        }
        function isIIFE(expr) {
            return (expr.argument.type === 'CallExpression' &&
                ['ArrowFunctionExpression', 'FunctionExpression'].includes(expr.argument.callee.type));
        }
        return {
            'UnaryExpression[operator="void"]': checkNode,
        };
    },
};
//# sourceMappingURL=void-use.js.map