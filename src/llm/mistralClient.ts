import { spawn } from "child_process";

export async function createCompletion(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const ollama = spawn("ollama", ["run", "mistral", prompt]);
    let output = "";

    ollama.stdout.on("data", (data) => {
      output += data.toString();
    });

    ollama.stderr.on("data", (data) => {
      console.error(`Error: ${data}`);
    });

    ollama.on("close", (code) => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });
  });
}
