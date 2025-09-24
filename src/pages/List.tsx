import { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, Image, ScrollView, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SpotList } from '../components/SpotList'; // componente que mostra lista de spots
import logo from '../assets/logo.png';
import socketio from 'socket.io-client';

export function List(){
    // estado com as tecnologias (React, Node, etc)
    const [techs, setTechs] = useState<string[]>([])

    // conecta com o backend pelo socket
    useEffect( () =>{
        AsyncStorage.getItem('user').then( user_id =>{
            // conecta no servidor passando o id do user
            const socket = socketio('http://10.53.52.44:3335', {
                query: { user_id }
            })
            // escuta resposta de reserva (aprovada ou rejeitada)
            socket.on('booking_response', booking =>{
                Alert.alert(`Sua reserva em ${booking.spot.company} foi 
                    ${booking.approved ? 'APROVADO' : 'REJEITADA'}`)
            })
        })
    },[])

    // carrega techs salvas no storage
    useEffect( () =>{
        const loadTechs = async() =>{
            const storagedTechs = await AsyncStorage.getItem('techs')
            if (storagedTechs){
                const techsArray = storagedTechs.split(',')
                .map((tech) => tech.trim()); // tira espaços extras
                setTechs(techsArray); // salva no estado
            } else {
                setTechs([]); // se não tiver nada, fica vazio
            }
        }
        loadTechs();
    },[])

    return(
        <SafeAreaView style={styles.container}>
            {/* logo no topo */}
            <Image style={styles.logo} source={logo} />
            {/* lista de spots por tecnologia */}
            <ScrollView>
                {techs.map(tech => <SpotList key={tech} tech={tech} />)}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1
    },
    logo: {
        height:32,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: 40
    }
})
