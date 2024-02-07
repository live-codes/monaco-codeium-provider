import type * as Monaco from "monaco-editor";
import { InlineCompletionProvider } from "./InlineCompletionProvider";
import { createConnectTransport } from "@connectrpc/connect-web";
import { createPromiseClient } from "@connectrpc/connect";
import { LanguageServerService } from "./api/proto/exa/language_server_pb/language_server_connect";
import { Status } from "./Status";

export const registerCodeiumProvider = (
  monaco: typeof Monaco,
  {
    onAutocomplete,
    baseUrl = "https://web-backend.codeium.com",
    apiKey,
  }: {
    onAutocomplete?: (acceptedText: string) => void;
    baseUrl?: string;
    apiKey?: string;
  } = {}
) => {
  let acceptedCompletionCount = 1;
  let completionCount = 0;
  const setCompletionCount = (count: number) => {
    completionCount = count;
  };

  let codeiumStatus = Status.INACTIVE;
  const setCodeiumStatus = (status: Status) => {
    codeiumStatus = status;
  };

  let codeiumStatusMessage = "";
  const setCodeiumStatusMessage = (message: string) => {
    codeiumStatusMessage = message;
  };

  const transport = createConnectTransport({
    baseUrl,
    useBinaryFormat: true,
  });

  const grpcClient = createPromiseClient(LanguageServerService, transport);

  const inlineCompletionsProvider = new InlineCompletionProvider(
    grpcClient,
    setCompletionCount,
    setCodeiumStatus,
    setCodeiumStatusMessage,
    apiKey
  );

  const providerDisposable = monaco.languages.registerInlineCompletionsProvider(
    { pattern: "**" },
    inlineCompletionsProvider
  );
  const completionDisposable = monaco.editor.registerCommand(
    "codeium.acceptCompletion",
    (_: unknown, completionId: string, insertText: string) => {
      try {
        if (typeof onAutocomplete === "function") {
          onAutocomplete(insertText);
        }
        acceptedCompletionCount = acceptedCompletionCount + 1;
        inlineCompletionsProvider.acceptedLastCompletion(completionId);
      } catch (err) {
        // console.log(err);
      }
    }
  );

  // // CORS pre-flight cache optimization.
  // try {
  //   grpcClient.getCompletions({});
  // } catch (e) {
  //   // This is expected.
  // }

  return {
    getCompletionCount: () => completionCount,
    getCodeiumStatus: () => codeiumStatus,
    getCodeiumStatusMessage: () => codeiumStatusMessage,
    getAcceptedCompletionCount: () => acceptedCompletionCount,
    dispose: () => {
      providerDisposable.dispose();
      completionDisposable.dispose();
    },
  };
};
