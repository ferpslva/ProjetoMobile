import { Pressable, StyleSheet, Text } from "react-native";

type BotaoProps = {
    titulo: string,
    onPress: () => void,
    desabilitado?: boolean
}

export default function Botao({
    titulo, onPress, desabilitado = false
}: BotaoProps){
    return(
        <Pressable
        style={[styles.botao, desabilitado && styles.desabilitado]}
        onPress={onPress}
        disabled={desabilitado}>
            <Text style={styles.texto}>{titulo}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    botao: {
       borderWidth: 1,
       borderRadius: 8,
       padding: 12,
       alignItems: 'center',
       marginTop: 10,
     },

      texto: {
       fontSize: 16,
       fontWeight: 'bold',
     },

      desabilitado: {
       opacity: 0.4,
     },
   });
