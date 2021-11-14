"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRuleConfig = exports.decodeSonarRuntimeIssue = exports.LinterWrapper = void 0;
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
const eslint_plugin_sonarjs_1 = require("eslint-plugin-sonarjs");
const eslint_plugin_chai_friendly_1 = require("eslint-plugin-chai-friendly");
const no_unused_expressions_decorator_1 = require("./rules/no-unused-expressions-decorator");
const main_1 = require("./rules/main");
const eslint_1 = require("eslint");
const eslint_plugin_1 = require("@typescript-eslint/eslint-plugin");
const context_1 = require("./context");
const prefer_template_decorator_1 = require("./rules/prefer-template-decorator");
const accessor_pairs_decorator_1 = require("./rules/accessor-pairs-decorator");
const no_redeclare_decorator_1 = require("./rules/no-redeclare-decorator");
class LinterWrapper {
    /**
     * 'additionalRules' - rules used for computing metrics (incl. highlighting) when it requires access to the rule context; resulting value is encoded in the message
     * and custom rules provided by additional rule bundles
     */
    constructor(rules, additionalRules = [], environments = [], globals = []) {
        this.linter = new eslint_1.Linter();
        this.linter.defineRules(eslint_plugin_sonarjs_1.rules);
        this.linter.defineRules(main_1.rules);
        const NO_UNUSED_EXPRESSIONS = 'no-unused-expressions';
        // core implementation of this rule raises FPs on chai framework
        this.linter.defineRule(NO_UNUSED_EXPRESSIONS, no_unused_expressions_decorator_1.decorateJavascriptEslint(eslint_plugin_chai_friendly_1.rules[NO_UNUSED_EXPRESSIONS]));
        const TRAILING_COMMA = 'enforce-trailing-comma';
        // S1537 and S3723 both depend on the same eslint implementation
        // but the plugin doesn't allow duplicates of the same key.
        this.linter.defineRule(TRAILING_COMMA, this.linter.getRules().get('comma-dangle'));
        const ACCESSOR_PAIRS = 'accessor-pairs';
        this.linter.defineRule(ACCESSOR_PAIRS, accessor_pairs_decorator_1.decorateAccessorPairs(this.linter.getRules().get(ACCESSOR_PAIRS)));
        // core implementation of this rule raises issues on binary expressions with string literal operand(s)
        const PREFER_TEMPLATE = 'prefer-template';
        this.linter.defineRule(PREFER_TEMPLATE, prefer_template_decorator_1.decoratePreferTemplate(this.linter.getRules().get(PREFER_TEMPLATE)));
        // core implementation of this rule raises issues on type exports
        const NO_REDECLARE = 'no-redeclare';
        this.linter.defineRule(NO_REDECLARE, no_redeclare_decorator_1.decorateNoRedeclare(this.linter.getRules().get(NO_REDECLARE)));
        // TS implementation of no-throw-literal is not supporting JS code.
        delete eslint_plugin_1.rules['no-throw-literal'];
        Object.keys(eslint_plugin_1.rules).forEach(name => {
            eslint_plugin_1.rules[name] = sanitizeTypeScriptESLintRule(eslint_plugin_1.rules[name]);
        });
        this.linter.defineRules(eslint_plugin_1.rules);
        const noUnusedExpressionsRule = eslint_plugin_1.rules[NO_UNUSED_EXPRESSIONS];
        if (noUnusedExpressionsRule) {
            this.linter.defineRule(NO_UNUSED_EXPRESSIONS, no_unused_expressions_decorator_1.decorateTypescriptEslint(noUnusedExpressionsRule));
        }
        additionalRules.forEach(additionalRule => this.linter.defineRule(additionalRule.ruleId, additionalRule.ruleModule));
        this.rules = this.linter.getRules();
        this.linterConfig = this.createLinterConfig(rules, additionalRules, environments, globals);
    }
    createLinterConfig(inputRules, additionalRules, environments, globals) {
        const env = { es6: true };
        const globalsConfig = {};
        for (const key of environments) {
            env[key] = true;
        }
        for (const key of globals) {
            globalsConfig[key] = true;
        }
        const ruleConfig = {
            rules: {},
            parserOptions: { sourceType: 'module', ecmaVersion: 2018 },
            env,
            globals: globalsConfig,
        };
        inputRules.forEach(inputRule => {
            const ruleModule = this.rules.get(inputRule.key);
            ruleConfig.rules[inputRule.key] = ['error', ...getRuleConfig(ruleModule, inputRule)];
        });
        additionalRules
            .filter(rule => rule.activateAutomatically)
            .forEach(additionalRule => (ruleConfig.rules[additionalRule.ruleId] = ['error', ...additionalRule.ruleConfig]));
        return ruleConfig;
    }
    analyze(sourceCode, filePath, fileType) {
        const issues = this.linter
            .verify(sourceCode, { ...this.linterConfig, settings: { fileType } }, {
            filename: filePath,
            allowInlineConfig: false,
        })
            .map(removeIrrelevantProperties)
            .map(issue => {
            if (!issue) {
                return null;
            }
            return decodeSonarRuntimeIssue(this.rules.get(issue.ruleId), issue);
        })
            .filter((issue) => issue !== null)
            .map(normalizeIssueLocation);
        return { issues };
    }
}
exports.LinterWrapper = LinterWrapper;
// exported for testing
function decodeSonarRuntimeIssue(ruleModule, issue) {
    if (hasSonarRuntimeOption(ruleModule, issue.ruleId)) {
        try {
            const encodedMessage = JSON.parse(issue.message);
            return { ...issue, ...encodedMessage };
        }
        catch (e) {
            throw new Error(`Failed to parse encoded issue message for rule ${issue.ruleId}:\n"${issue.message}". ${e.message}`);
        }
    }
    return issue;
}
exports.decodeSonarRuntimeIssue = decodeSonarRuntimeIssue;
function sanitizeTypeScriptESLintRule(rule) {
    return {
        ...(!!rule.meta && { meta: rule.meta }),
        create(originalContext) {
            var _a;
            const interceptingContext = {
                id: originalContext.id,
                options: originalContext.options,
                settings: originalContext.settings,
                parserPath: originalContext.parserPath,
                parserOptions: originalContext.parserOptions,
                parserServices: originalContext.parserServices,
                getCwd() {
                    return originalContext.getCwd();
                },
                getPhysicalFilename() {
                    return originalContext.getPhysicalFilename();
                },
                getAncestors() {
                    return originalContext.getAncestors();
                },
                getDeclaredVariables(node) {
                    return originalContext.getDeclaredVariables(node);
                },
                getFilename() {
                    return originalContext.getFilename();
                },
                getScope() {
                    return originalContext.getScope();
                },
                getSourceCode() {
                    return originalContext.getSourceCode();
                },
                markVariableAsUsed(name) {
                    return originalContext.markVariableAsUsed(name);
                },
                report(descriptor) {
                    return originalContext.report(descriptor);
                },
            };
            if (((_a = rule.meta) === null || _a === void 0 ? void 0 : _a.docs) &&
                rule.meta.docs.requiresTypeChecking === true &&
                interceptingContext.parserServices.hasFullTypeInformation !== true) {
                return {};
            }
            return rule.create(interceptingContext);
        },
    };
}
function removeIrrelevantProperties(eslintIssue) {
    // ruleId equals 'null' for parsing error,
    // but it should not happen because we lint ready AST and not file content
    if (!eslintIssue.ruleId) {
        console.error("Illegal 'null' ruleId for eslint issue");
        return null;
    }
    return {
        column: eslintIssue.column,
        line: eslintIssue.line,
        endColumn: eslintIssue.endColumn,
        endLine: eslintIssue.endLine,
        ruleId: eslintIssue.ruleId,
        message: eslintIssue.message,
        secondaryLocations: [],
    };
}
/**
 * 'sonar-runtime' is the option used by eslint-plugin-sonarjs rules to distinguish
 *  when they are executed in a sonar* context or in eslint
 *
 *  'sonar-context' is the option to distinguish rules which require context as part of their options
 *
 * exported for testing
 */
