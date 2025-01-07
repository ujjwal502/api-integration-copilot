import * as vscode from "vscode";
import { ApiCopilot } from "./ApiCopilot";

export function activate(context: vscode.ExtensionContext) {
  const copilot = new ApiCopilot();

  let analyzeResponseCommand = vscode.commands.registerCommand(
    "api-copilot.analyzeResponse",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor");
        return;
      }

      const selection = editor.selection;
      const text = editor.document.getText(selection);

      try {
        const jsonData = JSON.parse(text);
        const analysis = await copilot.analyzeApiResponse(jsonData);

        await editor.edit((editBuilder) => {
          editBuilder.replace(selection, analysis);
        });
      } catch (error) {
        vscode.window.showErrorMessage(
          "Failed to analyze API response. Please ensure valid JSON is selected."
        );
      }
    }
  );

  let generateTypesCommand = vscode.commands.registerCommand(
    "api-copilot.generateTypes",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor");
        return;
      }

      const selection = editor.selection;
      const text = editor.document.getText(selection);

      try {
        const jsonData = JSON.parse(text);
        const types = await copilot.typeGenerator.generateTypes(jsonData);

        await editor.edit((editBuilder) => {
          editBuilder.replace(selection, types);
        });
      } catch (error) {
        vscode.window.showErrorMessage(
          "Failed to generate types. Please ensure valid JSON is selected."
        );
      }
    }
  );

  let generateWrapperCommand = vscode.commands.registerCommand(
    "api-copilot.generateWrapper",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor");
        return;
      }

      const selection = editor.selection;
      const text = editor.document.getText(selection);

      try {
        const apiSpec = JSON.parse(text);
        const wrapper = await copilot.generateApiWrapper(apiSpec);

        await editor.edit((editBuilder) => {
          editBuilder.replace(selection, wrapper);
        });
      } catch (error) {
        vscode.window.showErrorMessage(
          "Failed to generate API wrapper. Please ensure valid API spec is selected."
        );
      }
    }
  );

  context.subscriptions.push(analyzeResponseCommand);
  context.subscriptions.push(generateTypesCommand);
  context.subscriptions.push(generateWrapperCommand);
}

export function deactivate() {}
