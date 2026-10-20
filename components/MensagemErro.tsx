import { StyleSheet, Text, View } from "react-native";
import Botao from "./Botao";

type MensagemErroProps = {
    titulo: string,
    mensagem: string,
    onTentarNovamente: () => void
}

export default function MensagemErro({
    titulo, mensagem, onTentarNovamente
}: MensagemErroProps){
    return (
        <View style={styles.container}>
            <View style={styles.caixa}>
                <Text style={styles.titulo}>{titulo}</Text>
                <Text style={styles.mensagem}>{mensagem}</Text>
                <Botao titulo='Tentar novamente' onPress={onTentarNovamente} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },

    caixa: {
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#c00',
        padding: 20,
    },

    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#c00',
        marginBottom: 8,
    },

    mensagem: {
        fontSize: 15,
        marginBottom: 8,
    },
});
