import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Botao from '../components/Botao';
import Carregando from '../components/Carregando';
import ListaVazia from '../components/ListaVazia';
import MensagemErro from '../components/MensagemErro';
import { Venda } from '../models/Venda';
import { RootStackParamList } from '../navigation/types';
import { buscarVenda, excluirVenda } from '../services/vendaService';
import { descreverErro, formatarData, formatarMoeda } from '../utils/formatadores';

type Props = NativeStackScreenProps<RootStackParamList, 'DetalheVenda'>;

type ErroTela = { titulo: string, mensagem: string };

export default function DetalheVendaScreen({ route, navigation }: Props) {

  const { id } = route.params;

  const [venda, setVenda] = useState<Venda | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<ErroTela | null>(null);

  const [confirmando, setConfirmando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [erroExclusao, setErroExclusao] = useState('');

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);

    try {
      const dados = await buscarVenda(id);
      setVenda(dados);
    } catch (e) {
      setErro(descreverErro(e));
    } finally {
      setCarregando(false);
    }
  }, [id]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function excluir() {
    setExcluindo(true);
    setErroExclusao('');

    try {
      await excluirVenda(id);

      navigation.popTo('ListaVendas', { atualizarEm: Date.now() });
    } catch (e) {
      setErroExclusao(descreverErro(e).mensagem);
      setConfirmando(false);
    } finally {
      setExcluindo(false);
    }
  }

  if (carregando) {
    return <Carregando mensagem='Buscando detalhes da venda...' />;
  }

  if (erro !== null || venda === null) {
    return (
      <MensagemErro
        titulo={erro?.titulo ?? 'Erro inesperado'}
        mensagem={erro?.mensagem ?? 'Não foi possível carregar a venda.'}
        onTentarNovamente={carregar}
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.conteudo}>
      <Text style={styles.titulo}>Venda #{venda.id}</Text>
      <Text style={styles.valorTotal}>{formatarMoeda(venda.valorTotal)}</Text>
      <Text style={styles.texto}>Data: {formatarData(venda.dataVenda)}</Text>

      <Text style={styles.secao}>Cliente</Text>
      <View style={styles.bloco}>
        <Text style={styles.nome}>{venda.cliente.nome}</Text>
        <Text style={styles.texto}>CPF: {venda.cliente.cpf}</Text>
        <Text style={styles.texto}>E-mail: {venda.cliente.email}</Text>
        <Text style={styles.texto}>Telefone: {venda.cliente.telefone}</Text>
      </View>

      <Text style={styles.secao}>Vendedor</Text>
      <View style={styles.bloco}>
        <Text style={styles.nome}>{venda.funcionario.nome}</Text>
        <Text style={styles.texto}>Cargo: {venda.funcionario.cargo}</Text>
      </View>

      <Text style={styles.secao}>Produtos</Text>
      {venda.produtos.length === 0 ? (
        <ListaVazia titulo='Nenhum produto nesta venda' />
      ) : (
        venda.produtos.map((produto) => (
          <View key={produto.id} style={styles.bloco}>
            <Text style={styles.nome}>{produto.nome}</Text>
            <Text style={styles.texto}>Preço: {formatarMoeda(produto.preco)}</Text>
            <Text style={styles.texto}>Estoque atual: {produto.estoque}</Text>
          </View>
        ))
      )}

      <View style={styles.zonaExclusao}>
        {erroExclusao !== '' && (
          <Text style={styles.erro}>{erroExclusao}</Text>
        )}

        {confirmando ? (
          <View style={styles.confirmacao}>
            <Text style={styles.confirmacaoTexto}>
              Excluir a venda #{venda.id}? Essa ação não pode ser desfeita.
            </Text>
            <Botao
              titulo={excluindo ? 'Excluindo...' : 'Sim, excluir'}
              onPress={excluir}
              desabilitado={excluindo}
            />
            <Botao
              titulo='Cancelar'
              onPress={() => setConfirmando(false)}
              desabilitado={excluindo}
            />
          </View>
        ) : (
          <Botao
            titulo='Excluir venda'
            onPress={() => setConfirmando(true)}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  conteudo: {
    padding: 24,
  },

  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  valorTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 8,
  },

  secao: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 10,
  },

  bloco: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
  },

  nome: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  texto: {
    fontSize: 15,
    marginBottom: 2,
  },

  zonaExclusao: {
    marginTop: 30,
  },

  confirmacao: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#c00',
    padding: 14,
  },

  confirmacaoTexto: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  erro: {
    fontWeight: 'bold',
    color: '#c00',
    marginBottom: 4,
  },
});
