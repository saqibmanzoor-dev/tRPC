import { createTRPCClient, createTRPCProxyClient, httpBatchLink } from "@trpc/client";


import type { Approuter } from "../server/index.js";



const trpc = createTRPCProxyClient<Approuter>({
    links:[
        httpBatchLink({
             url:"http://localhost:3000" ,

             async headers(){
                return {
                    authorization:"Brarer 1234"
                }
             },
        }),
       
    ],
})



async function main() {
        let response = await trpc.createTodo.mutate({
            title:"qwertyuiop",
            description:"QWERTYUI"
        })
    console.log(response);
    
        
    
}

main();




