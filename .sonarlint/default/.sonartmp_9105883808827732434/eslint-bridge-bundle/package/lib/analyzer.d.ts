import { ParseExceptionCode } from './parser';
import { Highlight } from './runner/highlighter';
import { Metrics } from './runner/metrics';
import { CpdToken } from './runner/cpd';
import { HighlightedSymbol } from './runner/symbol-highlighter';
import { AdditionalRule } from './linter';
export declare const EMPTY_RESPONSE: AnalysisResponse;
export declare const SYMBOL_HIGHLIGHTING_RULE: AdditionalRule;
export declare const COGNITIVE_COMPLEXITY_RULE: AdditionalRule;
export interface AnalysisInput {
    filePath: string;
    fileType?: string;
    fileContent: string | undefined;
    ignoreHeaderComments?: boolean;
    tsConfigs?: string[];
}
export interface Rule {
    key: string;
    configurations: any[];
}
export interface AnalysisResponse {
    parsingError?: ParsingError;
    issues: Issue[];
    highlights?: Highlight[];
    highlightedSymbols?: HighlightedSymbol[];
    metrics?: Metrics;
    cpdTokens?: CpdToken[];
}
export interface ParsingError {
    line?: number;
    message: string;
    code: ParseExceptionCode;
}
export interface Issue {
    column: number;
    line: number;
    endColumn?: number;
    endLine?: number;
    ruleId: string;
    message: string;
    cost?: number;
    secondaryLocations: IssueLocation[];
}
export interface IssueLocation {
    column: number;
    line: number;
    endColumn: number;
    endLine: number;
    message?: string;
}
export declare function analyzeJavaScript(input: AnalysisInput): AnalysisResponse;
export declare function analyzeTypeScript(input: AnalysisInput): AnalysisResponse;
export declare function initLinter(rules: Rule[], environments?: string[], globals?: string[]): void;
export declare function loadCustomRuleBundle(bundlePath: string): string[];
export declare function getHighlightedSymbols(issues: Issue[]): any;
export declare function getCognitiveComplexity(issues: Issue[]): number;
