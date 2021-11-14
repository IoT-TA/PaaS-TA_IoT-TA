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
// https://jira.sonarsource.com/browse/RSPEC-3757
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const typescript_1 = require("typescript");
const utils_1 = require("../utils");
const message = 'Change the expression which uses this operand so that it can\'t evaluate to "NaN" (Not a Number).';
const BINARY_OPERATORS = ['/', '*', '%', '-', '-=', '*=', '/=', '%='];
const UNARY_OPERATORS = ['++', '--', '+', '-'];
exports.rule = {
    create(context) {
        const services = context.parserServices;
        if (!utils_1.isRequiredParserServices(services)) {
            return {};
        }
        function isObjectType(...types) {
            return types.some(t => { var _a; return !!(t.getFlags() & typescript_1.TypeFlags.Object) && !isDate(t) && ((_a = t.symbol) === null || _a === void 0 ? void 0 : _a.name) !== 'Number'; });
        }
        function isDate(type) {
            const { typeToString } = services.program.getTypeChecker();
            return typeToString(type) === 'Date';
        }
        return {
            'BinaryExpression, AssignmentExpression': (node) => {
                const expression = node;
                if (!BINARY_OPERATORS.includes(expression.operator)) {
                    return;
                }
                const leftType = utils_1.getTypeFromTreeNode(expression.left, services);
                const rightType = utils_1.getTypeFromTreeNode(expression.right, services);
                if (isObjectType(leftType)) {
                    context.report({ node: expression.left, message });
                }
                if (isObjectType(rightType)) {
                    context.report({ node: expression.right, message });
                }
            },
            'UnaryExpression, UpdateExpression': (node) => {
                const expr = node;
                if (!UNARY_OPERATORS.includes(expr.operator)) {
                    return;
                }
                const argType = utils_1.getTypeFromTreeNode(expr.argument, services);
                if (isObjectType(argType)) {
                    context.report({ node, message });
                }
            },
        };
    },
};
//# sourceMappingURL=operation-returning-nan.js.map