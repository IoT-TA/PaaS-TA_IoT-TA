import { ParseExceptionCode } from './parser';
import * as ts from 'typescript';
export declare function getFilesForTsConfig(tsConfig: string, parseConfigHost?: ts.ParseConfigHost): {
    files: string[];
    projectReferences: string[];
} | {
    error: string;
    errorCode?: ParseExceptionCode;
};
