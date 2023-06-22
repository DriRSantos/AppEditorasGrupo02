import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    StatusBar,
}
    from "react-native";

import { useState, useContext } from "react";
import AxiosInstance from "../../api/AxiosInstance";
import { DataContext } from "../../context/DataContext";
import { Ionicons } from '@expo/vector-icons';

const Login = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const { armazenarDadosUsuario } = useContext(DataContext);
    const [hidePass, setHidePass] = useState(true);

    const handleLogin = async () => {
        console.log(`E-mail: ${email} - Senha: ${senha}`);

        try {
            const resultado = await AxiosInstance.post('/auth/signin', {
                username: email,
                password: senha
            });
            console.log(resultado);

            if (resultado.status === 200) {
                var jwtToken = resultado.data;
                armazenarDadosUsuario(jwtToken["accessToken"]);
                console.log(jwtToken);
                navigation.navigate("Main");
            } else {
                console.log('erro ao realizar o login');
            }
        } catch (error) {
            console.log('erro durante o processo de login: ' + error);
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <Text style={styles.txt} >Bem Vindo</Text>
            <Text style={styles.txtinput} >Email:</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={setEmail}
                value={email}
            />
            <Text style={styles.txtinput} >Senha:</Text>
            <View style={styles.inputArea}>
                <TextInput
                    style={styles.inputSenha}
                    placeholder="Senha"
                    onChangeText={setSenha}
                    value={senha}
                    secureTextEntry={hidePass}
                />
                <TouchableOpacity style={styles.icon} onPress={() => setHidePass(!hidePass)}>
                    {hidePass ?
                        <Ionicons name="eye" color="#07261d" />
                        :
                        <Ionicons name="eye-off" color="#07261d" />
                    }
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => handleLogin()} >
                <Text style={styles.txtButton}>Login</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#51cba6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    txt: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#04140f',
    },
    txtinput: {
        color: '#04140f',
    },
    input: {
        backgroundColor: '#a8e5d3',
        borderRadius: 13,
        width: 200,
        height: 30,
        margin: 5,
        padding: 3,
        borderTopLeftRadius: 2,
        borderBottomRightRadius: 2,
    },
    inputArea: {
        flexDirection: 'row',
    },
    inputSenha: {
        backgroundColor: '#a8e5d3',
        borderBottomLeftRadius: 13,
        borderTopLeftRadius: 2,
        width: 170,
        height: 30,
        marginTop: 5,
        padding: 3,
    },
    icon: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#a8e5d3',
        marginTop: 5,
        borderBottomRightRadius: 2,
        borderTopRightRadius: 13,

    },
    button: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#07261d',
        marginTop: 10,
        width: 90,
        height: 45,
        borderRadius: 13,
    },
    txtButton: {
        color: '#66d2b1',
    },
})

export default Login;