function getRuleConfig(ruleModule, inputRule) {
    const options = [...inputRule.configurations];
    if (hasSonarRuntimeOption(ruleModule, inputRule.key)) {
        options.push('sonar-runtime');
    }
    if (hasSonarContextOption(ruleModule, inputRule.key)) {
        options.push(context_1.getContext());
    }
    return options;
}
exports.getRuleConfig = getRuleConfig;
function hasSonarRuntimeOption(ruleModule, ruleId) {
    const schema = getRuleSchema(ruleModule, ruleId);
    return !!schema && schema.some(option => !!option.enum && option.enum.includes('sonar-runtime'));
}
function hasSonarContextOption(ruleModule, ruleId) {
    const schema = getRuleSchema(ruleModule, ruleId);
    return !!schema && schema.some(option => option.title === 'sonar-context');
}
function getRuleSchema(ruleModule, ruleId) {
    if (!ruleModule) {
        console.log(`DEBUG ruleModule not found for rule ${ruleId}`);
        return undefined;
    }
    if (!ruleModule.meta || !ruleModule.meta.schema) {
        return undefined;
    }
    const { schema } = ruleModule.meta;
    return Array.isArray(schema) ? schema : [schema];
}
function normalizeIssueLocation(issue) {
    issue.column -= 1;
    if (issue.endColumn) {
        issue.endColumn -= 1;
    }
    return issue;
}
//# sourceMappingURL=linter.js.map