/** @jsx h */
import { h, html } from "https://deno.land/x/htm@0.0.10/mod.tsx";
import { UnoCSS } from "https://deno.land/x/htm@0.0.10/plugins.ts";
import Background from "./background.tsx";
import { OpineRequest } from "https://deno.land/x/opine@2.3.3/mod.ts";

// enable UnoCSS
html.use(UnoCSS());

export const handler = (req: OpineRequest) =>
  html({
    title: "mateh.dev",
    body: (
      <div class="flex flex-col items-center justify-center w-full h-screen">
        <Background />

        <h1 class="text-xl font-medium">mateh.dev</h1>
        <div>Testing website deployment with Deno Deploy</div>

        <hr class="border-b my-4 border-gray-400" />
        <ul class="flex flex-row space-x-4">
          <li class="text-sm text-blue-500 hover:underline">
            <a href="/trpc">tRPC endpoint</a>
          </li>
        </ul>
      </div>
    ),
  });
