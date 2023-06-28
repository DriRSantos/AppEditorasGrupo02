import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, StatusBar, SafeAreaView, ActivityIndicator, } from 'react-native';
import { DataContext } from '../../context/DataContext';
import AxiosInstance from '../../api/AxiosInstance';
import { FontAwesome5, FontAwesome, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { sharedStyles, darkStyles, lightStyles } from '../../themes';
import { AppearanceContext } from '../../context/AppearanceContext';

const AllEditoras = () => {
    const { dadosUsuario } = useContext(DataContext);
    const [dadosEditora, setDadosEditora] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { colorScheme } = useContext(AppearanceContext);
    const style = colorScheme === 'light' ? lightStyles : darkStyles;

    const ItemEditora = ({ img, id, nomeEditora }) => {
        const navigation = useNavigation();

        const handlePress = () => {
            navigation.navigate('Editora', { editoraId: id });
        }

        return (
            <TouchableOpacity onPress={handlePress}>
                <View style={styles.itemEditora}>
                    <Image
                        style={styles.imgAllEditoras}
                        source={{ uri: `data:image/png;base64,${img}` }}
                    />
                    <Text style={styles.itemTextEditoras}>{nomeEditora}</Text>
                </View>
            </TouchableOpacity>
        )
    };

    const getAllEditoras = async () => {
        setIsLoading(true);
        await AxiosInstance.get(
            '/editoras',
            { headers: { 'Authorization': `Bearer ${dadosUsuario?.token}` } }
        ).then(resultado => {
            setDadosEditora(resultado.data);
            setIsLoading(false);
        }).catch((error) => {
            console.log('Ocorreu um erro ao recuperar os dados das Editoras: ' + error);
            setIsLoading(false);
        })
    }

    useEffect(() => {
        getAllEditoras();
    }, [])

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={{ marginTop: 20 }}>As requisições estão sendo realizadas</Text>
            </View>
        );
    }
    else {
        return (
            <SafeAreaView style={[sharedStyles.container, style.container]}>
                <StatusBar style="light" />
                <View style={{ flex: 1 }}>
                    <View style={{ display: 'flex', flexDirection: 'column' }}>
                        <View style={styles.title}>
                            <FontAwesome5 name="book-reader" size={24} color="#089A6E" />
                            <Text style={[sharedStyles.headerThree, style.headerThree]}>EDITORAS</Text>
                        </View>
                        <View style={{ width: '100%', height: 1, backgroundColor: '#9D9A9A' }}></View>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '93%', width: '100%' }} >
                        <FlatList
                            data={dadosEditora}
                            renderItem={({ item }) => <ItemEditora nomeEditora={item.nomeEditora} img={item.img} id={item.codigoEditora} />}
                            keyExtractor={item => item.codigoEditora} 
                            showsVerticalScrollIndicator={false}/>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        zIndex: 0,
    },
    searchBar: {
        margin: 10,
    },
    title: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 10,
        gap: 5,
        marginLeft: 10,
    },
    itemEditora: {
        margin: 10,
        position: 'relative',
        backgroundColor:'#F6FFFC',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#089A6E',
        padding: 3,
        color: '#089A6E',
    },
    itemTextEditoras: {
        color: '#089A6E',
    },
    itemTextContainerEditora: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    imgAllEditoras: {
        width: 110,
        height: 110,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#089A6E'
      },
});

export default AllEditoras;