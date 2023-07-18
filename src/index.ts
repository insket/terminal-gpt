import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
import readlineSync from "readline-sync";
import colors from "colors";
import ora from "ora";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";


dotenv.config({
  path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env"),
});

const openAi = new OpenAIApi(
  new Configuration({
    basePath: "https://api.chatanywhere.cn/v1",
    apiKey: process.env.OPEN_API_KEY,
  })
);

const messages: Array<{ role: "user" | "assistant"; content: string }> = [];

(async () => {
  // if (!process.env.OPEN_API_KEY) {
  //   console.log("请先配置 open key");
  //   process.exit();
  // }
  while (true) {
    const userInput = readlineSync.question(colors.rainbow("You: "));

    if (userInput === "exit") {
      process.exit();
    }

    messages.push({ role: "user", content: userInput });
    let spinner = ora("loading.....\r").start();
    try {
      const chatCompletio = await openAi.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages,
      });

      const answer = chatCompletio.data.choices[0].message?.content;
      spinner.stop();
      messages.push({ role: "assistant", content: answer! });

      console.log(colors.red.bold("Bot: "), answer);
    } catch (error: any) {
      console.log(colors.red.bold("Bot: "), {
        code: error.response.status,
        data: error.response.data,
      });

      process.exit();
    }
  }
})();
