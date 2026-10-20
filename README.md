Vende+ — Checkpoint 01 + Checkpoint 2
## Nome do projeto

Vende+ — Aplicativo de Gerenciamento de Vendas

## Objetivo da aplicação

- Auxiliar pequenos comerciantes/vendedores no controle das vendas realizadas, permitindo registrar, acompanhar e gerenciar o status de cada venda (cliente, produto, valor e situação do pagamento), de forma simples e rápida pelo celular.

## Funcionalidades previstas para o projeto completo

- CRUD completo de vendas;
- CRUD completo de produtos;
- CRUD completo de clientes;
- Login de usuário;
- Acompanhamento do status da venda (Aguardando Pagamento → Em Separação → Concluída);
- Navegação entre múltiplas telas;
- Persistência dos dados.

## Funcionalidades implementadas até o Checkpoint 01

Tela única com:
- Formulário de cadastro de venda (cliente, produto, valor);
- Validação de campos obrigatórios e de valor numérico;
- Listagem das vendas cadastradas (FlatList);
- Exclusão de vendas;
- Cálculo do total já vendido (vendas com status "Concluída");
- Componentes próprios: Cabecalho, Botao, CardVenda, Cliente, StatusVenda, ContadorVendas;
- Modelo de dados Venda tipado em TypeScript;
- Estilização com StyleSheet e uso inicial de Flexbox.
- Dados guardados apenas em memória (`useState`), perdidos ao fechar o app.

## C2 - 1. Evolução do projeto

- Nada foi removido.
- Alterações foram necessárias para consumir a web API:
    - **Navegação** entre três telas com React Navigation (Stack).
    - **Integração com a Web API**: requisições HTTP `GET`, `POST` e `DELETE` com `fetch`, `async/await` e leitura do JSON.
    - **Camada de serviço** (`services/`) separada dos componentes visuais.
    - **Tratamento dos cenários de comunicação**: carregando, lista vazia, falha de comunicação e erro enviado pelo servidor.
    - **Tela de detalhes da venda** (cliente, vendedor e produtos).
    - **Tela de cadastro de venda**, com cliente, vendedor e produtos escolhidos entre os registros da API.
    - Atualização da lista com o gesto de arrastar para baixo (*pull to refresh*) e automaticamente após cadastrar ou excluir.
    - Componentes novos: `Carregando`, `MensagemErro`, `ListaVazia` e `Opcao`.

### Situação de cada funcionalidade do Checkpoint 01

| Funcionalidade do Checkpoint 01 | Situação no Checkpoint 02 |
|---|---|
| Formulário de cadastro de venda (cliente, produto, valor) | **Mantida e ampliada.** Agora é a tela *Nova venda*: cliente, vendedor e produtos são escolhidos entre os cadastrados na API, e a data é informada. O **valor deixou de ser digitado**: a API calcula a soma dos preços dos produtos, e a tela mostra esse total antes de registrar. |
| Validação de campos obrigatórios e de valor numérico | **Mantida.** Valida cliente, vendedor, produtos e data (DD/MM/AAAA, incluindo datas inexistentes). Como o valor é calculado, não há campo numérico a validar. As validações da API (HTTP 400) também aparecem na tela. |
| Listagem das vendas (`FlatList`) | **Mantida**, agora com os dados vindos da API (`GET /venda`). |
| Exclusão de vendas | **Mantida**, no card da lista e na tela de detalhes, agora via `DELETE /venda/{id}` e com confirmação antes de excluir. |
| Total já vendido (status "Concluída") | **Mantido** ("Total concluído"), com o acréscimo do total geral. Veja a observação sobre o status abaixo. |
| `Cabecalho`, `Botao`, `CardVenda` | **Mantidos**, com ajustes: `Cabecalho` perdeu o `flex: 1` (ocuparia a tela toda acima da lista); `Botao` ganhou a propriedade opcional `desabilitado`; `CardVenda` mostra os mesmos dados do Checkpoint 01 e ganhou data e o botão *Detalhes*. |
| `Cliente`, `StatusVenda`, `ContadorVendas` | **Mantidos sem alteração**, como componentes disponíveis do projeto (no Checkpoint 01 também não eram usados em nenhuma tela). |
| Modelo `Venda` tipado | **Mantido e alterado**: os tipos em `models/Venda.ts` passaram a espelhar o JSON da API (cliente, funcionário e lista de produtos, em vez de textos soltos). |
| `StyleSheet` e Flexbox | **Mantidos e ampliados** (linhas e colunas com `flexDirection`, `justifyContent`, `alignItems`, `flex` e `gap`). |

