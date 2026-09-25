# tRPC project notes

This project is a small TypeScript example of a tRPC server and client. The server is in `server/`; `client/index.ts` makes a request to it. It uses tRPC v11, Zod, and the standalone HTTP adapter.

## Run the example

Install dependencies:

```sh
npm install
```

Start the server in one terminal:

```sh
npx tsx server/index.ts
```

Then run the client in another terminal:

```sh
npx tsx client/index.ts
```

The server listens on port `3000`. The example uses placeholder values and does not connect to a database or perform real authentication.

## tRPC concepts in this project

### Initialize tRPC and define context

`server/trpc.ts` calls `initTRPC.context<...>().create()` to set the shared context type. Context is request-scoped data made available to procedures, often a user identity or database connection. Here, the type has an optional `username`.

`server/index.ts` creates context for each HTTP request and reads its `authorization` header. It currently returns the placeholder username `"undefined"`; it does not verify the header or authenticate a user.

### Procedures: queries and mutations

A procedure is an API operation. Queries are intended for reading data, while mutations represent changes. This example defines two mutations with `publicProcedure`:

- `createTodo` accepts a title and description and returns a placeholder result.
- `signin` accepts an email and password and returns a placeholder token.

Both are public procedures, so the code does not require authentication to call them. There is no query in the current router.

### Routers and inferred API types

`router(...)` groups procedures into `appRouter`, the server's root router. The server exports `Approuter = typeof appRouter`. The client imports that type and supplies it to `createTRPCProxyClient<Approuter>`, so procedure names, inputs, and return values are inferred from the server definitions rather than duplicated by hand.

The type import is for TypeScript; it does not bundle the server implementation into the client. The client sends HTTP requests to the server at runtime.

### Zod input validation

Each procedure uses `.input(z.object(...))` to declare its input schema. tRPC uses the Zod schema to validate incoming data at runtime and to infer the corresponding TypeScript input type. The current schemas only require string values; add application-specific constraints such as `.min(1)` or `.email()` when needed.

## Client request flow

The client builds a proxy with `httpBatchLink` pointing at `http://localhost:3000`, then calls `trpc.createTodo.mutate(...)`. The link can send multiple operations in a batched HTTP request. The example also sends an `authorization` header, but the server does not validate it.

## Files to know

- `server/trpc.ts` — tRPC initialization, context type, and public procedure helper
- `server/index.ts` — Zod schemas, procedures, root router, context creation, and HTTP server
- `client/index.ts` — typed tRPC client and example mutation call
- `tsconfig.json` — TypeScript compiler options

## Revision summary

Remember the relationship: the server defines a typed router; procedures attach input schemas and handlers; context carries request-specific values; the client imports the router type and calls its procedures through a transport link. This code is a learning scaffold, so replace the placeholder context, token, and mutation results with verified authentication and persistent application logic before using it as an application backend.
