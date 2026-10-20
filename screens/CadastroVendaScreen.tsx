import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Botao from '../components/Botao';
import Carregando from '../components/Carregando';
import ListaVazia from '../components/ListaVazia';
import MensagemErro from '../components/MensagemErro';
import Opcao from '../components/Opcao';
import { Cliente, Funcionario, Produto } from '../models/Venda';
import { RootStackParamList } from '../navigation/types';
import { listarClientes, listarFuncionarios, listarProdutos } from '../services/opcoesVendaService';
import { cadastrarVenda } from '../services/vendaService';
import { converterDataParaApi, descreverErro, formatarMoeda, hojeBR } from '../utils/formatadores';

type Props = NativeStackScreenProps<RootStackParamList, 'CadastroVenda'>;

type ErroTela = { titulo: string, mensagem: string };

export default function CadastroVendaScreen({ navigation }: Props) {

  // Opções recebidas da API
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroCarga, setErroCarga] = useState<ErroTela | null>(null);

  // Escolhas do usuário
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [funcionarioId, setFuncionarioId] = useState<number | null>(null);
  const [produtosIds, setProdutosIds] = useState<number[]>([]);
  const [data, setData] = useState(hojeBR());

  // Envio do formulário
  const [enviando, setEnviando] = useState(false);
  const [erroFormulario, setErroFormulario] = useState('');

  const carregarOpcoes = useCallback(async () => {
    setCarregando(true);
    setErroCarga(null);

    try {
      const [listaClientes, listaFuncionarios, listaProdutos] = await Promise.all([
        listarClientes(),
        listarFuncionarios(),
        listarProdutos(),
      ]);

      setClientes(listaClientes);
      setFuncionarios(listaFuncionarios);
      setProdutos(listaProdutos);
    } catch (e) {
      setErroCarga(descreverErro(e));
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarOpcoes();
  }, [carregarOpcoes]);

  function alternarProduto(id: number) {
    if (produtosIds.includes(id)) {
      setProdutosIds(produtosIds.filter((item) => item !== id));
    } else {
      setProdutosIds([...produtosIds, id]);
    }
  }

  // Valor que a API vai calcular (soma dos preços dos produtos escolhidos)
  const totalPrevisto = produtos
    .filter((produto) => produtosIds.includes(produto.id))
    .reduce((soma, produto) => soma + produto.preco, 0);

  async function registrar() {
    if (clienteId === null) {
      setErroFormulario('Selecione o cliente.');
      return;
    }

    if (funcionarioId === null) {
      setErroFormulario('Selecione o vendedor.');
      return;
    }

    if (produtosIds.length === 0) {
      setErroFormulario('Selecione ao menos um produto.');
      return;
    }

    const dataApi = converterDataParaApi(data);

    if (dataApi === null) {
      setErroFormulario('Informe uma data válida no formato DD/MM/AAAA.');
      return;
    }

    setErroFormulario('');
    setEnviando(true);

    try {
      await cadastrarVenda({
        dataVenda: dataApi,
        clienteId,
        funcionarioId,
        produtosIds,
      });

      navigation.popTo('ListaVendas', { atualizarEm: Date.now() });
    } catch (e) {
      setErroFormulario(descreverErro(e).mensagem);
    } finally {
      setEnviando(false);
    }
  }

  if (carregando) {
    return <Carregando mensagem='Buscando clientes, vendedores e produtos...' />;
  }

  if (erroCarga !== null) {
    return (
      <MensagemErro
        titulo={erroCarga.titulo}
        mensagem={erroCarga.mensagem}
        onTentarNovamente={carregarOpcoes}
      />
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps='handled'
    >
      <Text style={styles.titulo}>Nova venda</Text>

      <Text style={styles.secao}>Cliente</Text>
      {clientes.length === 0 ? (
        <ListaVazia
          titulo='Nenhum cliente cadastrado'
          mensagem='Cadastre um cliente na API antes de registrar a venda.'
        />
      ) : (
        clientes.map((cliente) => (
          <Opcao
            key={cliente.id}
            titulo={cliente.nome}
            detalhe={cliente.email}
            selecionada={clienteId === cliente.id}
            onPress={() => setClienteId(cliente.id)}
          />
        ))
      )}

      <Text style={styles.secao}>Vendedor</Text>
      {funcionarios.length === 0 ? (
        <ListaVazia
          titulo='Nenhum vendedor cadastrado'
          mensagem='Cadastre um funcionário na API antes de registrar a venda.'
        />
      ) : (
        funcionarios.map((funcionario) => (
          <Opcao
            key={funcionario.id}
            titulo={funcionario.nome}
            detalhe={funcionario.cargo}
            selecionada={funcionarioId === funcionario.id}
            onPress={() => setFuncionarioId(funcionario.id)}
          />
        ))
      )}

      <Text style={styles.secao}>Produtos</Text>
      {produtos.length === 0 ? (
        <ListaVazia
          titulo='Nenhum produto cadastrado'
          mensagem='Cadastre um produto na API antes de registrar a venda.'
        />
      ) : (
        produtos.map((produto) => (
          <Opcao
            key={produto.id}
            titulo={produto.nome}
            detalhe={formatarMoeda(produto.preco)}
            selecionada={produtosIds.includes(produto.id)}
            onPress={() => alternarProduto(produto.id)}
          />
        ))
      )}

      <Text style={styles.secao}>Data da venda</Text>
      <TextInput
        style={styles.input}
        placeholder='DD/MM/AAAA'
        value={data}
        onChangeText={setData}
        keyboardType='numbers-and-punctuation'
        maxLength={10}
      />

      <View style={styles.resumo}>
        <Text style={styles.resumoTexto}>
          Total: {formatarMoeda(totalPrevisto)}
        </Text>
        <Text style={styles.resumoNota}>
          {produtosIds.length} {produtosIds.length === 1 ? 'produto selecionado' : 'produtos selecionados'}
        </Text>
      </View>

      {erroFormulario !== '' && (
        <Text style={styles.erro}>{erroFormulario}</Text>
      )}

      <Botao
        titulo={enviando ? 'Registrando...' : 'Registrar venda'}
        onPress={registrar}
        desabilitado={enviando}
      />
      <Botao
        titulo='Cancelar'
        onPress={() => navigation.goBack()}
        desabilitado={enviando}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  conteudo: {
    padding: 24,
    paddingBottom: 48,
  },

  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  secao: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 22,
    marginBottom: 10,
  },

  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },

  resumo: {
    marginTop: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  resumoTexto: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  resumoNota: {
    fontSize: 14,
  },

  erro: {
    marginTop: 12,
    fontWeight: 'bold',
    color: '#c00',
  },
});
