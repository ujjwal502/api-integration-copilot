import { createCompletion } from "../llm/mistralClient";

interface ApiDetails {
  method: string;
  url: string;
  headers: Record<string, string>;
  requestBody?: any;
  responseExample: any;
}

export class ReactQueryGenerator {
  async generateQuery(input: string): Promise<string> {
    try {
      if (!input.trim()) {
        throw new Error("Input is empty");
      }

      let apiDetails: ApiDetails;

      const lines = input.split("\n").map((line) => line.trim());

      const firstLine = lines[0];

      const [method, url] = firstLine.split(" ");
      if (!method || !url) {
        throw new Error(
          "First line must contain HTTP method and URL (e.g., 'GET https://api.example.com/users')"
        );
      }

      const headers: Record<string, string> = {};
      let currentSection = "headers";
      let responseLines: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];

        if (line.toLowerCase() === "response:") {
          currentSection = "response";
          continue;
        }

        // Skip empty lines
        if (!line) continue;

        if (currentSection === "headers") {
          const headerMatch = line.match(/^([^:]+):\s*(.+)$/);
          if (headerMatch) {
            headers[headerMatch[1].trim()] = headerMatch[2].trim();
          }
        } else if (currentSection === "response") {
          responseLines.push(line);
        }
      }

      // Parse response (required)
      let responseJson: any;
      try {
        responseJson = JSON.parse(responseLines.join(""));
      } catch (e) {
        console.error("Failed to parse response:", e);
        throw new Error("Invalid JSON in response");
      }

      if (!responseJson) {
        throw new Error("Response section is required");
      }

      apiDetails = {
        method: method.toUpperCase(),
        url,
        headers,
        responseExample: responseJson,
      };

      const prompt = `
        Generate a complete React Query implementation for the following API:

        API Details:
        Method: ${apiDetails.method}
        URL: ${apiDetails.url}
        Headers: ${JSON.stringify(apiDetails.headers, null, 2)}
        Response Example: ${JSON.stringify(apiDetails.responseExample, null, 2)}

        Follow this exact implementation pattern including all types (include in output):

        import {
          QueryClient,
          QueryClientProvider,
          useMutation,
          useQuery,
          useQueryClient,
        } from '@tanstack/react-query'
        import { type QueryFunction } from '@tanstack/react-query'

        // Type definitions
        type ResponseData = ${JSON.stringify(
          apiDetails.responseExample,
          null,
          2
        )}
        type QueryError = Error

        // Query function type
        type QueryKey = ['resourceName', { params: RequestParams }]
        type RequestParams = {
          // params based on API details
        }

        // Query function with proper types
        const fetchResource: QueryFunction<ResponseData, QueryKey> = async ({
          signal,
          queryKey: [_, { params }]
        }) => {
          // Implementation
        }

        // Hook with proper type annotations
        export function useResourceQuery(params: RequestParams) {
          const { status, data, isFetching, error, failureCount, refetch } = useQuery<
            ResponseData,
            QueryError,
            ResponseData,
            QueryKey
          >({
            queryKey: ['resourceName', { params }],
            queryFn: fetchResource,
          })
          
          return { status, data, isFetching, error, failureCount, refetch }
        }

        // Mutation with proper types
        export function useResourceMutation() {
          const queryClient = useQueryClient()
          
          return useMutation<ResponseData, QueryError, RequestParams>({
            mutationFn: async (variables) => {
              // Implementation
            },
            onSuccess: (data) => {
              queryClient.invalidateQueries({ queryKey: ['resourceName'] })
            },
          })
        }

        Generate the complete implementation following these type patterns exactly. Include all necessary type definitions, generics, and proper error handling.
        Do not include any explanatory comments in the output.
      `;

      const response = await createCompletion(prompt);

      const formattedResponse = this.formatResponse(response);

      return formattedResponse;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error in generateQuery:", errorMessage);
      throw new Error(`Failed to generate query: ${errorMessage}`);
    }
  }

  private formatResponse(response: string): string {
    return response
      .replace(/```typescript/g, "")
      .replace(/```/g, "")
      .trim();
  }
}