> **Observação sobre o status da venda:** a API não possui o campo `status`. Enquanto ele não existir, toda venda é exibida como *Aguardando Pagamento*, que era o estado inicial no Checkpoint 01, e o *Total concluído* fica em R$ 0,00. Com o campo na API (veja "Status da venda na API" no fim deste documento), o app passa a mostrar o status real e a somar as vendas *Concluída*, sem nenhuma alteração no aplicativo.

---

## 2. Navegação

### Telas existentes

| Tela | Arquivo | Função |
|---|---|---|
| `ListaVendas` (título "Vendas") | `screens/ListaVendasScreen.tsx` | Lista as vendas obtidas da API, mostra os totais e permite excluir |
| `DetalheVenda` (título "Detalhes da venda") | `screens/DetalheVendaScreen.tsx` | Mostra uma venda completa e permite excluí-la |
| `CadastroVenda` (título "Nova venda") | `screens/CadastroVendaScreen.tsx` | Formulário para registrar uma venda |

### Fluxo

```
                 ┌── botão "Nova venda" ──────► CadastroVenda
                 │                                  │
ListaVendas ─────┤                                  │ venda registrada
     ▲           │                                  │
     │           └── botão "Detalhes" ──► DetalheVenda
     │                                         │
     └────── voltar / venda excluída ──────────┘
```

A navegação é configurada em `App.tsx` com `@react-navigation/native` e `@react-navigation/native-stack`. A tela inicial é `ListaVendas`. Os parâmetros de cada tela são tipados em `navigation/types.ts` (`RootStackParamList`).

### Transferência de dados entre as telas

| De → Para | Dado transferido | Como |
|---|---|---|
| `ListaVendas` → `DetalheVenda` | `id` da venda | `navigation.navigate('DetalheVenda', { id })` |
| `ListaVendas` → `CadastroVenda` | nenhum | `navigation.navigate('CadastroVenda')` |
| `CadastroVenda` → `ListaVendas` | `atualizarEm` (instante da alteração) | `navigation.popTo('ListaVendas', { atualizarEm: Date.now() })` |
| `DetalheVenda` → `ListaVendas` | `atualizarEm`, após excluir | `navigation.popTo('ListaVendas', { atualizarEm: Date.now() })` |

A tela de detalhes lê o `id` com `route.params` e faz sua própria requisição `GET /venda/{id}`, então sempre mostra o dado atual do servidor. A lista observa o parâmetro `atualizarEm` em um `useEffect` e busca os dados de novo quando ele muda.

---

## 3. Integração com a Web API

### Indicação da API
Repositório: https://github.com/ferpslva/sistema-vendas-api (API REST em Java com Spring Boot, Spring Data JPA e MySQL).

### Endereço base
`http://<host>:8080`, definido em `config/api.ts`

### Recursos e entidades da API

| Recurso | Entidade | Uso no aplicativo |
|---|---|---|
| `/venda` | Venda (com cliente, funcionário e produtos) | Listar, detalhar, cadastrar e excluir |
| `/cliente` | Cliente | Listado na tela de cadastro (escolha do cliente) |
| `/funcionario` | Funcionário | Listado na tela de cadastro (escolha do vendedor) |
| `/produto` | Produto | Listado na tela de cadastro (escolha dos produtos) |

### Endpoints consumidos

| Método | Endpoint | Descrição | Onde é chamado |
|---|---|---|---|
| `GET` | `/venda` | Lista todas as vendas | `listarVendas()` — `services/vendaService.ts` |
| `GET` | `/venda/{id}` | Busca uma venda pelo id | `buscarVenda(id)` — `services/vendaService.ts` |
| `POST` | `/venda?clienteId=&funcionarioId=&produtosIds=` | Registra uma venda | `cadastrarVenda()` — `services/vendaService.ts` |
| `DELETE` | `/venda/{id}` | Exclui uma venda | `excluirVenda(id)` — `services/vendaService.ts` |
| `GET` | `/cliente` | Lista clientes | `listarClientes()` — `services/opcoesVendaService.ts` |
| `GET` | `/funcionario` | Lista funcionários | `listarFuncionarios()` — `services/opcoesVendaService.ts` |
| `GET` | `/produto` | Lista produtos | `listarProdutos()` — `services/opcoesVendaService.ts` |

### Formato dos dados recebidos (JSON)

`GET /venda` retorna uma lista:

