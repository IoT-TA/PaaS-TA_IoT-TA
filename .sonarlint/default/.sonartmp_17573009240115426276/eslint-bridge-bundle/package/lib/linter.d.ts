import { Linter, SourceCode, Rule as ESLintRule } from 'eslint';
import { Rule, Issue } from './analyzer';
export interface AdditionalRule {
    ruleId: string;
    ruleModule: ESLintRule.RuleModule;
    ruleConfig: any[];
    activateAutomatically?: boolean;
}
export declare class LinterWrapper {
    linter: Linter;
    linterConfig: Linter.Config;
    rules: Map<string, ESLintRule.RuleModule>;
    /**
     * 'additionalRules' - rules used for computing metrics (incl. highlighting) when it requires access to the rule context; resulting value is encoded in the message
     * and custom rules provided by additional rule bundles
     */
    constructor(rules: Rule[], additionalRules?: AdditionalRule[], environments?: string[], globals?: string[]);
    createLinterConfig(inputRules: Rule[], additionalRules: AdditionalRule[], environments: string[], globals: string[]): Linter.Config<Linter.RulesRecord>;
    analyze(sourceCode: SourceCode, filePath: string, fileType?: string): {
        issues: Issue[];
    };
}
export declare function decodeSonarRuntimeIssue(ruleModule: ESLintRule.RuleModule | undefined, issue: Issue): Issue | null;
/**
 * 'sonar-runtime' is the option used by eslint-plugin-sonarjs rules to distinguish
 *  when they are executed in a sonar* context or in eslint
 *
 *  'sonar-context' is the option to distinguish rules which require context as part of their options
 *
 * exported for testing
 */
export declare function getRuleConfig(ruleModule: ESLintRule.RuleModule | undefined, inputRule: Rule): any[];
