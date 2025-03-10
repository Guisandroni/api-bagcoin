import { FastifyInstance } from "fastify"
import { registerUser } from "./controllers/user-register"


export const appRoutes = (app:FastifyInstance) =>{

    app.get('/users',registerUser)
}