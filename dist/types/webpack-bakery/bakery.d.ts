/// <reference types="webpack-dev-server" />
import { Configuration } from 'webpack';
import { IDoughConfig } from '../types';
export declare function formWebpackBase({ mode, outputPath, publicPath, sourcePath, buildPath, htmlConfig, additionalPlugins, chunkSplitPatterns, aliases: alias, enableStats, resolve }: IDoughConfig): Configuration;
