import { ApiCopilot } from "./ApiCopilot";

async function main() {
  const copilot = new ApiCopilot();

  // Example API response
  const sampleResponse = {
    data: {
      users: [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
        },
      ],
      pagination: {
        total: 100,
        page: 1,
      },
    },
  };

  // Generate types and documentation
  const analysis = await copilot.analyzeApiResponse(sampleResponse);
  console.log(analysis);

  // Get error handling suggestions
  const errorHandling = await copilot.suggestErrorHandling("/api/users");
  console.log(errorHandling);
}

main().catch(console.error);
