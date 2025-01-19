# API Integration Copilot

An AI-powered VS Code extension that helps developers with API integration tasks, including type generation, documentation, and React Query implementation.

## Features

- **API Response Analysis**: Automatically analyze JSON responses and generate helpful insights
- **TypeScript Type Generation**: Generate TypeScript types from JSON responses
- **React Query Integration**: Generate React Query hooks and mutations from API specifications
- **AI-Powered**: Utilizes Mistral AI for intelligent code generation and analysis

## Installation

1. Install the extension from VS Code Marketplace
2. Set up your Mistral API key:
   - Get your API key from [Mistral AI Platform](https://console.mistral.ai/)
   - Open VS Code settings
   - Search for "API Copilot"
   - Add your Mistral API key in the settings

## Usage

### Analyzing API Responses

1. Select a JSON response in your editor
2. Right-click and select "API Copilot: Analyze API Response" or use the command palette
3. The extension will analyze the response and provide insights

Example:

```json
// Select this JSON response
{
  "user": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com",
    "preferences": {
      "theme": "dark",
      "notifications": true
    },
    "lastLogin": "2024-03-15T10:30:00Z"
  },
  "status": "active",
  "role": "admin"
}

// The extension will generate analysis
```

### Generating TypeScript Types

1. Select a JSON response in your editor
2. Right-click and select "API Copilot: Generate Types" or use the command palette
3. TypeScript types will be generated based on the JSON structure

Example:

```json
// Select this JSON response
{
  "products": [
    {
      "id": 1,
      "name": "Laptop",
      "price": 999.99,
      "inStock": true,
      "specs": {
        "cpu": "Intel i7",
        "ram": "16GB"
      }
    }
  ],
  "totalCount": 1
}

// The extension will generate types
```

### Generating React Query Implementation

1. Select an API specification in the following format:

Example:

```typescript
// Select this API specification
POST https://api.example.com/users
Content-Type: application/json

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user"
}

Response:
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "createdAt": "2024-03-15T10:30:00Z"
}

// The extension will generate React Query implementation:
```

2. Right-click and select "API Copilot: Generate React Query Implementation"
3. A complete React Query implementation will be generated

## Requirements

- VS Code 1.80.0 or higher
- Node.js and npm installed
- Mistral AI API key

## Development

1. Clone the repository:

```bash
git clone https://github.com/ujjwal502/api-integration-copilot.git
```

2. Install dependencies:

```bash
npm install
```

3. Open in VS Code:

```bash
code .
```

4. Press F5 to start debugging

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please file them in the [GitHub issues](https://github.com/ujjwal502/api-integration-copilot/issues) section.
