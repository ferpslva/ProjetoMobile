import { ErroApi } from '../services/api';

export function formatarMoeda(valor: number | null | undefined): string {
    const numero = valor ?? 0;
    const [inteiro, centavos] = numero.toFixed(2).split('.');
    const comMilhar = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `R$ ${comMilhar},${centavos}`;
}

export function formatarData(data: string): string {
    const partes = /^(\d{4})-(\d{2})-(\d{2})/.exec(data);
    if (!partes) {
        return data;
    }
    return `${partes[3]}/${partes[2]}/${partes[1]}`;
}

export function descreverErro(erro: unknown): { titulo: string, mensagem: string } {
    if (erro instanceof ErroApi) {
        return {
            titulo: erro.tipo === 'comunicacao' ? 'Falha na comunicação' : 'Erro no servidor',
            mensagem: erro.message,
        };
    }

    return {
        titulo: 'Erro inesperado',
        mensagem: 'Ocorreu um problema ao carregar os dados.',
    };
}

export function hojeBR(): string {
    const agora = new Date();
    const dia = String(agora.getDate()).padStart(2, '0');
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    return `${dia}/${mes}/${agora.getFullYear()}`;
}

export function converterDataParaApi(data: string): string | null {
    const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(data.trim());
    if (!partes) {
        return null;
    }

    const dia = Number(partes[1]);
    const mes = Number(partes[2]);
    const ano = Number(partes[3]);

    const conferencia = new Date(Date.UTC(ano, mes - 1, dia));
    const valida =
        conferencia.getUTCFullYear() === ano &&
        conferencia.getUTCMonth() === mes - 1 &&
        conferencia.getUTCDate() === dia;

    return valida ? `${partes[3]}-${partes[2]}-${partes[1]}` : null;
}
