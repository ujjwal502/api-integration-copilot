import { createCompletion } from "../llm/mistralClient";

export class TypeGenerator {
  async generateTypes(apiResponse: any): Promise<string> {
    const prompt = `
        Generate TypeScript interfaces for the following API response:
        ${JSON.stringify(apiResponse, null, 2)}
        
        Please create detailed and well-documented interfaces.
        `;

    const response = await createCompletion(prompt);
    return this.formatTypeDefinitions(response);
  }

  private formatTypeDefinitions(llmResponse: string): string {
    // Clean up and format the LLM response
    return llmResponse
      .replace(/```typescript/g, "")
      .replace(/```/g, "")
      .trim();
  }
}
