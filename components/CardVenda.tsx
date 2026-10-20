import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatarMoeda } from "../utils/formatadores";

type CardVendaProps = {
    id: number,
    cliente: string,
    produto: string,
    valor: number,
    status: string,
    data: string,
    onDelete: (id: number) => Promise<void>,
    onPress: (id: number) => void
}

export default function CardVenda({
    id, cliente, produto, valor, status, data, onDelete, onPress
}: CardVendaProps){

    // A exclusão agora é feita na API, então pede confirmação antes
    const [confirmando, setConfirmando] = useState(false);
    const [excluindo, setExcluindo] = useState(false);

    async function excluir(){
        setExcluindo(true);
        await onDelete(id);
        setExcluindo(false);
        setConfirmando(false);
    }

    return (
        <View style={styles.card}>
            <Text style={styles.produto}>{produto}</Text>
            <Text style={styles.cliente}>Cliente: {cliente}</Text>
            <Text style={styles.cliente}>Venda #{id} • {data}</Text>
            <Text style={styles.valor}>{formatarMoeda(valor)}</Text>
            <Text
                style={[
                    styles.status,
                    status === 'Concluída' && styles.statusConcluida
                ]}
            >{status}</Text>

            {confirmando ? (
                <View>
                    <Text style={styles.confirmacao}>
                        Excluir esta venda? Essa ação não pode ser desfeita.
                    </Text>
                    <View style={styles.acoes}>
                        <Pressable
                            style={[styles.botaoAcao, excluindo && styles.desabilitado]}
                            disabled={excluindo}
                            onPress={excluir}>
                            <Text style={styles.textoAcao}>
                                {excluindo ? 'Excluindo...' : 'Sim, excluir'}
                            </Text>
                        </Pressable>
                        <Pressable
                            style={[styles.botaoAcao, excluindo && styles.desabilitado]}
                            disabled={excluindo}
                            onPress={() => setConfirmando(false)}>
                            <Text style={styles.textoAcao}>Cancelar</Text>
                        </Pressable>
                    </View>
                </View>
            ) : (
                <View style={styles.acoes}>
                    <Pressable style={styles.botaoAcao}
                    onPress={() => onPress(id)}>
                        <Text style={styles.textoAcao}>Detalhes</Text>
                    </Pressable>
                    <Pressable style={styles.botaoAcao}
                    onPress={() => setConfirmando(true)}>
                        <Text style={styles.textoAcao}>Excluir</Text>
                    </Pressable>
                </View>
            )}
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

    confirmacao: {
      fontSize: 14,
      fontWeight: 'bold',
      marginTop: 12,
    },

    acoes: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 12,
    },

    botaoAcao: {
      flex: 1,
      borderWidth: 1,
      borderRadius: 6,
      padding: 8,
      alignItems: 'center',
    },

    textoAcao: {
      fontWeight: 'bold',
    },

    desabilitado: {
      opacity: 0.4,
    },
  });