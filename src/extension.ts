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
        const analysis = await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: "Analyzing API Response",
            cancellable: false,
          },
          async (progress) => {
            progress.report({ message: "Parsing JSON..." });
            const jsonData = JSON.parse(text);

            progress.report({ message: "Generating analysis..." });
            const result = await copilot.analyzeApiResponse(jsonData);

            progress.report({ message: "Applying changes..." });
            return result;
          }
        );

        await editor.edit((editBuilder) => {
          editBuilder.insert(selection.end, "\n\n" + analysis);
        });

        vscode.window.showInformationMessage(
          "API response analyzed successfully!"
        );
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
        const types = await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: "Generating TypeScript Types",
            cancellable: false,
          },
          async (progress) => {
            progress.report({ message: "Parsing JSON..." });
            const jsonData = JSON.parse(text);

            progress.report({ message: "Generating types..." });
            const result = await copilot.typeGenerator.generateTypes(jsonData);

            progress.report({ message: "Applying changes..." });
            return result;
          }
        );

        await editor.edit((editBuilder) => {
          editBuilder.insert(selection.end, "\n\n" + types);
        });

        vscode.window.showInformationMessage(
          "TypeScript types generated successfully!"
        );
      } catch (error) {
        vscode.window.showErrorMessage(
          "Failed to generate types. Please ensure valid JSON is selected."
        );
      }
    }
  );

  let generateReactQueryCommand = vscode.commands.registerCommand(
    "api-copilot.generateReactQuery",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        console.error("No active editor found");
        vscode.window.showErrorMessage("No active editor");
        return;
      }

      const selection = editor.selection;
      const selectedText = editor.document.getText(selection);

      try {
        const mutation = await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: "Generating React Query Implementation",
            cancellable: false,
          },
          async (progress) => {
            progress.report({ message: "Parsing API details..." });

            progress.report({ message: "Generating code..." });
            const result = await copilot.generateReactQueryMutation(
              selectedText
            );

            progress.report({ message: "Applying changes..." });
            return result;
          }
        );

        await editor.edit((editBuilder) => {
          editBuilder.insert(selection.end, "\n\n" + mutation);
        });

        vscode.window.showInformationMessage(
          "React Query implementation generated successfully!"
        );
      } catch (error) {
        console.error("Error in generateReactQuery:", error);
        if (error instanceof Error) {
          vscode.window.showErrorMessage(error.message);
        } else {
          vscode.window.showErrorMessage(
            `Failed to generate React Query implementation. Please use this format:
POST https://api.example.com/users
Content-Type: application/json

Request Body:
{
  "name": "John",
  "email": "john@example.com"
}

Response:
{
  "id": 123,
  "name": "John",
  "email": "john@example.com"
}`
          );
        }
      }
    }
  );

  context.subscriptions.push(analyzeResponseCommand);
  context.subscriptions.push(generateTypesCommand);
  context.subscriptions.push(generateReactQueryCommand);
}

export function deactivate() {}
