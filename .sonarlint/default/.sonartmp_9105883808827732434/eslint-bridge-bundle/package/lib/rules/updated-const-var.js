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
// https://jira.sonarsource.com/browse/RSPEC-3500
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const utils_1 = require("../utils");
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
            'VariableDeclaration[kind="const"]': (node) => {
                context.getDeclaredVariables(node).forEach(variable => variable.references.filter(isModifyingReference).forEach(reference => context.report({
                    message: utils_1.toEncodedMessage(`Correct this attempt to modify "${reference.identifier.name}" or use "let" in its declaration.`, [node], ['Const declaration']),
                    node: reference.identifier,
                })));
            },
        };
    },
};
function isModifyingReference(reference, index, references) {
    const identifier = reference.identifier;
    const modifyingDifferentIdentifier = index === 0 || references[index - 1].identifier !== identifier;
    return (identifier && reference.init === false && reference.isWrite() && modifyingDifferentIdentifier);
}
//# sourceMappingURL=updated-const-var.js.map