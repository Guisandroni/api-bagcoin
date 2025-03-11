import { FastifyReply, FastifyRequest } from 'fastify'
import {z} from 'zod'
import { prisma } from '../../lib/prisma'
import { hash } from 'bcryptjs'

export const registerUser = async (request:FastifyRequest,reply:FastifyReply) =>{
    try {
        const paramsRegister = z.object({
            name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
            email: z.string().email('Email inválido'),
            password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres')
        })

        const {name, email, password} = paramsRegister.parse(request.body)

        // Verifica se já existe um usuário com este email
        const userExists = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (userExists) {
            return reply.status(400).send({ error: 'Este email já está em uso' })
        }

        // Cria o hash da senha
        const hashedPassword = await hash(password, 8)

        // Cria o usuário
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })

        return reply.status(201).send({
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.status(400).send({ error: error.errors })
        }

        return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
}