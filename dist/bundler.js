#!/usr/bin/env node

import { OpenAIApi, Configuration } from 'openai';
import dotenv from 'dotenv';
import readlineSync from 'readline-sync';
import colors from 'colors';
import ora from 'ora';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

dotenv.config({
    path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env"),
});
const openAi = new OpenAIApi(new Configuration({
    basePath: "https://api.chatanywhere.cn/v1",
    apiKey: process.env.OPEN_API_KEY,
}));
const messages = [];
(() => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
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
            const chatCompletio = yield openAi.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages,
            });
            const answer = (_a = chatCompletio.data.choices[0].message) === null || _a === void 0 ? void 0 : _a.content;
            spinner.stop();
            messages.push({ role: "assistant", content: answer });
            console.log(colors.red.bold("Bot: "), answer);
        }
        catch (error) {
            console.log(colors.red.bold("Bot: "), {
                code: error.response.status,
                data: error.response.data,
            });
            process.exit();
        }
    }
}))();
