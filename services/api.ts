import { API_BASE_URL, TEMPO_LIMITE_MS } from '../config/api';

export type TipoErroApi = 'comunicacao' | 'servidor';

export class ErroApi extends Error {
    tipo: TipoErroApi;
    status?: number;

    constructor(tipo: TipoErroApi, mensagem: string, status?: number) {
        super(mensagem);
        this.name = 'ErroApi';
        this.tipo = tipo;
        this.status = status;
    }
}

type Metodo = 'GET' | 'POST' | 'DELETE';

async function requisitar<T>(metodo: Metodo, caminho: string, corpo?: unknown): Promise<T> {
    const controlador = new AbortController();
    const temporizador = setTimeout(() => controlador.abort(), TEMPO_LIMITE_MS);

    const temCorpo = corpo !== undefined;
    let resposta: Response;

    try {
        resposta = await fetch(`${API_BASE_URL}${caminho}`, {
            method: metodo,
            headers: temCorpo
                ? { Accept: 'application/json', 'Content-Type': 'application/json' }
                : { Accept: 'application/json' },
            body: temCorpo ? JSON.stringify(corpo) : undefined,
            signal: controlador.signal,
        });
    } catch {
        if (controlador.signal.aborted) {
            throw new ErroApi('comunicacao', 'O servidor demorou demais para responder.');
        }
        throw new ErroApi(
            'comunicacao',
            'Não foi possível se comunicar com o servidor. Verifique se a API está ligada e se o endereço está correto.'
        );
    } finally {
        clearTimeout(temporizador);
    }

    if (!resposta.ok) {
        let mensagem = `O servidor retornou um erro (HTTP ${resposta.status}).`;

        try {
            const erro = await resposta.json();
            if (erro && typeof erro.mensagem === 'string') {
                mensagem = erro.mensagem;
            }
        } catch {
        }

        throw new ErroApi('servidor', mensagem, resposta.status);
    }


    let texto = '';
    try {
        texto = await resposta.text();
    } catch {
        throw new ErroApi('comunicacao', 'A conexão foi interrompida durante a resposta do servidor.');
    }

    if (texto.trim() === '') {
        return undefined as T;
    }

    try {
        return JSON.parse(texto) as T;
    } catch {
        throw new ErroApi(
            'servidor',
            'A resposta do servidor não está em um formato JSON válido.',
            resposta.status
        );
    }
}

export function get<T>(caminho: string): Promise<T> {
    return requisitar<T>('GET', caminho);
}

export function post<T>(caminho: string, corpo: unknown): Promise<T> {
    return requisitar<T>('POST', caminho, corpo);
}

export function del(caminho: string): Promise<void> {
    return requisitar<void>('DELETE', caminho);
}
