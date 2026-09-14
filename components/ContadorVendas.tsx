import { useState } from "react";
import { Button, Text, View } from "react-native";


export default function ContadorVendas() {

    const [quantidade, setQuantidade] = useState(0);

    function incrementar(){
        setQuantidade(quantidade + 1);
    }

    function decrementar(){
        if (quantidade > 0) {
            setQuantidade(quantidade - 1);
        }
    }

    function resetar(){
        setQuantidade(0);
    }

    return(
        <View>

            <Text>Quantidade: {quantidade}</Text>

            <Button title='+' onPress={incrementar}></Button>

            {quantidade > 0 && (<Button title='-' onPress={decrementar}></Button>)}

            <Button title='RESET' onPress={resetar}></Button>

        </View>
    )
}
