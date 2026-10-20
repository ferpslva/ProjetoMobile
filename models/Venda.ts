export type Cliente = {
    id: number,
    nome: string,
    cpf: string,
    email: string,
    telefone: string
}

export type Funcionario = {
    id: number,
    nome: string,
    cargo: string
}

export type Produto = {
    id: number,
    nome: string,
    descricao?: string,
    preco: number,
    estoque: number
}

export type Venda = {
    id: number,
    dataVenda: string,
    valorTotal: number | null,
    status?: string | null,
    cliente: Cliente,
    funcionario: Funcionario,
    produtos: Produto[]
}
