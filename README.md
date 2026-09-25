# tRPC TypeScript example

A small, end-to-end tRPC example using the standalone HTTP adapter, a typed server context, Zod input validation, and the tRPC client. The server exposes `createTodo` and `signin`; the client calls `createTodo` with compile-time types inferred from the server router.

## Requirements

- Node.js 20 or newer
- npm

## Setup

```sh
npm install
```

Start the server in one terminal and leave it running:

```sh
npm run dev:server
```

In another terminal, run the example client:

```sh
npm run dev:client
```

The server listens on `http://localhost:3000`. It uses in-memory placeholder behavior; no database or real authentication provider is configured.

## How the pieces fit together

### Context

Context is request-scoped data that procedures can use, commonly an authenticated user, database connection, or request metadata. `server/index.ts` creates context for each incoming HTTP request. `server/trpc.ts` passes the context shape to `initTRPC`, so `opts.ctx` is typed inside every procedure.

This example includes a placeholder `username` in context and reads the `authorization` header. Replace the placeholder with verified authentication and a real user lookup before relying on it; a header by itself is not proof of identity.

### Procedures

A procedure is an endpoint in a tRPC API. Queries read data; mutations change data. Procedures can define validated input and access typed context. `createTodo` is a mutation that accepts a title and description. `signin` is a mutation that accepts an email and password and returns a placeholder token.

### Routers

A router groups procedures into an API. The `appRouter` in `server/index.ts` is the root router. Exporting its type as `Approuter` lets the client import the API type without duplicating endpoint definitions. The TypeScript type is erased at runtime; the client still sends ordinary HTTP requests.

### Zod input validation

The schemas in `server/index.ts` validate inputs at runtime and also provide TypeScript inference. Invalid inputs are rejected by tRPC before the mutation handler runs. Extend these schemas with constraints such as `.min(1)` or `.email()` to match the requirements of your application.

## Example call

The client creates a typed proxy using the server router type and an HTTP batch link:

```ts
const trpc = createTRPCProxyClient<Approuter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000",
      headers: async () => ({ authorization: "Bearer example-token" }),
    }),
  ],
});

const result = await trpc.createTodo.mutate({
  title: "Read the tRPC docs",
  description: "Explore procedures, routers, and context",
});
```

The proxy provides typed procedure names, inputs, and results based on `Approuter`. The token above is only an example; the server currently does not validate it.

## Project layout

```text
client/index.ts    Example typed client call
server/index.ts    Procedures, root router, context, and HTTP server
server/trpc.ts     tRPC initialization and shared procedure helpers
```

## Available scripts

- `npm run dev:server` — start the server with `tsx`
- `npm run dev:client` — run the client example with `tsx`
- `npm run typecheck` — check TypeScript types without emitting build output

## Next steps

Add persistence behind the mutations, verify authentication when constructing context, and add protected procedures for endpoints that require a signed-in user. For a web application, mount a suitable tRPC adapter and use the matching client integration for your framework.
