import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

export const updateDespesa = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const paramsSchema = z.object({
            id: z.string().uuid('ID da despesa inválido')
        })

        const updateDespesaSchema = z.object({
            name: z.string().min(1, 'O nome é obrigatório').optional(),
            description: z.string().optional(),
            valor: z.number().positive('O valor deve ser positivo').optional(),
            data: z.string().datetime('Data inválida').optional(),
            categoria: z.string().min(1, 'A categoria é obrigatória').optional()
        })

        const { id } = paramsSchema.parse(request.params)
        const updateData = updateDespesaSchema.parse(request.body)

        // Verifica se a despesa existe
        const despesa = await prisma.despesa.findUnique({
            where: { id },
            include: { carteira: true }
        })

        if (!despesa) {
            return reply.status(404).send({ error: 'Despesa não encontrada' })
        }

        // Se o valor foi atualizado, ajusta o saldo da carteira
        if (updateData.valor) {
            const valorAntigo = Number(despesa.valor)
            const diferenca = updateData.valor - valorAntigo

            // Verifica se há saldo suficiente para o novo valor
            if (Number(despesa.carteira.balance) + valorAntigo < updateData.valor) {
                return reply.status(400).send({ error: 'Saldo insuficiente na carteira' })
            }

            // Atualiza a despesa e o saldo da carteira em uma transação
            const { despesa: despesaAtualizada, carteira } = await prisma.$transaction(async (tx) => {
                const despesa = await tx.despesa.update({
                    where: { id },
                    data: {
                        name: updateData.name,
                        description: updateData.description,
                        valor: updateData.valor.toString(),
                        data: updateData.data ? new Date(updateData.data) : undefined,
                        categoria: updateData.categoria
                    }
                })

                const novoSaldo = Number(despesa.carteira.balance) - diferenca
                const carteira = await tx.carteira.update({
                    where: { id: despesa.carteiraId },
                    data: { balance: novoSaldo.toString() }
                })

                return { despesa, carteira }
            })

            return reply.status(200).send({
                despesa: {
                    id: despesaAtualizada.id,
                    name: despesaAtualizada.name,
                    description: despesaAtualizada.description,
                    valor: despesaAtualizada.valor,
                    data: despesaAtualizada.data,
                    categoria: despesaAtualizada.categoria,
                    carteiraId: despesaAtualizada.carteiraId,
                    created_at: despesaAtualizada.created_at
                },
                carteira: {
                    id: carteira.id,
                    balance: carteira.balance
                }
            })
        } else {
            // Se o valor não foi atualizado, apenas atualiza a despesa
            const despesaAtualizada = await prisma.despesa.update({
                where: { id },
                data: {
                    name: updateData.name,
                    description: updateData.description,
                    data: updateData.data ? new Date(updateData.data) : undefined,
                    categoria: updateData.categoria
                }
            })

            return reply.status(200).send({
                despesa: {
                    id: despesaAtualizada.id,
                    name: despesaAtualizada.name,
                    description: despesaAtualizada.description,
                    valor: despesaAtualizada.valor,
                    data: despesaAtualizada.data,
                    categoria: despesaAtualizada.categoria,
                    carteiraId: despesaAtualizada.carteiraId,
                    created_at: despesaAtualizada.created_at
                }
            })
        }

    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.status(400).send({ error: error.errors })
        }
        return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
} 