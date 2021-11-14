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
// https://jira.sonarsource.com/browse/RSPEC-3579
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const utils_1 = require("../utils");
const message = `Make it an object if it must have named properties; otherwise, use a numeric index here.`;
exports.rule = {
    create(context) {
        const services = context.parserServices;
        if (!utils_1.isRequiredParserServices(services)) {
            return {};
        }
        return {
            'AssignmentExpression[left.type="MemberExpression"]'(node) {
                const { property, object } = node
                    .left;
                if (utils_1.isString(property, services) && utils_1.isArray(object, services)) {
                    context.report({
                        message,
                        node,
                    });
                }
            },
        };
    },
};
//# sourceMappingURL=no-associative-arrays.js.map