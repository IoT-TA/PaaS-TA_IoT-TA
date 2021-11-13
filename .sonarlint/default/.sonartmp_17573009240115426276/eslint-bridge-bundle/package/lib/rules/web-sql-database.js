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
// https://jira.sonarsource.com/browse/RSPEC-2817
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const utils_1 = require("../utils");
const MESSAGE = 'Convert this use of a Web SQL database to another technology.';
const OPEN_DATABASE = 'openDatabase';
exports.rule = {
    create(context) {
        const services = context.parserServices;
        if (!utils_1.isRequiredParserServices(services)) {
            return {};
        }
        return {
            CallExpression: (node) => {
                const callExpression = node;
                const { callee } = callExpression;
                const symbol = utils_1.getSymbolAtLocation(callee, services);
                if (!!symbol) {
                    return;
                }
                if (utils_1.isIdentifier(callee, OPEN_DATABASE)) {
                    context.report({ node: callee, message: MESSAGE });
                }
                if (callee.type !== 'MemberExpression' || !utils_1.isIdentifier(callee.property, OPEN_DATABASE)) {
                    return;
                }
                const typeName = utils_1.getTypeAsString(callee.object, services);
                if (typeName.match(/window/i) || typeName.match(/globalThis/i)) {
                    context.report({ node: callee, message: MESSAGE });
                }
            },
        };
    },
};
//# sourceMappingURL=web-sql-database.js.map