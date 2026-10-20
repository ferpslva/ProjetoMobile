import { Venda } from '../models/Venda';
import { del, ErroApi, get, post } from './api';

export type NovaVenda = {
    dataVenda: string,
    clienteId: number,
    funcionarioId: number,
    produtosIds: number[]
}

export async function listarVendas(): Promise<Venda[]> {
    const dados = await get<Venda[]>('/venda');

    if (!Array.isArray(dados)) {
        throw new ErroApi('servidor', 'A API retornou os dados em um formato inesperado.');
    }

    return dados;
}

export async function buscarVenda(id: number): Promise<Venda> {
    const dados = await get<Venda>(`/venda/${id}`);

    if (dados === null || typeof dados !== 'object') {
        throw new ErroApi('servidor', 'A API retornou os dados em um formato inesperado.');
    }

    return dados;
}

export async function cadastrarVenda(nova: NovaVenda): Promise<Venda> {
    const consulta =
        `clienteId=${nova.clienteId}` +
        `&funcionarioId=${nova.funcionarioId}` +
        `&produtosIds=${nova.produtosIds.join(',')}`;

    return post<Venda>(`/venda?${consulta}`, {
        dataVenda: nova.dataVenda,
        cliente: { id: nova.clienteId },
        funcionario: { id: nova.funcionarioId },
        produtos: nova.produtosIds.map((id) => ({ id })),
    });
}

export async function excluirVenda(id: number): Promise<void> {
    return del(`/venda/${id}`);
}
