import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

export const getUserById = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const paramsSchema = z.object({
            id: z.string().uuid('ID do usuário inválido')
        })

        const { id } = paramsSchema.parse(request.params)

        const user = await prisma.user.findUnique({
            where: {
                id
            },
            include: {
                carteiras: true
            }
        })

        if (!user) {
            return reply.status(404).send({ error: 'Usuário não encontrado' })
        }

        return reply.status(200).send({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                created_at: user.created_at,
                carteiras: user.carteiras
            }
        })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.status(400).send({ error: error.errors })
        }
        return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
}

export const getUserByCarteira = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const paramsSchema = z.object({
            carteiraId: z.string().uuid('ID da carteira inválido')
        })

        const { carteiraId } = paramsSchema.parse(request.params)

        const carteira = await prisma.carteira.findUnique({
            where: {
                id: carteiraId
            },
            include: {
                user: true
            }
        })

        if (!carteira) {
            return reply.status(404).send({ error: 'Carteira não encontrada' })
        }

        return reply.status(200).send({
            user: {
                id: carteira.user.id,
                name: carteira.user.name,
                email: carteira.user.email,
                created_at: carteira.user.created_at
            }
        })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.status(400).send({ error: error.errors })
        }
        return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
} 