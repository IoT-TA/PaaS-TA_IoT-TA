"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCognitiveComplexity = exports.getHighlightedSymbols = exports.loadCustomRuleBundle = exports.initLinter = exports.analyzeTypeScript = exports.analyzeJavaScript = exports.COGNITIVE_COMPLEXITY_RULE = exports.SYMBOL_HIGHLIGHTING_RULE = exports.EMPTY_RESPONSE = void 0;
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
const parser_1 = require("./parser");
const highlighter_1 = __importDefault(require("./runner/highlighter"));
const metrics_1 = __importStar(require("./runner/metrics"));
const cpd_1 = __importDefault(require("./runner/cpd"));
const eslint_1 = require("eslint");
const symbol_highlighter_1 = require("./runner/symbol-highlighter");
const eslint_plugin_sonarjs_1 = require("eslint-plugin-sonarjs");
const linter_1 = require("./linter");
const context_1 = require("./context");
const COGNITIVE_COMPLEXITY_RULE_ID = 'internal-cognitive-complexity';
exports.EMPTY_RESPONSE = {
    issues: [],
    highlights: [],
    highlightedSymbols: [],
    metrics: metrics_1.EMPTY_METRICS,
    cpdTokens: [],
};
exports.SYMBOL_HIGHLIGHTING_RULE = {
    ruleId: symbol_highlighter_1.symbolHighlightingRuleId,
    ruleModule: symbol_highlighter_1.rule,
    ruleConfig: [],
    activateAutomatically: true,
};
exports.COGNITIVE_COMPLEXITY_RULE = {
    ruleId: COGNITIVE_COMPLEXITY_RULE_ID,
    ruleModule: eslint_plugin_sonarjs_1.rules['cognitive-complexity'],
    ruleConfig: ['metric'],
    activateAutomatically: true,
};
function analyzeJavaScript(input) {
    return analyze(input, 'js');
}
exports.analyzeJavaScript = analyzeJavaScript;
function analyzeTypeScript(input) {
    return analyze(input, 'ts');
}
exports.analyzeTypeScript = analyzeTypeScript;
let linter;
const customRules = [];
function initLinter(rules, environments = [], globals = []) {
    console.log(`DEBUG initializing linter with ${rules.map(r => r.key)}`);
    const additionalRules = [exports.COGNITIVE_COMPLEXITY_RULE, ...customRules];
    if (!context_1.getContext().sonarlint) {
        additionalRules.push(exports.SYMBOL_HIGHLIGHTING_RULE);
    }
    linter = new linter_1.LinterWrapper(rules, additionalRules, environments, globals);
}
exports.initLinter = initLinter;
function loadCustomRuleBundle(bundlePath) {
    const bundle = require(bundlePath);
    customRules.push(...bundle.rules);
    return bundle.rules.map((r) => r.ruleId);
}
exports.loadCustomRuleBundle = loadCustomRuleBundle;
function analyze(input, language) {
    if (!linter) {
        throw new Error('Linter is undefined. Did you call /init-linter?');
    }
    const result = parser_1.buildSourceCode(input, language);
    if (result instanceof eslint_1.SourceCode) {
        return analyzeFile(result, input);
    }
    else {
        return {
            ...exports.EMPTY_RESPONSE,
            parsingError: result,
        };
    }
}
function analyzeFile(sourceCode, input) {
    let issues = [];
    let parsingError = undefined;
    try {
        issues = linter.analyze(sourceCode, input.filePath, input.fileType).issues;
    }
    catch (e) {
        // turns exceptions from TypeScript compiler into "parsing" errors
        if (e.stack.indexOf('typescript.js:') > -1) {
            parsingError = { message: e.message, code: parser_1.ParseExceptionCode.FailingTypeScript };
        }
        else {
            throw e;
        }
    }
    // this is invoked for side-effect also for SonarLint, it removes cognitive complexity pseudo-issue which is used
    // for the metric
    const cognitiveComplexityMetric = getCognitiveComplexity(issues);
    if (context_1.getContext().sonarlint) {
        return { issues, parsingError, metrics: metrics_1.getMetricsForSonarLint(sourceCode) };
    }
    else {
        return {
            issues,
            parsingError,
            highlightedSymbols: getHighlightedSymbols(issues),
            highlights: highlighter_1.default(sourceCode).highlights,
            metrics: metrics_1.default(sourceCode, !!input.ignoreHeaderComments, cognitiveComplexityMetric),
            cpdTokens: cpd_1.default(sourceCode).cpdTokens,
        };
    }
}
// exported for testing
function getHighlightedSymbols(issues) {
    const issue = findAndRemoveFirstIssue(issues, symbol_highlighter_1.symbolHighlightingRuleId);
    if (issue) {
        return JSON.parse(issue.message);
    }
    else {
        console.log('DEBUG Failed to retrieve symbol highlighting from analysis results');
        return [];
    }
}
exports.getHighlightedSymbols = getHighlightedSymbols;
// exported for testing
function getCognitiveComplexity(issues) {
    const issue = findAndRemoveFirstIssue(issues, COGNITIVE_COMPLEXITY_RULE_ID);
    if (issue && !isNaN(Number(issue.message))) {
        return Number(issue.message);
    }
    else {
        console.log('DEBUG Failed to retrieve cognitive complexity metric from analysis results');
        return 0;
    }
}
exports.getCognitiveComplexity = getCognitiveComplexity;
function findAndRemoveFirstIssue(issues, ruleId) {
    for (const issue of issues) {
        if (issue.ruleId === ruleId) {
            const index = issues.indexOf(issue);
            issues.splice(index, 1);
            return issue;
        }
    }
    return undefined;
}
//# sourceMappingURL=analyzer.js.map