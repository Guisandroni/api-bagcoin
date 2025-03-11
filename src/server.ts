
import fastify from 'fastify'
import { appRoutes } from './routes/routes'

const app = fastify()

app.register(appRoutes)

app.listen({
    port:3333,
    host:'0.0.0.0'
}).then(()=>{
    console.log('server online')
}).catch((err)=>{
    console.log(err)
})


