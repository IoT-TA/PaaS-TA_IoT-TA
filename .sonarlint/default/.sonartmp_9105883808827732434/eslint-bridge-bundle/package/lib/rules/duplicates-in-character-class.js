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
// https://sonarsource.github.io/rspec/#/rspec/S5869
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const utils_1 = require("../utils");
const regex_rule_template_1 = require("./regex-rule-template");
exports.rule = regex_rule_template_1.createRegExpRule(context => {
    let flags;
    return {
        onRegExpLiteralEnter: (node) => {
            flags = node.flags;
        },
        onCharacterClassEnter: (node) => {
            const duplicates = new Set();
            const characterClass = new utils_1.SimplifiedRegexCharacterClass(flags);
            node.elements.forEach(element => {
                const intersections = new utils_1.SimplifiedRegexCharacterClass(flags, element).findIntersections(characterClass);
                if (intersections.length > 0) {
                    intersections.forEach(intersection => duplicates.add(intersection));
                    duplicates.add(element);
                }
                characterClass.add(element);
            });
            if (duplicates.size > 0) {
                const [primary, ...secondaries] = duplicates;
                context.reportRegExpNode({
                    message: utils_1.toEncodedMessage('Remove duplicates in this character class.', secondaries.map(snd => ({ loc: utils_1.getRegexpLocation(context.node, snd, context) })), secondaries.map(_ => 'Additional duplicate')),
                    node: context.node,
                    regexpNode: primary,
                });
            }
        },
    };
}, {
    meta: {
        schema: [
            {
                // internal parameter for rules having secondary locations
                enum: ['sonar-runtime'],
            },
        ],
    },
});
//# sourceMappingURL=duplicates-in-character-class.js.map