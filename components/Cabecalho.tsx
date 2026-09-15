import { Text, View, StyleSheet } from "react-native";


export default function Cabecalho(){
    return(
        <View style={styles.container}>
            <Text style={styles.titulo}>Vende+</Text>
            <Text style={styles.subtitulo}>Gerenciamento de Vendas</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
		flex: 1,
		padding: 30,
		justifyContent: 'center',
		alignItems: 'center'
	},

    titulo: {
		fontSize: 28,
		fontWeight: 'bold',
	},

	subtitulo: {
		fontSize: 20,
		marginTop: 20,
	},
});
