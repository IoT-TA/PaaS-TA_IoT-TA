import { Rule } from 'eslint';
export declare enum FileType {
    MAIN = "MAIN",
    TEST = "TEST"
}
export declare function isMainCode(context: Rule.RuleContext): boolean;
export declare function isTestCode(context: Rule.RuleContext): boolean;
