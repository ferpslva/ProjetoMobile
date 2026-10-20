import { Cliente, Funcionario, Produto } from '../models/Venda';
import { ErroApi, get } from './api';


async function listar<T>(caminho: string): Promise<T[]> {
    const dados = await get<T[]>(caminho);

    if (!Array.isArray(dados)) {
        throw new ErroApi('servidor', 'A API retornou os dados em um formato inesperado.');
    }

    return dados;
}

export function listarClientes(): Promise<Cliente[]> {
    return listar<Cliente>('/cliente');
}

export function listarFuncionarios(): Promise<Funcionario[]> {
    return listar<Funcionario>('/funcionario');
}

export function listarProdutos(): Promise<Produto[]> {
    return listar<Produto>('/produto');
}
