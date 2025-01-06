import { createCompletion } from "../llm/mistralClient";

export class DocumentationGenerator {
  async generateDocs(apiResponse: any): Promise<string> {
    const prompt = `
      Generate comprehensive documentation for the following API response:
      ${JSON.stringify(apiResponse, null, 2)}
      
      Please include:
      - Description of each field
      - Data types
      - Example usage
      - Any constraints or special cases
    `;

    const response = await createCompletion(prompt);
    return this.formatDocumentation(response);
  }

  private formatDocumentation(llmResponse: string): string {
    return llmResponse
      .replace(/```markdown/g, "")
      .replace(/```/g, "")
      .trim();
  }
}
