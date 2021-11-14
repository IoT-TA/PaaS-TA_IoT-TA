import { Linter, SourceCode } from 'eslint';
import { AnalysisInput } from './analyzer';
export declare function buildSourceCode(input: AnalysisInput, language: 'ts' | 'js'): SourceCode | {
    line: any;
    message: any;
    code: ParseExceptionCode;
};
export declare function buildParsingOptions({ filePath, tsConfigs }: AnalysisInput, usingBabel?: boolean, parserOption?: string, sourceType?: 'script' | 'module'): Linter.ParserOptions;
export declare function unloadTypeScriptEslint(): void;
export declare type ParseException = {
    lineNumber?: number;
    message: string;
    code: string;
};
export declare enum ParseExceptionCode {
    Parsing = "PARSING",
    MissingTypeScript = "MISSING_TYPESCRIPT",
    UnsupportedTypeScript = "UNSUPPORTED_TYPESCRIPT",
    FailingTypeScript = "FAILING_TYPESCRIPT",
    GeneralError = "GENERAL_ERROR"
}
export declare function parseExceptionCodeOf(exceptionMsg: string): ParseExceptionCode;
