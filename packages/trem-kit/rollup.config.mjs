import { createConfig } from '../../shared/rollup.config.mjs';
import pkg from './package.json' with { type: 'json' };

export default createConfig(pkg);
