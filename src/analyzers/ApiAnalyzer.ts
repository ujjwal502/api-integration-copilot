import { createCompletion } from "../llm/mistralClient";

export interface ApiAnalysis {
  endpoints: EndpointInfo[];
  baseUrl: string;
  authMethod: string;
  version: string;
}

interface EndpointInfo {
  path: string;
  method: string;
  parameters: ParameterInfo[];
  responseType: string;
  description: string;
}

interface ParameterInfo {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export class ApiAnalyzer {
  async analyze(apiSpec: any): Promise<ApiAnalysis> {
    const prompt = `
      Analyze the following API specification and provide structured information:
      ${JSON.stringify(apiSpec, null, 2)}
      
      Return a JSON object with:
      - List of endpoints
      - Authentication method
      - Base URL
      - API version
      - Parameter details for each endpoint
    `;

    const response = await createCompletion(prompt);
    return JSON.parse(this.cleanResponse(response));
  }

  private cleanResponse(response: string): string {
    // Extract JSON from the response if wrapped in code blocks
    const jsonMatch = response.match(/```json\n?(.*)\n?```/s);
    return jsonMatch ? jsonMatch[1] : response;
  }
}
