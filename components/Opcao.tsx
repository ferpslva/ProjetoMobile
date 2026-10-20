import { Pressable, StyleSheet, Text, View } from "react-native";

type OpcaoProps = {
    titulo: string,
    detalhe?: string,
    selecionada: boolean,
    onPress: () => void
}

// Item de uma lista de escolha (cliente, vendedor ou produto)
export default function Opcao({
    titulo, detalhe, selecionada, onPress
}: OpcaoProps){
    return (
        <Pressable
            style={[styles.opcao, selecionada && styles.selecionada]}
            onPress={onPress}
        >
            <View style={styles.textos}>
                <Text style={[styles.titulo, selecionada && styles.tituloSelecionado]}>
                    {titulo}
                </Text>
                {detalhe !== undefined && (
                    <Text style={styles.detalhe}>{detalhe}</Text>
                )}
            </View>
            <Text style={styles.marca}>{selecionada ? '✓' : ''}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    opcao: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },

    selecionada: {
        borderWidth: 3,
    },

    textos: {
        flex: 1,
    },

    titulo: {
        fontSize: 16,
    },

    tituloSelecionado: {
        fontWeight: 'bold',
    },

    detalhe: {
        fontSize: 13,
        marginTop: 2,
    },

    marca: {
        width: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'right',
    },
});
