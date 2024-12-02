import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

/**
 * Create a base rollup config
 * @param {Record<string,any>} pkg Imported package.json
 * @param {string[]} external Imported package.json
 * @returns {import('rollup').RollupOptions}
 */
export function createConfig(pkg) {
  return {
    input: 'src/index.ts',
    onwarn: (warning) => {
      throw Object.assign(new Error(), warning);
    },
    strictDeprecations: true,
    output: [
      {
        format: 'cjs',
        file: pkg.main,
        exports: 'named',
        footer: 'module.exports = Object.assign(exports.default, exports);',
        sourcemap: true,
      },
      {
        format: 'es',
        file: pkg.module,
        plugins: [emitModulePackageFile()],
        sourcemap: true,
      },
    ],
    plugins: [
      typescript({
        sourceMap: true,
        tsconfig: 'tsconfig.json',
      }),
      terser(),
      nodeResolve({
        modulePaths: ['./shared']
      }),
    ],
  };
}

export function emitModulePackageFile() {
  return {
    name: 'emit-module-package-file',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'package.json',
        source: `{"type":"module"}`,
      });
    },
  };
}