import esbuild from "esbuild";

/** @type esbuild.BuildOptions */
const baseOptions = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: true,
  sourcemap: true,
};

esbuild.build({
  ...baseOptions,
  outfile: "dist/index.js",
  format: "esm",
});

esbuild.build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.umd.js",
  format: "iife",
  globalName: "CodeiumProvider",
});
