/// <reference types="webpack-dev-server" />
import { Configuration } from 'webpack';
import { IBaseConfig, IDoughConfig } from '../types';
export declare const cookDough: (baseConfig: IBaseConfig) => IDoughConfig;
export declare const bakeBaseConfig: (doughConfig: IDoughConfig) => Configuration;
