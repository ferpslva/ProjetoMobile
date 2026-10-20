import { StyleSheet, Text, View } from "react-native";

type ListaVaziaProps = {
    titulo: string,
    mensagem?: string
}

export default function ListaVazia({ titulo, mensagem }: ListaVaziaProps){
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>{titulo}</Text>
            {mensagem !== undefined && (
                <Text style={styles.mensagem}>{mensagem}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
    },

    titulo: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 5,
    },

    mensagem: {
        fontSize: 14,
        textAlign: 'center',
    },
});
