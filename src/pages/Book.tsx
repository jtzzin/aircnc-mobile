import { StyleSheet, Alert, SafeAreaView, Image, Text, TextInput, TouchableOpacity, Platform, View } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// Importa o DatePicker
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";

import logo from "../assets/logo.png";
import api from "../services/api";
import { RootStackParamList } from "../routes";

type BookRouteProp = RouteProp<RootStackParamList, "Book">;
type BookScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Book">;

//  agora o valor virá do DatePicker, nao do jeito feio que estava ali. tinha q colocar manualmente os traços
const BookSchema = z.object({
  date: z.string()
    .min(1, "A data é obrigatória")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"), // Formato YYYY-MM-DD
});

type BookFormData = z.infer<typeof BookSchema>;

export function Book() {
  const navigation = useNavigation<BookScreenNavigationProp>();
  const route = useRoute<BookRouteProp>();
  const { id } = route.params;

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<BookFormData>({
    resolver: zodResolver(BookSchema),
    // Define o valor inicial como uma string vazia
    defaultValues: { date: '' }
  });

  // Estado para controlar a visibilidade do DatePicker
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Observa o valor atual da data no hook-form para exibição
  const selectedDate = watch('date');

  // Função que lida com a seleção da data
  const onChangeDate = (event: any, selectedDate: Date | undefined) => {
    // Esconde o picker após a seleção no iOS/Android
    setShowDatePicker(Platform.OS === 'ios');

    if (selectedDate) {
      // Formata a data para YYYY-MM-DD antes de definir no formulário
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setValue('date', formattedDate, { shouldValidate: true });
    }
  };

  async function onSubmit(data: BookFormData) {
    try {
      const user_id = await AsyncStorage.getItem("user");
      if (!user_id) {
        Alert.alert("Usuário não encontrado. Faça login novamente.");
        return navigation.navigate("Login");
      }

      console.log("Enviando reserva:", { date: data.date, user_id, spot_id: id });

      const response = await api.post(
        `/spots/${id}/bookings`,
        { date: data.date },
        { headers: { "user_id": user_id } }
      );

      console.log("Resposta do backend:", response.data);
      Alert.alert("Solicitação de reserva enviada.");
      navigation.navigate("List");
    } catch (err: any) {
      console.log("Erro ao enviar reserva:", err.response?.data || err.message);
      const backendError = err.response?.data?.error;
      Alert.alert(backendError || "Erro ao enviar a reserva");
    }
  }

  // Função auxiliar para formatar a data que é exibida no botão
  const getDisplayDate = () => {
    if (selectedDate) {
      // Converte YYYY-MM-DD para o formato DD/MM/YYYY para exibição
      const [year, month, day] = selectedDate.split('-');
      return `${day}/${month}/${year}`;
    }
    return "Toque para selecionar a data";
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.logo} source={logo} />

      <Text style={styles.label}>DATA DE INTERESSE *</Text>
      
      {/* NOVO: Botão que substitui o TextInput e abre o DatePicker */}
      <TouchableOpacity
        style={[styles.inputButton, errors.date && styles.inputError]}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={[styles.inputButtonText, selectedDate ? styles.dateSelected : styles.datePlaceholder]}>
          {getDisplayDate()}
        </Text>
      </TouchableOpacity>
      
      {/* Exibe o DatePicker se showDatePicker for true */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate ? new Date(selectedDate) : new Date()} // Usa a data selecionada ou a data atual
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChangeDate}
          // No iOS, precisa de um botão para fechar se estiver em modal
          {...(Platform.OS === 'ios' && { onTouchCancel: () => setShowDatePicker(false) })}
        />
      )}
      
      {/* Mensagem de erro */}
      {errors.date && <Text style={styles.errorText}>{errors.date.message}</Text>}

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

const styles = StyleSheet.create({
  container: { marginTop: 30, paddingHorizontal: 20 },
  logo: { height: 32, resizeMode: "contain", alignSelf: "center", marginTop: 40, marginBottom: 40 },
  label: { fontWeight: "bold", color: "#444", marginBottom: 8 },
  
  // Estilo para o novo botão que simula o input
  inputButton: { 
    borderWidth: 1, 
    borderColor: "#ddd", 
    paddingHorizontal: 20, 
    height: 44, 
    marginBottom: 10, 
    borderRadius: 2,
    justifyContent: 'center', // Centraliza verticalmente o texto
  },
  inputButtonText: {
    fontSize: 16,
  },
  dateSelected: {
    color: "#444",
  },
  datePlaceholder: {
    color: "#999",
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: { 
    color: "red", 
    marginBottom: 20,
    fontSize: 12,
  },

  // Estilos de botões e outros
  button: { height: 42, backgroundColor: "#f05a5b", justifyContent: "center", alignItems: "center", borderRadius: 2, marginTop: 10 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  cancelButton: { backgroundColor: "#ccc", marginTop: 10 },
});