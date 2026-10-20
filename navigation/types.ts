export type RootStackParamList = {
    // atualizarEm: quando muda, a lista busca os dados na API novamente
    ListaVendas: { atualizarEm?: number } | undefined,
    DetalheVenda: { id: number },
    CadastroVenda: undefined
}
