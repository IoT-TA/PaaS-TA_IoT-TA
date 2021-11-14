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
// https://jira.sonarsource.com/browse/RSPEC-104
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const sonar_max_lines_per_function_1 = require("./sonar-max-lines-per-function");
exports.rule = {
    meta: {
        schema: [{ type: 'integer' }],
    },
    create(context) {
        const [threshold] = context.options;
        const sourceCode = context.getSourceCode();
        const lines = sourceCode.lines;
        const commentLineNumbers = sonar_max_lines_per_function_1.getCommentLineNumbers(sourceCode.getAllComments());
        return {
            'Program:exit': (node) => {
                if (!node.loc) {
                    return;
                }
                const lineCount = sonar_max_lines_per_function_1.getLocsNumber(node.loc, lines, commentLineNumbers);
                if (lineCount > threshold) {
                    context.report({
                        message: `This file has ${lineCount} lines, which is greater than ${threshold} authorized. Split it into smaller files.`,
                        loc: { line: 0, column: 0 },
                    });
                }
            },
        };
    },
};
//# sourceMappingURL=sonar-max-lines.js.map