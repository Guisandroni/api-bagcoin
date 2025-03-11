import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

export const getMetas = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const querySchema = z.object({
            carteiraId: z.string().uuid('ID da carteira inválido').optional()
        })

        const { carteiraId } = querySchema.parse(request.query)

        const metas = await prisma.meta.findMany({
            where: carteiraId ? {
                carteiraId
            } : undefined,
            orderBy: {
                created_at: 'desc'
            }
        })

        return reply.status(200).send({ metas })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.status(400).send({ error: error.errors })
        }
        return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
}

export const getMetaById = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const paramsSchema = z.object({
            id: z.string().uuid('ID da meta inválido')
        })

        const { id } = paramsSchema.parse(request.params)

        const meta = await prisma.meta.findUnique({
            where: {
                id
            }
        })

        if (!meta) {
            return reply.status(404).send({ error: 'Meta não encontrada' })
        }

        return reply.status(200).send({ meta })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.status(400).send({ error: error.errors })
        }
        return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
} 