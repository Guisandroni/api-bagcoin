import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

export const createCarteira = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const createCarteiraSchema = z.object({
            name: z.string().min(1, 'O nome é obrigatório'),
            balance: z.number().default(0),
            userId: z.string().uuid('ID do usuário inválido')
        })

        const { name, balance, userId } = createCarteiraSchema.parse(request.body)

        // Verifica se o usuário existe
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            return reply.status(404).send({ error: 'Usuário não encontrado' })
        }

        const carteira = await prisma.carteira.create({
            data: {
                name,
                balance: balance.toString(),
                userId
            }
        })

        return reply.status(201).send({
            carteira: {
                id: carteira.id,
                name: carteira.name,
                balance: carteira.balance,
                userId: carteira.userId,
                created_at: carteira.created_at
            }
        })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.status(400).send({ error: error.errors })
        }
        return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
} 