import { publicProcedure, router } from "./trpc.js";
import {email, z} from 'zod'

import { createHTTPServer } from "@trpc/server/adapters/standalone";

const todoInputType = z.object({
    title: z.string(),
    description: z.string()
})

const appRouter = router({
    createTodo: publicProcedure.
     input(todoInputType)
     .mutation(async (opts)=>{

        /// context
        let username = opts.ctx.username;
        console.log(username);
        

        const title = opts.input.title;
        const description = opts.input.description;

        //db stuff


        return {
            id : "1",
            message :"todo created"

        }
     }),
     signin: publicProcedure
    .input(z.object({
        email: z.string(),
        password: z.string()
    }))
    .mutation(async (opts) => {
       //context
        //    const username = opts.ctx.username;
        //    console.log(username);
           




        const email = opts.input.email;
        const password = opts.input.password;

        // validation
        // database stuff

        const token = "12345";

        return {
            token
        };
    })

},

)

const server = createHTTPServer({
    router:appRouter,
    createContext(opts){
        let authHeader = opts.req.headers["authorization"]
        console.log(authHeader);
        

        //jwt.verify 


        return{
            username:"undefined"
        }
    }
});

server.listen(3000)

export type Approuter = typeof appRouter;
