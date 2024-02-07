# Monaco Codeium Provider

AI auto-completion provider for Monaco editor powered by Codeium.

As used in [LiveCodes](https://livecodes.io).

Based on https://github.com/Exafunction/codeium-react-code-editor

## Installation

```bash
npm install @live-codes/monaco-codeium-provider
```

## Usage

```js
import { registerCodeiumProvider } from "@live-codes/monaco-codeium-provider";

const provider = registerCodeiumProvider(monaco, {
  // optional
  onAutocomplete: (message) => {
    console.log(message);
  },
});

// to dispose
provider.dispose();
```
