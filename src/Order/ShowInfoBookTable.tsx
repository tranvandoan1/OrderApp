import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SizeScale } from '../Component/size';
type Props = {
    togger: (e: boolean) => void
    infoData: any
}
const ShowInfoBookTable: React.FC<Props> = ({ togger, infoData }) => {
    const widthScale = SizeScale().width;
    return (
        <View
            onTouchEndCapture={() => togger(false)}
            style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.5)',
                position: 'absolute',
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
                zIndex: 100,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <View
                style={{
                    width: widthScale * 400,
                    height: 200,
                    backgroundColor: '#fff',
                    elevation: 20,
                    shadowColor: 'blue',
                    borderRadius: 5,
                    padding: 20,
                }}>
                <Text
                    style={{
                        color: 'black',
                        fontWeight: '500',
                        fontSize: 21,
                        textAlign: 'center',
                        marginVertical: 10,
                    }}>
                    {infoData?.name}
                </Text>
                <Text style={{ color: 'black', fontWeight: '500', fontSize: 18 }}>
                    Khách hàng :
                    <Text style={{ color: 'red', fontWeight: '500', fontSize: 20 }}>
                        {infoData?.nameUser}
                    </Text>
                </Text>
                <Text
                    style={{
                        color: 'black',
                        fontWeight: '500',
                        fontSize: 18,
                        marginVertical: 10,
                    }}>
                    Thời gian đặt :
                    <Text style={{ color: 'red', fontWeight: '500', fontSize: 20 }}>
                        {infoData?.timeBookTable}
                    </Text>
                </Text>
                <Text style={{ color: 'black', fontWeight: '500', fontSize: 18 }}>
                    Số lượng :
                    <Text style={{ color: 'red', fontWeight: '500', fontSize: 20 }}>
                        {infoData?.amount}
                    </Text>
                </Text>
            </View>
        </View>
    )
}

export default ShowInfoBookTable

const styles = StyleSheet.create({})