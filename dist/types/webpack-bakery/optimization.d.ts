/// <reference types="webpack" />
/// <reference types="webpack-dev-server" />
import { ManthaMode } from '../types';
declare const _default: (mode: ManthaMode, chunkSplitPatterns: RegExp[]) => import("webpack").Options.Optimization | undefined;
export default _default;
