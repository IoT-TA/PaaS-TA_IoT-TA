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
// https://jira.sonarsource.com/browse/RSPEC-134
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const utils_1 = require("../utils");
exports.rule = {
    meta: {
        schema: [
            { type: 'integer' },
            {
                // internal parameter for rules having secondary locations
                enum: ['sonar-runtime'],
            },
        ],
    },
    create(context) {
        const sourceCode = context.getSourceCode();
        const [threshold] = context.options;
        const nodeStack = [];
        function push(n) {
            nodeStack.push(n);
        }
        function pop() {
            return nodeStack.pop();
        }
        function check(node) {
            if (nodeStack.length === threshold) {
                context.report({
                    message: utils_1.toEncodedMessage(`Refactor this code to not nest more than ${threshold} if/for/while/switch/try statements.`, nodeStack, nodeStack.map(_n => '+1')),
                    loc: sourceCode.getFirstToken(node).loc,
                });
            }
        }
        function isElseIf(node) {
            const parent = last(context.getAncestors());
            return (node.type === 'IfStatement' && parent.type === 'IfStatement' && node === parent.alternate);
        }
        const controlFlowNodes = [
            'ForStatement',
            'ForInStatement',
            'ForOfStatement',
            'WhileStatement',
            'DoWhileStatement',
            'IfStatement',
            'TryStatement',
            'SwitchStatement',
        ].join(',');
        return {
            [controlFlowNodes]: (node) => {
                if (isElseIf(node)) {
                    pop();
                    push(sourceCode.getFirstToken(node));
                }
                else {
                    check(node);
                    push(sourceCode.getFirstToken(node));
                }
            },
            [`${controlFlowNodes}:exit`]: (node) => {
                if (!isElseIf(node)) {
                    pop();
                }
            },
        };
    },
};
function last(arr) {
    return arr[arr.length - 1];
}
//# sourceMappingURL=nested-control-flow.js.map