import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { z } from "zod";
import { publicProcedure, router } from "./trpc.js";

const appRouter = router({
  createTodo: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // A real application could use ctx.username to associate the todo with its author.
      console.log(`Creating a todo for ${ctx.username ?? "anonymous user"}`);

      // Replace this placeholder with a database insert.
      return {
        id: "1",
        message: `Todo created: ${input.title}`,
      };
    }),
  signin: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string().min(1) }))
    .mutation(async ({ input }) => {
      // Replace this placeholder with credential verification and token creation.
      console.log(`Sign-in requested for ${input.email}`);
      return { token: "example-token" };
    }),
});

const server = createHTTPServer({
  router: appRouter,
  createContext({ req }) {
    const authHeader = req.headers.authorization;
    console.log("Authorization header present:", Boolean(authHeader));

    // Verify credentials here before setting an authenticated username.
    return { username: undefined };
  },
});

server.listen(3000);

export type Approuter = typeof appRouter;
