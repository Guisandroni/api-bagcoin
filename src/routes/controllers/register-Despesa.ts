
import { FastifyReply, FastifyRequest } from 'fastify'
import {z} from 'zod'
import { prisma } from '../../lib/prisma'

export const registerUser = async (request:FastifyRequest,reply:FastifyReply) =>{


    const paramsRegister = z.object({
        name:z.string(),
        email:z.string().email(),
        password: z.string()
    })

    const {name,email,password} = paramsRegister.parse(request.body)

     await prisma.user.create({
        data:{
            name,email,password
        }
    })

    return reply.status(201).send()
}