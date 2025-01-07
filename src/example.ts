import { ApiCopilot } from "./ApiCopilot";

async function main() {
  console.log("Starting API Copilot example...");

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

  console.log("Analyzing API response...");
  const analysis = await copilot.analyzeApiResponse(sampleResponse);
  console.log("Analysis completed");
  console.log("Analysis Result:");
  console.log(analysis);

  console.log("\nGetting error handling suggestions...");
  const errorHandling = await copilot.suggestErrorHandling("/api/users");
  console.log("Error handling suggestions completed");
  console.log("Error Handling Suggestions:");
  console.log(errorHandling);
}

main().catch((error) => {
  console.log(error.message, "error");
});
