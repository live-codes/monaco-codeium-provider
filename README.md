# Monaco Codeium Provider

AI auto-completion provider for Monaco editor powered by Codeium.

As used in [LiveCodes](https://livecodes.io).

Based on https://github.com/Exafunction/codeium-react-code-editor ([MIT License](https://github.com/Exafunction/codeium-react-code-editor/blob/cf3f020b3bf518bd1683f0b31df578e50ef93407/LICENSE))

## Installation

```bash
npm install @live-codes/monaco-codeium-provider
```

## Usage

```js
import { registerCodeiumProvider } from "@live-codes/monaco-codeium-provider";

const provider = registerCodeiumProvider(
  monaco,
  // optional config
  {
    languageServer: "https://web-backend.codeium.com",
    apiKey: "codeium-api-key",
    onAutocomplete: (acceptedText) => {
      // runs on completion
      console.log(acceptedText);
    },
    getEditors: () => {
      // return an array of other monaco editors that you want their content to be used for AI context
      // e.g. if the current editor is for JS, return HTML and CSS editors
      return [];
    },
  }
);

// to dispose
provider.dispose();
```
