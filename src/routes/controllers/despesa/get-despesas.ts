import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

export const getDespesas = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const querySchema = z.object({
            carteiraId: z.string().uuid('ID da carteira inválido').optional()
        })

        const { carteiraId } = querySchema.parse(request.query)

        const despesas = await prisma.despesa.findMany({
            where: carteiraId ? {
                carteiraId
            } : undefined,
            orderBy: {
                data: 'desc'
            }
        })

        return reply.status(200).send({ despesas })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.status(400).send({ error: error.errors })
        }
        return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
}

export const getDespesaById = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const paramsSchema = z.object({
            id: z.string().uuid('ID da despesa inválido')
        })

        const { id } = paramsSchema.parse(request.params)

        const despesa = await prisma.despesa.findUnique({
            where: {
                id
            }
        })

        if (!despesa) {
            return reply.status(404).send({ error: 'Despesa não encontrada' })
        }

        return reply.status(200).send({ despesa })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.status(400).send({ error: error.errors })
        }
        return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
} 