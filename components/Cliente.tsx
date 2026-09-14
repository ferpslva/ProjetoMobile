import { Text, View, StyleSheet } from "react-native";

type ClienteProps = {
    nome: string,
    cidade: string,
    totalCompras?: number,
    limiteCredito: number
}

export default function Cliente({
    nome, cidade, totalCompras, limiteCredito
}: ClienteProps) {

    return (
        <View>
            <Text
                style={[
                    styles.linha,
                    limiteCredito < 500 && styles.destacar
                ]}
            >Nome: {nome}</Text>
            <Text>Cidade: {cidade}</Text>
            {
                totalCompras && (
                    <Text>Total de compras: {totalCompras}</Text>
                )
            }
            <Text>Limite de crédito: R$ {limiteCredito.toFixed(2)}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    linha: {
        fontSize: 16,
    },

    destacar: {
        color: '#f00'
    }
});
