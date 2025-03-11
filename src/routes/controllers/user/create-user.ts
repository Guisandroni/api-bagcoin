import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { hash } from 'bcryptjs'

export const createUser = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const createUserSchema = z.object({
            name: z.string().min(1, 'O nome é obrigatório'),
            email: z.string().email('Email inválido'),
            password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres')
        })

        const userData = createUserSchema.parse(request.body)

        // Verifica se já existe um usuário com o mesmo email
        const userExists = await prisma.user.findUnique({
            where: {
                email: userData.email
            }
        })

        if (userExists) {
            return reply.status(400).send({ error: 'Email já cadastrado' })
        }

        // Cria o usuário com a senha criptografada
        const passwordHash = await hash(userData.password, 6)

        const user = await prisma.user.create({
            data: {
                name: userData.name,
                email: userData.email,
                password: passwordHash
            }
        })

        return reply.status(201).send({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                created_at: user.created_at
            }
        })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.status(400).send({ error: error.errors })
        }
        return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
} 