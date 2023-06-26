import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import AxiosInstance from '../../api/AxiosInstance';
import { DataContext } from '../../context/DataContext';
import StarRating from 'react-native-star-rating-widget';
import ModalLivro from '../ModalLivro';
import { Divider } from '@rneui/themed';
import { AppearanceContext } from '../../context/AppearanceContext';
import { sharedStyles, darkStyles, lightStyles } from '../../themes/index';
import { FontAwesome5, FontAwesome, Entypo } from '@expo/vector-icons';

import {
    FlatList,
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from 'react-native';

const ItemEditora = ({ img, nomeEditora, id, destaque, showStars }) => {
    const navigation = useNavigation();
    const [rating, setRating] = useState(4.5);

    const handlePress = () => {
        navigation.navigate('Editora', { editoraId: id });
    }

    return (
        <TouchableOpacity onPress={handlePress}>
            <View style={styles.itemEditora}>
                <Image
                    style={destaque ? styles.destaqueItemPhoto : styles.itemPhoto}
                    source={{ uri: `data:image/png;base64,${img}` }}
                />
                {showStars && (
                    <StarRating
                        rating={rating}
                        onChange={setRating}
                    />
                )}

                <View style={styles.itemTextContainerEditora}>
                    <Text style={styles.itemTextEditoras}>{nomeEditora}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
};

const ItemLivro = ({ img, nomeLivro, id, showModal, nomeAutor }) => {

    const handlePress = () => {
        showModal({ id });
    }

    return (
        <TouchableOpacity onPress={handlePress}>
            <View style={styles.itemLivro}>
                <Image
                    style={styles.itemPhotoLivro}
                    source={{ uri: `data:image/png;base64,${img}` }}
                />
                <View style={styles.itemTextContainerLivro}>
                    <Text style={styles.itemTextLivro}>{nomeLivro}</Text>
                    <Text style={styles.itemTextAutor}>{nomeAutor}</Text>
                </View>
            </View>

        </TouchableOpacity>
    )
};

const Home = () => {
    const { dadosUsuario } = useContext(DataContext);
    const [dadosEditora, setDadosEditora] = useState([]);
    const [dadosLivro, setDadosLivro] = useState([]);
    const [dadosAutor, setDadosAutor] = useState([]);
    const [visible, setVisible] = React.useState(false);
    const [livro, setLivro] = React.useState([]);
    const [isLoading, setIsLoading] = useState(false); // importante para o loading
    const { colorScheme } = useContext(AppearanceContext);

    const styles = colorScheme === 'light' ? lightStyles : darkStyles;

    const showModal = ({ id, nomeAutor }) => {
        const livro = dadosLivro.find(livro => livro.codigoLivro === id);
        setLivro({ ...livro, nomeAutor });
        setVisible(true);
    };
    const hideModal = () => setVisible(false);

    useEffect(() => {
        getAllEditoras();
        getAllLivros();
        getAllAutores();
    }, [])

    // adicionei a consulta para autores para poder adicionar na renderização
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
    const getAllLivros = async () => {
        setIsLoading(true); // Similar changes for other requests
        await AxiosInstance.get(
            '/livros',
            { headers: { 'Authorization': `Bearer ${dadosUsuario?.token}` } }
        ).then(resultado => {
            setDadosLivro(resultado.data);
            setIsLoading(false);
        }).catch((error) => {
            console.log('Ocorreu um erro ao recuperar os dados dos Livros: ' + error);
            setIsLoading(false);
        })
    }

    const getAllAutores = async () => {
        setIsLoading(true);
        await AxiosInstance.get(
            '/autores',
            { headers: { 'Authorization': `Bearer ${dadosUsuario?.token}` } }
        ).then(resultado => {
            setDadosAutor(resultado.data);
            setIsLoading(false);
        }).catch((error) => {
            console.log('Ocorreu um erro ao recuperar os dados dos autores: ' + error);
            setIsLoading(false);
        })
    }
    // ta imprimindo correto mas não pega
    console.log(dadosAutor)
    dadosAutor.forEach(autor => console.log(autor.nomeAutor));

    // verifica as requisições sendo realizadas
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
            <SafeAreaView style={[sharedStyles.container, styles.container]}>
                <StatusBar style="light" />
                <View style={{ flex: 1 }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.title}>
                            <FontAwesome5 name="book-reader" size={24} color="#07261d" />
                            <Text style={styles.sectionHeader}>EDITORAS</Text>
                        </View>
                        <Divider />
                        <FlatList
                            data={dadosEditora}
                            renderItem={({ item }) => <ItemEditora nomeEditora={item.nomeEditora} img={item.img} id={item.codigoEditora} />}
                            keyExtractor={item => item.codigoEditora}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />
                        <View style={styles.title}>
                            <Entypo name="book" size={24} color="#07261d" />
                            <Text style={styles.sectionHeader}>LIVROS</Text>
                        </View>
                        <Divider />
                        <FlatList
                            data={dadosLivro}
                            renderItem={({ item }) => <ItemLivro nomeLivro={item.nomeLivro} img={item.img} id={item.codigoLivro} showModal={() => showModal({ id: item.codigoLivro, nomeAutor: item.autorDTO.nomeAutor })}
                                hideModal={hideModal}
                                visible={visible}
                                nomeAutor={item.autorDTO.nomeAutor} />}
                            keyExtractor={item => item.codigoLivro}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />
                        <View style={styles.title}>
                            <FontAwesome name="trophy" size={24} color="#07261d" />
                            <Text style={styles.sectionHeader}>DESTAQUE</Text>
                        </View>
                        <Divider />
                        {dadosEditora.length > 0 &&
                            <ItemEditora
                                nomeEditora={dadosEditora[0].nomeEditora}
                                img={dadosEditora[0].img}
                                id={dadosEditora[0].codigoEditora}
                                destaque={true}
                                showStars={true}
                            />
                        }
                    </ScrollView>

                </View>
                <ModalLivro visible={visible} hideModal={hideModal} livro={livro} />
            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({
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
    sectionHeader: {
        fontWeight: '800',
        fontSize: 18,
        color: '#07261d',
    },
    itemPhoto: {
        width: 200,
        height: 200,
        borderRadius: 13,
    },
    itemPhotoLivro: {
        width: 200,
        height: 200,
        borderTopLeftRadius: 13,
        borderTopRightRadius: 13,
    },
    destaqueItemPhoto: {
        width: '100%',
        height: 200,
        borderRadius: 13,
    },
    itemEditora: {
        margin: 10,
        position: 'relative',
    },
    itemTextEditoras: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 18,
    },
    itemTextContainerEditora: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 13,
    },
    itemLivro: {
        margin: 10,
    },
    itemTextLivro: {
        color: '#66d2b1',
        fontSize: 18,
        marginVertical: 5,
        marginHorizontal: 10,
    },
    itemTextAutor: {
        color: '#66d2b1',
        fontSize: 14,
        marginVertical: 5,
        marginHorizontal: 10,
    },
    itemTextContainerLivro: {
        width: 200,
        backgroundColor: '#07261d',
        borderBottomStartRadius: 5,
        borderBottomEndRadius: 5,
    },
    errorText: {
        color: 'grey',
        marginLeft: 10,
        fontSize: 18,
    },
    starsContainer: {
        position: 'absolute',
        bottom: -9,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
        zIndex: 1,
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 10,
    },
    starUnselected: {
        color: '#888',
        marginHorizontal: 2,
    },
    starSelected: {
        color: 'black',
    }
});

export default Home;