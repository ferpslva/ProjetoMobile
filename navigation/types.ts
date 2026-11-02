export type RootStackParamList = {
    ListaVendas: { atualizarEm?: number } | undefined,
    DetalheVenda: { id: number },
    CadastroVenda: { id?: number } | undefined
}
