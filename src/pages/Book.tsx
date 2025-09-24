import { StyleSheet, Alert, SafeAreaView, Image, Text, TextInput, TouchableOpacity } from "react-native";
// useForm = controla formulário | Controller = conecta inputs com RHF
import { useForm, Controller } from "react-hook-form";
// zod = schema de validação
import { z } from "zod";
// zodResolver = integra o zod com react-hook-form
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import logo from "../assets/logo.png";
import api from "../services/api";
import { RootStackParamList } from "../routes";

// tipagens da rota Book
type BookRouteProp = RouteProp<RootStackParamList, "Book">;
type BookScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Book">;

// schema de validação com Zod (date não pode ser vazio)
const BookSchema = z.object({
  date: z.string().min(1, "A data é obrigatória"),
});

// tipagem do form baseada no schema
type BookFormData = z.infer<typeof BookSchema>;

export function Book() {
  // navigation e route
  const navigation = useNavigation<BookScreenNavigationProp>();
  const route = useRoute<BookRouteProp>();
  const { id } = route.params; // id do spot

  // config do react-hook-form com zod
  const { control, handleSubmit, formState: { errors } } = useForm<BookFormData>({
    resolver: zodResolver(BookSchema),
  });

  // quando envio o form
  async function onSubmit(data: BookFormData) {
    // pega o user salvo no AsyncStorage
    const user_id = await AsyncStorage.getItem("user");

    // faz requisição pro backend
    await api.post(
      `/bookings/${id}/spots`,
      { date: data.date },
      { headers: { user_id } }
    );

    Alert.alert("Solicitação de reserva enviada.");
    navigation.navigate("List"); // volta pra lista
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.logo} source={logo} />

      <Text style={styles.label}>DATA DE INTERESSE *</Text>

      {/* Controller conecta o input com RHF */}
      <Controller
        control={control}
        name="date"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Qual a data você quer reservar?"
            placeholderTextColor="#999"
            autoCapitalize="words"
            autoCorrect={false}
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {/* mostra mensagem de erro se tiver */}
      {errors.date && <Text style={{ color: "red" }}>{errors.date.message}</Text>}

      <TouchableOpacity onPress={handleSubmit(onSubmit)} style={styles.button}>
        <Text style={styles.buttonText}>Solicitar reserva</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("List")}
        style={[styles.button, styles.cancelButton]}
      >
        <Text style={styles.buttonText}>Cancelar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// estilos normais
const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  logo: {
    height: 32,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  label: {
    fontWeight: "bold",
    color: "#444",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#444",
    height: 44,
    marginBottom: 20,
    borderRadius: 2,
  },
  button: {
    height: 32,
    backgroundColor: "#f05a5b",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  cancelButton: {
    backgroundColor: "#ccc",
    marginTop: 10,
  },
});
