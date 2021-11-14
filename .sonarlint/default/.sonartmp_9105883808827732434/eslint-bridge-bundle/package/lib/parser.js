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
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseExceptionCodeOf = exports.ParseExceptionCode = exports.unloadTypeScriptEslint = exports.buildParsingOptions = exports.buildSourceCode = void 0;
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
const fs = __importStar(require("fs"));
const babel = __importStar(require("@babel/eslint-parser"));
const eslint_1 = require("eslint");
const VueJS = __importStar(require("vue-eslint-parser"));
const tsEslintParser = __importStar(require("@typescript-eslint/parser"));
const context_1 = require("./context");
const babelParser = { parse: babel.parseForESLint, parser: '@babel/eslint-parser' };
const vueParser = { parse: VueJS.parseForESLint, parser: 'vue-eslint-parser' };
const tsParser = { parse: tsEslintParser.parseForESLint, parser: '@typescript-eslint/parser' };
function shouldTryTsParser() {
    const context = context_1.getContext();
    return context ? context.shouldUseTypeScriptParserForJS : true;
}
function buildSourceCode(input, language) {
    const vue = input.filePath.endsWith('.vue');
    let options, result;
    // ts (including .vue)
    if (language === 'ts') {
        options = buildParsingOptions(input, false, vue ? tsParser.parser : undefined);
        const parse = vue ? vueParser.parse : tsParser.parse;
        return parseForEslint(input, parse, options);
    }
    const tryTsParser = shouldTryTsParser();
    // .vue
    if (vue) {
        if (tryTsParser) {
            options = buildParsingOptions(input, false, tsParser.parser);
            result = parseForEslint(input, vueParser.parse, options);
            if (result instanceof eslint_1.SourceCode) {
                return result;
            }
            console.log(`DEBUG Failed to parse ${input.filePath} with TypeScript compiler: ${result.message}`);
        }
        options = buildParsingOptions(input, true, babelParser.parser);
        return parseForEslint(input, vueParser.parse, options);
    }
    // js
    return buildSourceCodeForJs(input, tryTsParser);
}
exports.buildSourceCode = buildSourceCode;
function buildSourceCodeForJs(input, tryTsParser) {
    if (tryTsParser) {
        const result = parseForEslint(input, tsParser.parse, buildParsingOptions(input, false));
        if (result instanceof eslint_1.SourceCode) {
            return result;
        }
        console.log(`DEBUG Failed to parse ${input.filePath} with TypeScript compiler: ${result.message}`);
    }
    const resultAsModule = parseForEslint(input, babelParser.parse, buildParsingOptions(input, true));
    if (resultAsModule instanceof eslint_1.SourceCode) {
        return resultAsModule;
    }
    const resultAsScript = parseForEslint(input, babelParser.parse, buildParsingOptions(input, true, undefined, 'script'));
    // prefer displaying parsing error as module if parsing as script also failed
    return resultAsScript instanceof eslint_1.SourceCode ? resultAsScript : resultAsModule;
}
function parseForEslint({ fileContent, filePath }, parse, options) {
    try {
        const text = fileContent || getFileContent(filePath);
        const result = parse(text, options);
        return new eslint_1.SourceCode({
            ...result,
            text,
            parserServices: result.services,
        });
    }
    catch ({ lineNumber, message }) {
        return {
            line: lineNumber,
            message,
            code: parseExceptionCodeOf(message),
        };
    }
}
function buildParsingOptions({ filePath, tsConfigs }, usingBabel = false, parserOption, sourceType = 'module') {
    const options = {
        tokens: true,
        comment: true,
        loc: true,
        range: true,
        ecmaVersion: 2018,
        sourceType,
        codeFrame: false,
        ecmaFeatures: {
            jsx: true,
            globalReturn: false,
            legacyDecorators: true,
        },
        // for Vue parser
        extraFileExtensions: ['.vue'],
        parser: parserOption,
        // for TS parser
        filePath,
        project: tsConfigs,
    };
    if (usingBabel) {
        return babelConfig(options);
    }
    return options;
}
exports.buildParsingOptions = buildParsingOptions;
function getFileContent(filePath) {
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
    return stripBom(fileContent);
}
function stripBom(s) {
    if (s.charCodeAt(0) === 0xfeff) {
        return s.slice(1);
    }
    return s;
}
function unloadTypeScriptEslint() {
    tsEslintParser.clearCaches();
}
exports.unloadTypeScriptEslint = unloadTypeScriptEslint;
var ParseExceptionCode;
(function (ParseExceptionCode) {
    ParseExceptionCode["Parsing"] = "PARSING";
    ParseExceptionCode["MissingTypeScript"] = "MISSING_TYPESCRIPT";
    ParseExceptionCode["UnsupportedTypeScript"] = "UNSUPPORTED_TYPESCRIPT";
    ParseExceptionCode["FailingTypeScript"] = "FAILING_TYPESCRIPT";
    ParseExceptionCode["GeneralError"] = "GENERAL_ERROR";
})(ParseExceptionCode = exports.ParseExceptionCode || (exports.ParseExceptionCode = {}));
// exported for testing
function parseExceptionCodeOf(exceptionMsg) {
    if (exceptionMsg.startsWith("Cannot find module 'typescript'")) {
        return ParseExceptionCode.MissingTypeScript;
    }
    else if (exceptionMsg.startsWith('You are using version of TypeScript')) {
        return ParseExceptionCode.UnsupportedTypeScript;
    }
    else if (exceptionMsg.startsWith('Debug Failure')) {
        return ParseExceptionCode.FailingTypeScript;
    }
    else {
        return ParseExceptionCode.Parsing;
    }
}
exports.parseExceptionCodeOf = parseExceptionCodeOf;
function babelConfig(config) {
    const pluginPath = `${__dirname}/../node_modules`;
    const babelOptions = {
        presets: [
            `${pluginPath}/@babel/preset-react`,
            `${pluginPath}/@babel/preset-flow`,
            `${pluginPath}/@babel/preset-env`,
        ],
        babelrc: false,
        configFile: false,
    };
    return { ...config, requireConfigFile: false, babelOptions };
}
//# sourceMappingURL=parser.js.map