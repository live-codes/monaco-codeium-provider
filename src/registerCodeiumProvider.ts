import type * as Monaco from "monaco-editor";
import { InlineCompletionProvider } from "./InlineCompletionProvider";
import { createConnectTransport } from "@connectrpc/connect-web";
import { createPromiseClient } from "@connectrpc/connect";
import { LanguageServerService } from "./api/proto/exa/language_server_pb/language_server_connect";
import { Document as DocumentInfo } from "./api/proto/exa/language_server_pb/language_server_pb";
import { Status } from "./Status";
import { languageIdToEnum } from "./utils";

export const registerCodeiumProvider = (
  monaco: typeof Monaco,
  {
    onAutocomplete,
    languageServer = "https://web-backend.codeium.com",
    apiKey,
    getEditors = () => [],
  }: {
    onAutocomplete?: (acceptedText: string) => void;
    languageServer?: string;
    apiKey?: string;
    getEditors?: () => Monaco.editor.IStandaloneCodeEditor[];
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
    baseUrl: languageServer,
    useBinaryFormat: true,
  });

  const grpcClient = createPromiseClient(LanguageServerService, transport);

  const inlineCompletionsProvider = new InlineCompletionProvider(
    grpcClient,
    setCompletionCount,
    setCodeiumStatus,
    setCodeiumStatusMessage,
    getEditorDocuments,
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

  function getEditorDocuments(
    currentEditorModel: Monaco.editor.ITextModel
  ): DocumentInfo[] {
    const documents: DocumentInfo[] = [];
    getEditors().forEach((editor) => {
      const model = editor.getModel();
      if (!model || model === currentEditorModel) return;
      documents.push(
        new DocumentInfo({
          absolutePath: model.uri.path,
          relativePath: model.uri.path.startsWith("/")
            ? model.uri.path.slice(1)
            : model.uri.path,
          text: editor.getValue(),
          editorLanguage: model.getLanguageId(),
          language: languageIdToEnum(model.getLanguageId()),
        })
      );
    });
    return documents;
  }

  // CORS pre-flight cache optimization.
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
