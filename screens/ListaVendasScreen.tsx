import { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Botao from '../components/Botao';
import Cabecalho from '../components/Cabecalho';
import CardVenda from '../components/CardVenda';
import Carregando from '../components/Carregando';
import ListaVazia from '../components/ListaVazia';
import MensagemErro from '../components/MensagemErro';
import { Venda } from '../models/Venda';
import { RootStackParamList } from '../navigation/types';
import { excluirVenda, listarVendas } from '../services/vendaService';
import { descreverErro, formatarData, formatarMoeda } from '../utils/formatadores';

type Props = NativeStackScreenProps<RootStackParamList, 'ListaVendas'>;

type ErroTela = { titulo: string, mensagem: string };

export default function ListaVendasScreen({ navigation, route }: Props) {

  // Estados da tela: dados recebidos, carregamento e erro
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<ErroTela | null>(null);
  const [erroExclusao, setErroExclusao] = useState('');

  const carregar = useCallback(async (porGestoDeAtualizar: boolean = false) => {
    if (porGestoDeAtualizar) {
      setAtualizando(true);
    } else {
      setCarregando(true);
    }
    setErro(null);

    try {
      const dados = await listarVendas();
      setVendas(dados);
    } catch (e) {
      setErro(descreverErro(e));
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  const atualizarEm = route.params?.atualizarEm;

  useEffect(() => {
    carregar();
  }, [carregar, atualizarEm]);

  function abrirDetalhes(id: number) {
    navigation.navigate('DetalheVenda', { id });
  }

  async function excluir(id: number) {
    setErroExclusao('');

    try {
      await excluirVenda(id);
      setVendas((atuais) => atuais.filter((venda) => venda.id !== id));
    } catch (e) {
      setErroExclusao(descreverErro(e).mensagem);
    }
  }

  function statusDa(venda: Venda): string {
    return venda.status ?? 'Aguardando Pagamento';
  }

  const totalGeral = vendas.reduce((soma, venda) => soma + (venda.valorTotal ?? 0), 0);

  const totalVendido = vendas
    .filter((venda) => statusDa(venda) === 'Concluída')
    .reduce((soma, venda) => soma + (venda.valorTotal ?? 0), 0);

  return (
    <View style={styles.container}>
      <Cabecalho />

      {carregando ? (
        <Carregando mensagem='Buscando vendas...' />
      ) : erro !== null ? (
        <MensagemErro
          titulo={erro.titulo}
          mensagem={erro.mensagem}
          onTentarNovamente={() => carregar()}
        />
      ) : (
        <FlatList
          data={vendas}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.conteudo}
          refreshing={atualizando}
          onRefresh={() => carregar(true)}
          ListHeaderComponent={
            <View>
              <Botao
                titulo='Nova venda'
                onPress={() => navigation.navigate('CadastroVenda')}
              />
              <Text style={styles.tituloLista}>VENDAS REGISTRADAS</Text>
              <Text style={styles.resumo}>Total concluído: {formatarMoeda(totalVendido)}</Text>
              {vendas.length > 0 && (
                <Text style={styles.resumoSecundario}>
                  {vendas.length} {vendas.length === 1 ? 'venda' : 'vendas'} • Total geral: {formatarMoeda(totalGeral)}
                </Text>
              )}
              {erroExclusao !== '' && (
                <Text style={styles.erro}>{erroExclusao}</Text>
              )}
            </View>
          }
          ListEmptyComponent={
            <ListaVazia
              titulo='Nenhuma venda registrada'
              mensagem='A API respondeu, mas ainda não há vendas cadastradas. Arraste para baixo para atualizar.'
            />
          }
          renderItem={({ item }) => (
            <CardVenda
              id={item.id}
              cliente={item.cliente.nome}
              produto={item.produtos.length > 0 ? item.produtos.map((p) => p.nome).join(', ') : 'Sem produtos'}
              valor={item.valorTotal ?? 0}
              status={statusDa(item)}
              data={formatarData(item.dataVenda)}
              onDelete={excluir}
              onPress={abrirDetalhes}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  conteudo: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },

  tituloLista: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 5,
  },

  resumo: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  resumoSecundario: {
    fontSize: 14,
    marginBottom: 15,
  },

  erro: {
    marginBottom: 15,
    fontWeight: 'bold',
    color: '#c00',
  },
});
