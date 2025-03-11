import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

export const updateMeta = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const paramsSchema = z.object({
            id: z.string().uuid('ID da meta inválido')
        })

        const updateMetaSchema = z.object({
            name: z.string().min(1, 'O nome é obrigatório').optional(),
            description: z.string().optional(),
            valor: z.number().positive('O valor deve ser positivo').optional(),
            dataFinal: z.string().datetime('Data final inválida').optional()
        })

        const { id } = paramsSchema.parse(request.params)
        const updateData = updateMetaSchema.parse(request.body)

        // Verifica se a meta existe
        const meta = await prisma.meta.findUnique({
            where: {
                id
            }
        })

        if (!meta) {
            return reply.status(404).send({ error: 'Meta não encontrada' })
        }

        // Atualiza a meta
        const updatedMeta = await prisma.meta.update({
            where: {
                id
            },
            data: {
                name: updateData.name,
                description: updateData.description,
                valor: updateData.valor ? updateData.valor.toString() : undefined,
                dataFinal: updateData.dataFinal ? new Date(updateData.dataFinal) : undefined
            }
        })

        return reply.status(200).send({
            meta: {
                id: updatedMeta.id,
                name: updatedMeta.name,
                description: updatedMeta.description,
                valor: updatedMeta.valor,
                dataFinal: updatedMeta.dataFinal,
                carteiraId: updatedMeta.carteiraId,
                created_at: updatedMeta.created_at
            }
        })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.status(400).send({ error: error.errors })
        }
        return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
} 