import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

export const updateCarteira = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const paramsSchema = z.object({
            id: z.string().uuid('ID da carteira inválido')
        })

        const updateCarteiraSchema = z.object({
            name: z.string().min(1, 'O nome é obrigatório').optional(),
            balance: z.number().optional()
        })

        const { id } = paramsSchema.parse(request.params)
        const updateData = updateCarteiraSchema.parse(request.body)

        // Verifica se a carteira existe
        const carteira = await prisma.carteira.findUnique({
            where: {
                id
            }
        })

        if (!carteira) {
            return reply.status(404).send({ error: 'Carteira não encontrada' })
        }

        // Atualiza a carteira
        const updatedCarteira = await prisma.carteira.update({
            where: {
                id
            },
            data: {
                name: updateData.name,
                balance: updateData.balance ? updateData.balance.toString() : undefined
            }
        })

        return reply.status(200).send({
            carteira: {
                id: updatedCarteira.id,
                name: updatedCarteira.name,
                balance: updatedCarteira.balance,
                userId: updatedCarteira.userId,
                created_at: updatedCarteira.created_at
            }
        })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.status(400).send({ error: error.errors })
        }
        return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
} 