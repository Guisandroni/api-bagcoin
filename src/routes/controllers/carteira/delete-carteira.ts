import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

export const deleteCarteira = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const paramsSchema = z.object({
            id: z.string().uuid('ID da carteira inválido')
        })

        const { id } = paramsSchema.parse(request.params)

        // Verifica se a carteira existe
        const carteira = await prisma.carteira.findUnique({
            where: {
                id
            }
        })

        if (!carteira) {
            return reply.status(404).send({ error: 'Carteira não encontrada' })
        }

        // Exclui a carteira e seus relacionamentos
        await prisma.$transaction([
            prisma.despesa.deleteMany({
                where: { carteiraId: id }
            }),
            prisma.receita.deleteMany({
                where: { carteiraId: id }
            }),
            prisma.meta.deleteMany({
                where: { carteiraId: id }
            }),
            prisma.carteira.delete({
                where: { id }
            })
        ])

        return reply.status(204).send()

    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.status(400).send({ error: error.errors })
        }
        return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
} 