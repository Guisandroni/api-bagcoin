import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

export const getCarteiras = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const querySchema = z.object({
            userId: z.string().uuid('ID do usuário inválido').optional()
        })

        const { userId } = querySchema.parse(request.query)

        const carteiras = await prisma.carteira.findMany({
            where: userId ? {
                userId
            } : undefined,
            include: {
                despesas: true,
                receitas: true,
                metas: true
            }
        })

        return reply.status(200).send({ carteiras })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.status(400).send({ error: error.errors })
        }
        return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
}

export const getCarteiraById = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const paramsSchema = z.object({
            id: z.string().uuid('ID da carteira inválido')
        })

        const { id } = paramsSchema.parse(request.params)

        const carteira = await prisma.carteira.findUnique({
            where: {
                id
            },
            include: {
                despesas: true,
                receitas: true,
                metas: true
            }
        })

        if (!carteira) {
            return reply.status(404).send({ error: 'Carteira não encontrada' })
        }

        return reply.status(200).send({ carteira })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.status(400).send({ error: error.errors })
        }
        return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
} 