import { spawn } from "child_process";

async function ensureMistralModel(): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log("Checking if Mistral model is available...");
    const pull = spawn("ollama", ["pull", "mistral"]);

    pull.stdout.on("data", (data) => {
      const text = data.toString();
      if (text.includes("success")) {
        console.log("Mistral model downloaded successfully");
      } else {
        console.log(text, "info", "model-pull");
      }
    });

    pull.stderr.on("data", (data) => {
      const text = data.toString();
      if (!text.includes("pulling manifest") && !text.includes("...")) {
        console.log(text, "error");
      }
    });

    pull.on("close", (code) => {
      if (code === 0) {
        console.log("Mistral model is ready");
        resolve();
      } else {
        const error = `Failed to pull Mistral model. Exit code: ${code}`;
        console.log(error, "error");
        reject(new Error(error));
      }
    });
  });
}

export async function createCompletion(
  prompt: string,
  timeoutMs: number = 30000
): Promise<string> {
  await ensureMistralModel();

  return new Promise((resolve, reject) => {
    console.log("Sending prompt to Mistral...");
    console.log(`Prompt: ${prompt}`);

    const ollama = spawn("ollama", ["run", "mistral", prompt], {
      stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";
    let timer: NodeJS.Timeout;

    const cleanup = () => {
      clearTimeout(timer);
      ollama.kill();
    };

    timer = setTimeout(() => {
      cleanup();
      const error = "Ollama request timed out";
      console.log(error, "error");
      reject(new Error(error));
    }, timeoutMs);

    ollama.stdout.on("data", (data) => {
      const text = data.toString();
      process.stdout.write(text);
      output += text;
      console.log(text, "info", "model-response");

      clearTimeout(timer);
      timer = setTimeout(() => {
        cleanup();
        const error = "Ollama request timed out";
        console.log(error, "error");
        reject(new Error(error));
      }, timeoutMs);
    });

    ollama.stderr.on("data", (data) => {
      const text = data.toString();
      if (!text.includes("?25") && !text.includes("")) {
        console.log(text, "error");
      }
    });

    ollama.on("close", (code) => {
      cleanup();

      if (code === 0) {
        console.log("Mistral completion finished");
        resolve(output.trim());
      } else {
        const error = `Process exited with code ${code}`;
        console.log(error, "error");
        reject(new Error(error));
      }
    });

    process.on("SIGINT", () => {
      cleanup();
      console.log("Request canceled by user", "error");
      process.exit(1);
    });
  });
}
