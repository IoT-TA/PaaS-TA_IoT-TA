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
// https://jira.sonarsource.com/browse/RSPEC-5743
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const utils_1 = require("../utils");
const MESSAGE = 'Make sure allowing browsers to perform DNS prefetching is safe here.';
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
            CallExpression: (node) => {
                const callExpression = node;
                const { callee } = callExpression;
                if (utils_1.isCallToFQN(context, callExpression, 'helmet', 'dnsPrefetchControl')) {
                    utils_1.checkSensitiveCall(context, callExpression, 0, 'allow', true, MESSAGE);
                }
                const calledModule = utils_1.getModuleNameOfNode(context, callee);
                if ((calledModule === null || calledModule === void 0 ? void 0 : calledModule.value) === 'helmet') {
                    utils_1.checkSensitiveCall(context, callExpression, 0, 'dnsPrefetchControl', false, MESSAGE);
                }
                if ((calledModule === null || calledModule === void 0 ? void 0 : calledModule.value) === 'dns-prefetch-control') {
                    utils_1.checkSensitiveCall(context, callExpression, 0, 'allow', true, MESSAGE);
                }
            },
        };
    },
};
//# sourceMappingURL=dns-prefetching.js.map