import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { Approuter } from "../server/index.js";

const trpc = createTRPCProxyClient<Approuter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000",
      async headers() {
        return { authorization: "Bearer example-token" };
      },
    }),
  ],
});

async function main() {
  const response = await trpc.createTodo.mutate({
    title: "Read the tRPC docs",
    description: "Explore procedures, routers, and context",
  });
  console.log(response);
}

main().catch((error: unknown) => {
  console.error("Client request failed:", error);
});
