import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

export const createMeta = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const createMetaSchema = z.object({
            name: z.string().min(1, 'O nome é obrigatório'),
            description: z.string().optional(),
            valor: z.number().positive('O valor deve ser positivo'),
            dataFinal: z.string().datetime('Data final inválida'),
            carteiraId: z.string().uuid('ID da carteira inválido')
        })

        const metaData = createMetaSchema.parse(request.body)

        // Verifica se a carteira existe
        const carteira = await prisma.carteira.findUnique({
            where: {
                id: metaData.carteiraId
            }
        })

        if (!carteira) {
            return reply.status(404).send({ error: 'Carteira não encontrada' })
        }

        // Cria a meta
        const meta = await prisma.meta.create({
            data: {
                name: metaData.name,
                description: metaData.description,
                valor: metaData.valor.toString(),
                dataFinal: new Date(metaData.dataFinal),
                carteiraId: metaData.carteiraId
            }
        })

        return reply.status(201).send({
            meta: {
                id: meta.id,
                name: meta.name,
                description: meta.description,
                valor: meta.valor,
                dataFinal: meta.dataFinal,
                carteiraId: meta.carteiraId,
                created_at: meta.created_at
            }
        })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.status(400).send({ error: error.errors })
        }
        return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
} 