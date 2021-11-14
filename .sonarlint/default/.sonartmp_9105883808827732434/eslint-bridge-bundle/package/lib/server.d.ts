/// <reference types="node" />
import { Server } from 'http';
import { AnalysisInput, AnalysisResponse } from './analyzer';
export declare function start(port?: number, host?: string, additionalRuleBundles?: string[]): Promise<Server>;
declare type AnalysisFunction = (input: AnalysisInput) => AnalysisResponse;
export declare function startServer(analyzeJS: AnalysisFunction, analyzeTS: AnalysisFunction, port?: number, host?: string, additionalRuleBundles?: string[]): Promise<Server>;
export {};