```json
[
  {
    "id": 1,
    "dataVenda": "2026-05-13",
    "valorTotal": 3500.0,
    "cliente": { "id": 1, "nome": "Maria", "cpf": "11111111111", "email": "maria@email.com", "telefone": "18999999999" },
    "funcionario": { "id": 1, "nome": "Carlos", "cargo": "Vendedor" },
    "produtos": [
      { "id": 1, "nome": "Notebook", "descricao": "Notebook Dell", "preco": 3500.0, "estoque": 10 }
    ]
  }
]
```

`GET /venda/{id}` retorna o mesmo formato, mas uma única venda (sem o campo `descricao` nos produtos). `GET /cliente`, `GET /funcionario` e `GET /produto` retornam listas dos respectivos objetos.

### Formato enviado no cadastro (`POST /venda`)

Os ids também vão na URL (`?clienteId=1&funcionarioId=1&produtosIds=1,2`), e o corpo é:

```json
{
  "dataVenda": "2026-05-13",
  "cliente": { "id": 1 },
  "funcionario": { "id": 1 },
  "produtos": [{ "id": 1 }, { "id": 2 }]
}
```

A API valida o corpo antes de usar os parâmetros da URL; por isso o corpo precisa trazer cliente, funcionário e produtos (basta o `id` de cada um). O `valorTotal` é calculado pela própria API.

### Formato dos erros enviados pela API

```json
{ "status": 404, "mensagem": "Venda não encontrada", "dataHora": "2026-10-17T18:00:00" }
```

### Conversão do JSON
`response.text()` seguido de `JSON.parse` converte o corpo em objeto JavaScript (e trata respostas sem corpo, como a do `DELETE`), que é tipado com `models/Venda.ts`. As funções `formatarMoeda` e `formatarData` (`utils/formatadores.ts`) transformam `3500.0` em `R$ 3.500,00` e `2026-05-13` em `13/05/2026`; `converterDataParaApi` faz o caminho inverso no cadastro.

### Separação entre visual e comunicação

| Camada | Pasta | Responsabilidade |
|---|---|---|
| Comunicação com a API | `services/` | `fetch`, tempo limite, leitura do JSON, classificação dos erros. Não importa nenhum componente. |
| Configuração | `config/` | Endereço base e tempo limite |
| Modelos | `models/` | Tipos TypeScript do JSON |
| Telas | `screens/` | Estados, `useEffect` e montagem da interface |
| Componentes visuais | `components/` | Apenas exibem o que recebem por props |

---

## 4. Tratamento de estado

### Como os dados recebidos são armazenados
Cada tela guarda os dados com `useState`:

```ts
const [vendas, setVendas] = useState<Venda[]>([]);          // dados da API
const [carregando, setCarregando] = useState(true);         // aguardando resposta
const [erro, setErro] = useState<ErroTela | null>(null);    // falha ou erro do servidor
```

A tela de cadastro guarda as listas recebidas (`clientes`, `funcionarios`, `produtos`), as escolhas do usuário (`clienteId`, `funcionarioId`, `produtosIds`, `data`) e o estado do envio (`enviando`, `erroFormulario`).

### Quando a requisição acontece
Em um `useEffect` que dispara ao abrir a tela (e, na lista, quando `atualizarEm` muda). O mesmo carregamento é reutilizado pelo botão **Tentar novamente** e pelo gesto de arrastar para baixo, usando `async/await` com `try / catch / finally`. Cadastro e exclusão são disparados por ações do usuário e também usam `async/await`, com o botão desabilitado enquanto aguardam a resposta.

### Cenários tratados

| Cenário | O que o usuário vê | Como é detectado | Como reproduzir |
|---|---|---|---|
| API disponível com dados | Totais e cards das vendas | Resposta 200 com lista preenchida | API ligada com vendas cadastradas |
| API disponível sem registros | "Nenhuma venda registrada" | Resposta 200 com lista `[]` | API ligada com o banco sem vendas |
| Aguardando resposta | Indicador de carregamento ("Buscando vendas..."); nos envios, botão "Registrando..." / "Excluindo..." | `carregando === true` até a requisição terminar | Visível a cada carga. Para ver por mais tempo, use em `ENDERECO_DO_PC_NA_REDE` um IP inexistente (ex.: `'10.255.255.1'`): o indicador fica até o tempo limite de 10 s |
| Falha na comunicação | "Falha na comunicação" + botão Tentar novamente (no cadastro e na exclusão, a mensagem aparece na própria tela) | `fetch` lança exceção ou excede 10 s (`ErroApi` do tipo `comunicacao`) | Desligar a API ou informar endereço errado |
| Erro enviado pelo servidor | "Erro no servidor" com a mensagem da API + botão Tentar novamente | Resposta HTTP fora de 2xx (`ErroApi` do tipo `servidor`) | Abrir a lista, excluir uma venda direto na API (`DELETE /venda/{id}`) e tocar em *Detalhes* no card dela: "Venda não encontrada" |

