import { Language } from "./api/proto/exa/codeium_common_pb/codeium_common_pb";

/**
 * Get the current URL of the window. If this fails, a null string is returned.
 * @returns The current URL
 */
export const getCurrentURL = () => {
  try {
    return window.location.origin;
  } catch (e) {
    return null;
  }
};

/**
 * Get the current package version. If this fails, a null string is returned.
 */
export const getPackageVersion = () => {
  return "1.0.10";
};

/**
 * Returns the number of UTF-8 bytes required to represent the given Unicode code point.
 *
 * @param {number} codePointValue - The Unicode code point value.
 * @return {number} The number of UTF-8 bytes needed to represent the code point.
 */
function numUtf8BytesForCodePoint(codePointValue: number): number {
  if (codePointValue < 0x80) {
    return 1;
  }
  if (codePointValue < 0x800) {
    return 2;
  }
  if (codePointValue < 0x10000) {
    return 3;
  }
  return 4;
}

/**
 * Calculates for some prefix of the given text, how many bytes the UTF-8
 * representation would be. Undefined behavior if the number of code units
 * doesn't correspond to a valid UTF-8 sequence.
 * @param text - Text to examine.
 * @param numCodeUnits The number of code units to look at.
 * @returns The number of bytes.
 */
export function numCodeUnitsToNumUtf8Bytes(
  text: string,
  numCodeUnits?: number
): number {
  if (numCodeUnits === 0) {
    return 0;
  }
  let curNumUtf8Bytes = 0;
  let curNumCodeUnits = 0;
  for (const codePoint of text) {
    curNumCodeUnits += codePoint.length;
    curNumUtf8Bytes += numUtf8BytesForCodePoint(codePoint.codePointAt(0)!);
    if (numCodeUnits !== undefined && curNumCodeUnits >= numCodeUnits) {
      break;
    }
  }
  return curNumUtf8Bytes;
}

export function numUtf8BytesToNumCodeUnits(
  text: string,
  numUtf8Bytes?: number
): number {
  if (numUtf8Bytes === 0) {
    return 0;
  }
  let curNumCodeUnits = 0;
  let curNumUtf8Bytes = 0;
  for (const codePoint of text) {
    curNumUtf8Bytes += numUtf8BytesForCodePoint(codePoint.codePointAt(0)!);
    curNumCodeUnits += codePoint.length;
    if (numUtf8Bytes !== undefined && curNumUtf8Bytes >= numUtf8Bytes) {
      break;
    }
  }
  return curNumCodeUnits;
}

/**
 * Generates a random UUID.
 */
export const uuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Converts a language ID to a strongly-typed enum value.
 */
export const languageIdToEnum = (languageId: string): Language => {
  switch (languageId.toLowerCase()) {
    case "c":
      return Language.C;
    case "clojure":
      return Language.CLOJURE;
    case "coffeescript":
      return Language.COFFEESCRIPT;
    case "cpp":
      return Language.CPP;
    case "csharp":
      return Language.CSHARP;
    case "css":
      return Language.CSS;
    case "cudacpp":
      return Language.CUDACPP;
    case "dockerfile":
      return Language.DOCKERFILE;
    case "go":
      return Language.GO;
    case "groovy":
      return Language.GROOVY;
    case "handlebars":
      return Language.HANDLEBARS;
    case "haskell":
      return Language.HASKELL;
    case "hcl":
      return Language.HCL;
    case "html":
      return Language.HTML;
    case "ini":
      return Language.INI;
    case "java":
      return Language.JAVA;
    case "javascript":
      return Language.JAVASCRIPT;
    case "json":
      return Language.JSON;
    case "julia":
      return Language.JULIA;
    case "kotlin":
      return Language.KOTLIN;
    case "latex":
      return Language.LATEX;
    case "less":
      return Language.LESS;
    case "lua":
      return Language.LUA;
    case "makefile":
      return Language.MAKEFILE;
    case "markdown":
      return Language.MARKDOWN;
    case "objectivec":
      return Language.OBJECTIVEC;
    case "objectivecpp":
      return Language.OBJECTIVECPP;
    case "perl":
      return Language.PERL;
    case "php":
      return Language.PHP;
    case "plaintext":
      return Language.PLAINTEXT;
    case "protobuf":
      return Language.PROTOBUF;
    case "pbtxt":
      return Language.PBTXT;
    case "python":
      return Language.PYTHON;
    case "r":
      return Language.R;
    case "ruby":
      return Language.RUBY;
    case "rust":
      return Language.RUST;
    case "sass":
      return Language.SASS;
    case "scala":
      return Language.SCALA;
    case "scss":
      return Language.SCSS;
    case "shell":
      return Language.SHELL;
    case "sql":
      return Language.SQL;
    case "starlark":
      return Language.STARLARK;
    case "swift":
      return Language.SWIFT;
    case "tsx":
      return Language.TSX;
    case "typescript":
      return Language.TYPESCRIPT;
    case "visualbasic":
      return Language.VISUALBASIC;
    case "vue":
      return Language.VUE;
    case "xml":
      return Language.XML;
    case "xsl":
      return Language.XSL;
    case "yaml":
      return Language.YAML;
    case "svelte":
      return Language.SVELTE;
    case "toml":
      return Language.TOML;
    case "dart":
      return Language.DART;
    case "rst":
      return Language.RST;
    case "ocaml":
      return Language.OCAML;
    case "cmake":
      return Language.CMAKE;
    case "pascal":
      return Language.PASCAL;
    case "elixir":
      return Language.ELIXIR;
    case "fsharp":
      return Language.FSHARP;
    case "lisp":
      return Language.LISP;
    case "matlab":
      return Language.MATLAB;
    case "powershell":
      return Language.POWERSHELL;
    case "solidity":
      return Language.SOLIDITY;
    case "ada":
      return Language.ADA;
    case "ocaml_interface":
      return Language.OCAML_INTERFACE;
    default:
      return Language.UNSPECIFIED;
  }
};
