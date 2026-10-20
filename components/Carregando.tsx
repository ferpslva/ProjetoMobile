import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type CarregandoProps = {
    mensagem?: string
}

export default function Carregando({ mensagem = 'Carregando...' }: CarregandoProps){
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" />
            <Text style={styles.texto}>{mensagem}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },

    texto: {
        fontSize: 16,
        marginTop: 12,
    },
});
