import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

export const deleteReceita = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const paramsSchema = z.object({
            id: z.string().uuid('ID da receita inválido')
        })

        const { id } = paramsSchema.parse(request.params)

        // Verifica se a receita existe
        const receita = await prisma.receita.findUnique({
            where: { id },
            include: { carteira: true }
        })

        if (!receita) {
            return reply.status(404).send({ error: 'Receita não encontrada' })
        }

        // Exclui a receita e atualiza o saldo da carteira em uma transação
        await prisma.$transaction(async (tx) => {
            await tx.receita.delete({
                where: { id }
            })

            const novoSaldo = Number(receita.carteira.balance) - Number(receita.valor)
            await tx.carteira.update({
                where: { id: receita.carteiraId },
                data: { balance: novoSaldo.toString() }
            })
        })

        return reply.status(204).send()

    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.status(400).send({ error: error.errors })
        }
        return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
} 