---

## Estrutura de pastas

```
├── App.tsx                          # Navegação (Stack)
├── config/api.ts                    # Endereço base e tempo limite
├── models/Venda.ts                  # Tipos do JSON da API
├── navigation/types.ts              # Parâmetros das telas
├── services/
│   ├── api.ts                       # get(), post(), del(), ErroApi, tempo limite
│   ├── vendaService.ts              # listar, buscar, cadastrar e excluir vendas
│   └── opcoesVendaService.ts        # listar clientes, funcionários e produtos
├── screens/
│   ├── ListaVendasScreen.tsx
│   ├── DetalheVendaScreen.tsx
│   └── CadastroVendaScreen.tsx
├── components/
│   ├── Cabecalho.tsx   Botao.tsx   CardVenda.tsx          # do Checkpoint 01
│   ├── Cliente.tsx   StatusVenda.tsx   ContadorVendas.tsx # do Checkpoint 01
│   └── Carregando.tsx   MensagemErro.tsx   ListaVazia.tsx   Opcao.tsx   # novos
└── utils/formatadores.ts            # Moeda, data e texto de erro
```

---

## Como executar

### 1. Web API
Requisitos: Java 17 ou superior (JDK, conforme o `pom.xml`) e MySQL.

1. Crie o banco `projeto` no MySQL e confira usuário/senha em `src/main/resources/application.properties` da API.
2. Na pasta da API: `./mvnw spring-boot:run` (no PowerShell: `.\mvnw.cmd spring-boot:run`). A API usa a porta 8080.
3. Cadastre alguns dados de exemplo (nesta ordem):

```bash
curl -X POST http://localhost:8080/cliente -H "Content-Type: application/json" \
  -d '{"nome":"Maria","cpf":"11111111111","email":"maria@email.com","telefone":"18999999999"}'

curl -X POST http://localhost:8080/funcionario -H "Content-Type: application/json" \
  -d '{"nome":"Carlos","cpf":"98765432100","cargo":"Vendedor","senha":"123456","salario":2500.00}'

curl -X POST http://localhost:8080/produto -H "Content-Type: application/json" \
  -d '{"nome":"Notebook","descricao":"Notebook Dell","preco":3500.00,"estoque":10}'
```

Depois disso, as vendas já podem ser registradas pelo próprio aplicativo (tela *Nova venda*). Para criar uma venda direto pela API:

```bash
curl -X POST "http://localhost:8080/venda?clienteId=1&funcionarioId=1&produtosIds=1" \
  -H "Content-Type: application/json" \
  -d '{"dataVenda":"2026-05-13","cliente":{"id":1},"funcionario":{"id":1},"produtos":[{"id":1}]}'
```

### 2. Aplicativo

```bash
npm install
npx expo start
```

Abra no emulador ou escaneie o QR Code com o Expo Go. Em celular físico, informe o IP do computador em `config/api.ts` (celular e computador na mesma rede Wi-Fi).

### 3. Executando pela web (`npx expo start --web`)

O navegador só permite chamadas à API se ela autorizar a origem (CORS). Crie na API o arquivo `src/main/java/com/silva/projeto/config/CorsConfig.java`:

```java
package com.silva.projeto.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("http://localhost:*")
                .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}
```

No emulador ou no Expo Go, esse arquivo não é necessário.

---

## Status da venda na API (opcional)

Para que o status e o *Total concluído* mostrem valores reais, acrescente o campo na entidade `Venda` da API (`model/entity/Venda.java`):

```java
    private String status = "Aguardando Pagamento";

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
```

Com `spring.jpa.hibernate.ddl-auto=update`, a coluna é criada sozinha. Vendas antigas ficam sem valor e o aplicativo as trata como *Aguardando Pagamento*. Para marcar uma venda como concluída:

```sql
UPDATE venda SET status = 'Concluída' WHERE id = 1;
```

---

## Dificuldades encontradas durante o desenvolvimento
- Até o momento, sem dificuldades. Utilizei o modelo de exemplo das aulas.
- 

## Uso da Inteligência Artificial
- Utilização do CLAUDE
- Auxílio com renderItem no App.tsx;
- Auxílio no Cliente.tsx;
- Auxílio para criação das Screens;
- Organização do READ.ME.