import { Pressable, StyleSheet, Text, View } from "react-native";

type CardVendaProps = {
    id: number,
    cliente: string,
    produto: string,
    valor: number,
    status: string,
    onDelete: (id: number) => void
}

export default function CardVenda({
    id, cliente, produto, valor, status, onDelete
}: CardVendaProps){

    return (
        <View style={styles.card}>
            <Text style={styles.produto}>{produto}</Text>
            <Text style={styles.cliente}>Cliente: {cliente}</Text>
            <Text style={styles.valor}>R$ {valor.toFixed(2)}</Text>
            <Text
                style={[
                    styles.status,
                    status === 'Concluída' && styles.statusConcluida
                ]}
            >{status}</Text>

            <Pressable style={styles.botaoExcluir}
            onPress={() => onDelete(id)}>
                <Text style={styles.textoExcluir}>Excluir</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
      borderWidth: 1,
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
    },

    produto: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 6,
    },

    cliente: {
      fontSize: 15,
      marginBottom: 4,
    },

    valor: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
    },

    status: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#a15c00',
    },

    statusConcluida: {
      color: '#0a7d29',
    },

    botaoExcluir: {
      borderWidth: 1,
      borderRadius: 6,
      padding: 8,
      marginTop: 12,
      alignItems: 'center',
    },

    textoExcluir: {
      fontWeight: 'bold',
    },
  });
