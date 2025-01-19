import { spawn } from "child_process";

export async function createCompletion(
  prompt: string,
  timeoutMs: number = 30000
): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log("Starting Ollama process...");
    const ollama = spawn("ollama", ["run", "mistral", prompt], {
      stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";
    let timer: NodeJS.Timeout;

    const cleanup = () => {
      console.log("Cleaning up Ollama process...");
      clearTimeout(timer);
      ollama.kill();
    };

    timer = setTimeout(() => {
      cleanup();
      const error = "Ollama request timed out";
      console.error(error);
      reject(new Error(error));
    }, timeoutMs);

    ollama.stdout.on("data", (data) => {
      const text = data.toString();
      console.log("Ollama stdout:", text);
      output += text;

      clearTimeout(timer);
      timer = setTimeout(() => {
        cleanup();
        const error = "Ollama request timed out";
        console.error(error);
        reject(new Error(error));
      }, timeoutMs);
    });

    ollama.stderr.on("data", (data) => {
      const text = data.toString();
      if (!text.includes("?25") && !text.includes("")) {
        console.error("Ollama stderr:", text);
      }
    });

    ollama.on("close", (code) => {
      cleanup();
      console.log("Ollama process closed with code:", code);

      if (code === 0) {
        console.log("Mistral completion finished successfully");
        resolve(output.trim());
      } else {
        const error = `Process exited with code ${code}`;
        console.error(error);
        reject(new Error(error));
      }
    });

    process.on("SIGINT", () => {
      cleanup();
      console.log("Request canceled by user");
      process.exit(1);
    });
  });
}
