import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Login } from './pages/Login';
import { List } from './pages/List';
import { Book } from './pages/Book';

// aqui eu defino os nomes das rotas e o que cada uma espera receber
export type RootStackParamList = {
    Login: undefined; // não precisa de params
    List: undefined;  // não precisa de params
    Book: { id: string } // Book precisa receber um id (do spot)
}

// crio a pilha de navegação já tipada
const Stack = createNativeStackNavigator<RootStackParamList>();

// componente principal de rotas
export default function Routes(){
    return(
        <NavigationContainer>
            <Stack.Navigator 
                initialRouteName="Login" // primeira tela quando abre o app
                screenOptions={{ headerShown: false }} // escondo o header padrão
            >
                {/* defino as telas */}
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="List" component={List} />
                <Stack.Screen name="Book" component={Book} />          
            </Stack.Navigator>
        </NavigationContainer>
    )
}
