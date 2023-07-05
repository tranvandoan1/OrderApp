import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { FlatGrid } from 'react-native-super-grid';
import AntDesign from 'react-native-vector-icons/AntDesign';

type Props = {
    language: any
    background: any
    widthScale: any
    width: any
    navigation?: any
    router: any
    setRouter: (e: any) => void
    hiddeDrawer: () => void
}
const Navbar: React.FC<Props> = ({ language, background, widthScale, width, navigation, setRouter, router, hiddeDrawer }) => {
    const data = [
        {
            id: 2,
            name: `${language?.data?.setting?.cart}`,
            navigation: 'bill',
            icon: 'shoppingcart',
        },
        {
            id: 3,
            name: `${language?.data?.setting?.account}`,
            navigation: 'account',
            icon: 'user',
        },
        {
            id: 1,
            name: `${language?.data?.setting?.setting}`,
            navigation: 'setting',
            icon: 'setting',
        },
        {
            id: 4,
            name: `${language?.data?.setting?.back}`,
            navigation: 'home',
            icon: 'arrowleft',
        },
    ];
    return (
        <View
            style={{
                zIndex: 0,
                flex: 1,
                flexDirection: 'column',
                alignItems: 'flex-start',
            }}>
            <FlatGrid
                showsVerticalScrollIndicator={false}
                data={data}
                horizontal
                renderItem={({ item, index }: any) => {
                    return (
                        <TouchableOpacity
                            style={[
                                styles.item,
                                {
                                    backgroundColor:
                                        router == item.navigation ? 'tomato' : '#fff',
                                },
                            ]}
                            onPress={() =>
                                item.id == 4
                                    ? navigation.goBack()
                                    : (setRouter(`${item.navigation}`), hiddeDrawer())
                            }>
                            <View style={styles.li}>
                                <AntDesign
                                    name={`${item.icon}`}
                                    size={30}
                                    style={{
                                        marginRight: 4,
                                        color: router == item.navigation ? '#fff' : 'black',
                                    }}
                                />
                                <Text
                                    style={{
                                        fontSize: width < 720 ? widthScale * 25 : widthScale * 27,
                                        color: router == item.navigation ? '#fff' : 'black',
                                    }}>
                                    {item.name}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    )
}

export default Navbar

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        borderColor: 'rgb(219, 219, 219)',
        borderWidth: 1,
        marginVertical: 5,
        borderRadius: 3,
        elevation: 10,
        shadowColor: '#FF9966',
        marginTop: 0,
        width: '100%',
        paddingHorizontal: 20
    },
    li: {
        flexDirection: 'row',
        alignItems: 'center',
    },
})