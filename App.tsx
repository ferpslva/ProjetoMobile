import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListaVendasScreen from './screens/ListaVendasScreen';
import DetalheVendaScreen from './screens/DetalheVendaScreen';
import CadastroVendaScreen from './screens/CadastroVendaScreen';
import { RootStackParamList } from './navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName='ListaVendas'>
        <Stack.Screen
          name='ListaVendas'
          component={ListaVendasScreen}
          options={{ title: 'Vendas' }}
        />
        <Stack.Screen
          name='DetalheVenda'
          component={DetalheVendaScreen}
          options={{ title: 'Detalhes da venda' }}
        />
        <Stack.Screen
          name='CadastroVenda'
          component={CadastroVendaScreen}
          options={{ title: 'Nova venda' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
