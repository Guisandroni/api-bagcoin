import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

export const deleteDespesa = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const paramsSchema = z.object({
            id: z.string().uuid('ID da despesa inválido')
        })

        const { id } = paramsSchema.parse(request.params)

        // Verifica se a despesa existe
        const despesa = await prisma.despesa.findUnique({
            where: { id },
            include: { carteira: true }
        })

        if (!despesa) {
            return reply.status(404).send({ error: 'Despesa não encontrada' })
        }

        // Exclui a despesa e atualiza o saldo da carteira em uma transação
        await prisma.$transaction(async (tx) => {
            await tx.despesa.delete({
                where: { id }
            })

            const novoSaldo = Number(despesa.carteira.balance) + Number(despesa.valor)
            await tx.carteira.update({
                where: { id: despesa.carteiraId },
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