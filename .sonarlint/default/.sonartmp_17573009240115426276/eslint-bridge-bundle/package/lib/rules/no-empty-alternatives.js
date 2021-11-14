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
// https://sonarsource.github.io/rspec/#/rspec/S6323
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const utils_1 = require("../utils");
const regex_rule_template_1 = require("./regex-rule-template");
exports.rule = regex_rule_template_1.createRegExpRule(context => {
    function checkAlternation(alternation) {
        const { alternatives: alts } = alternation;
        if (alts.length <= 1) {
            return;
        }
        for (let i = 0; i < alts.length; i++) {
            let alt = alts[i];
            if (alt.elements.length === 0 && !isLastEmptyInGroup(alt)) {
                context.reportRegExpNode({
                    message: 'Remove this empty alternative.',
                    regexpNode: alt,
                    offset: i === alts.length - 1 ? [-1, 0] : [0, 1],
                    node: context.node,
                });
            }
        }
    }
    return {
        onPatternEnter: checkAlternation,
        onGroupEnter: checkAlternation,
        onCapturingGroupEnter: checkAlternation,
    };
});
function isLastEmptyInGroup(alt) {
    const group = alt.parent;
    return ((group.type === 'Group' || group.type === 'CapturingGroup') &&
        utils_1.last(group.alternatives) === alt &&
        group.parent.type !== 'Quantifier');
}
//# sourceMappingURL=no-empty-alternatives.js.map