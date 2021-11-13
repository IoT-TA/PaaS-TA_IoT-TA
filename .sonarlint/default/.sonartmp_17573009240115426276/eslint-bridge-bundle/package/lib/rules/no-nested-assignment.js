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
// https://jira.sonarsource.com/browse/RSPEC-1121
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const utils_1 = require("../utils");
exports.rule = {
    create(context) {
        function isAssignmentStatement(parent) {
            return parent.type === 'ExpressionStatement';
        }
        function isEnclosingChain(parent) {
            return parent.type === 'AssignmentExpression';
        }
        function isEnclosingRelation(parent) {
            return (parent.type === 'BinaryExpression' &&
                ['==', '!=', '===', '!==', '<', '<=', '>', '>='].includes(parent.operator));
        }
        function isEnclosingSequence(parent) {
            return parent.type === 'SequenceExpression';
        }
        function isEnclosingDeclarator(parent) {
            return parent.type === 'VariableDeclarator';
        }
        function isLambdaBody(parent, expr) {
            return parent.type === 'ArrowFunctionExpression' && parent.body === expr;
        }
        function isConditionalAssignment(parent, expr) {
            return parent.type === 'LogicalExpression' && parent.right === expr;
        }
        function isWhileCondition(parent, expr) {
            return ((parent.type === 'DoWhileStatement' || parent.type === 'WhileStatement') &&
                parent.test === expr);
        }
        function isForInitOrUpdate(parent, expr) {
            return parent.type === 'ForStatement' && (parent.init === expr || parent.update === expr);
        }
        return {
            AssignmentExpression: (node) => {
                const assignment = node;
                const parent = utils_1.getParent(context);
                if (parent &&
                    !isAssignmentStatement(parent) &&
                    !isEnclosingChain(parent) &&
                    !isEnclosingRelation(parent) &&
                    !isEnclosingSequence(parent) &&
                    !isEnclosingDeclarator(parent) &&
                    !isLambdaBody(parent, assignment) &&
                    !isConditionalAssignment(parent, assignment) &&
                    !isWhileCondition(parent, assignment) &&
                    !isForInitOrUpdate(parent, assignment)) {
                    raiseIssue(assignment, context);
                }
            },
        };
    },
};
function raiseIssue(node, context) {
    const sourceCode = context.getSourceCode();
    const operator = sourceCode.getFirstTokenBetween(node.left, node.right, token => token.value === node.operator);
    const text = sourceCode.getText(node.left);
    context.report({
        message: `Extract the assignment of \"${text}\" from this expression.`,
        loc: operator.loc,
    });
}
//# sourceMappingURL=no-nested-assignment.js.map