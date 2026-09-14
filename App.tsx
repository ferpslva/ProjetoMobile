import { StatusBar } from 'expo-status-bar';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import Cabecalho from './components/Cabecalho';
import CardVenda from './components/CardVenda';
import Botao from './components/Botao';
import { useState } from 'react';
import { Venda } from './models/Venda';

export default function App() {

  const [vendas, setVendas] = useState<Venda[]>([
    {
      id: 1,
      cliente: 'Maria Souza',
      produto: 'Notebook Gamer',
      valor: 4599.90,
      status: 'Aguardando Pagamento'
    },
    {
      id: 2,
      cliente: 'João Pereira',
      produto: 'Mouse sem fio',
      valor: 89.90,
      status: 'Concluída'
    }
  ]);

  const [cliente, setCliente] = useState('');
  const [produto, setProduto] = useState('');
  const [valor, setValor] = useState('');
  const [erro, setErro] = useState('');

  function cadastrar(){
    if (cliente.trim() === '' ||
      produto.trim() === '' ||
      valor.trim() === '') {
      setErro('Cliente, produto e valor são obrigatórios!');
      return;
    }

    const valorNumerico = Number(valor.replace(',', '.'));

    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      setErro('Informe um valor válido para a venda!');
      return;
    }

    const novaVenda: Venda = {
      id: Date.now(),
      cliente: cliente,
      produto: produto,
      valor: valorNumerico,
      status: 'Aguardando Pagamento'
    };

    setVendas([
      ...vendas,
      novaVenda
    ]);

    setCliente('');
    setProduto('');
    setValor('');
    setErro('');
  }

  function excluir(id: number){
    const novaLista = vendas.filter(
      (venda) => venda.id !== id
    );

    setVendas(novaLista);
  }

  const totalVendido = vendas
    .filter((venda) => venda.status === 'Concluída')
    .reduce((soma, venda) => soma + venda.valor, 0);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar style="auto" />
      <FlatList data={vendas}
        keyExtractor={(item) => item.id.toString()}
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={styles.conteudo}
        ListHeaderComponent={
          <View>
            <Cabecalho />

            <Text style={styles.tituloFormulario}>Nova Venda</Text>

            <Text style={styles.label}>Cliente</Text>
            <TextInput style={styles.input} placeholder='Nome do cliente' value={cliente} onChangeText={setCliente} />

            <Text style={styles.label}>Produto</Text>
            <TextInput style={styles.input} placeholder='Nome do produto' value={produto} onChangeText={setProduto} />

            <Text style={styles.label}>Valor</Text>
            <TextInput style={styles.input} placeholder='Ex: 199,90' value={valor} onChangeText={setValor} keyboardType='numeric' />

            {erro !== '' && (
              <Text style={styles.erro}>{erro}</Text>
            )}

            <Botao
              titulo='Registrar Venda' onPress={cadastrar}
            />

            <Text style={styles.tituloLista}>VENDAS REGISTRADAS</Text>
            <Text style={styles.resumo}>Total concluído: R$ {totalVendido.toFixed(2)}</Text>
          </View>
        }

        ListEmptyComponent={
          <View style={styles.listaVazia}>
            <Text style={styles.textoListaVazia}>Nenhuma venda registrada</Text>
          </View>
        }

        renderItem={({ item }) => (
          <CardVenda
            id={item.id}
            cliente={item.cliente}
            produto={item.produto}
            valor={item.valor}
            status={item.status}
            onDelete={excluir}
          />
        )}
      >
      </FlatList>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  conteudo: {
    padding: 24,
    paddingTop: 50,
  },

  tituloFormulario: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  label: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },

  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },

  erro: {
    marginTop: 10,
    fontWeight: 'bold',
    color: '#c00',
  },

  tituloLista: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 35,
    marginBottom: 5,
  },

  resumo: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  listaVazia: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },

  textoListaVazia: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 5,
  },

});
