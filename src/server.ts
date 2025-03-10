
import fastify from 'fastify'
import { appRoutes } from './routes/route'

const app = fastify()

app.register(appRoutes)

app.listen({
    port:3333
}).then(()=>{
    console.log('server online')
})
