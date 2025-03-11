import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

export const getReceitas = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const querySchema = z.object({
            carteiraId: z.string().uuid('ID da carteira inválido').optional()
        })

        const { carteiraId } = querySchema.parse(request.query)

        const receitas = await prisma.receita.findMany({
            where: carteiraId ? {
                carteiraId
            } : undefined,
            orderBy: {
                data: 'desc'
            }
        })

        return reply.status(200).send({ receitas })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.status(400).send({ error: error.errors })
        }
        return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
}

export const getReceitaById = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const paramsSchema = z.object({
            id: z.string().uuid('ID da receita inválido')
        })

        const { id } = paramsSchema.parse(request.params)

        const receita = await prisma.receita.findUnique({
            where: {
                id
            }
        })

        if (!receita) {
            return reply.status(404).send({ error: 'Receita não encontrada' })
        }

        return reply.status(200).send({ receita })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.status(400).send({ error: error.errors })
        }
        return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
} 