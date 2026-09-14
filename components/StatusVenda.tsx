import { useState } from "react";
import { Button, Text, View } from "react-native";


export default function StatusVenda() {

    const [status, setStatus] = useState('Aguardando Pagamento');

    function alterarStatus(novoStatus: string){
        setStatus(novoStatus)
    }

    return(
        <View>
            <Text>
                Status: {status}
            </Text>

            {
                status === 'Aguardando Pagamento' ?
                (<Button title="Confirmar Pagamento" onPress={() => alterarStatus('Em Separação')}></Button>)
                :
                (<Button title="Concluir Venda" onPress={() => alterarStatus('Concluída')}></Button>)
            }

        </View>
    )
}
