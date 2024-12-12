import { useEffect, useState, useRef } from 'react';
import { View, Alert, Modal, StatusBar } from 'react-native';
import { router, useLocalSearchParams, Redirect } from 'expo-router';
import { useCameraPermissions, CameraView } from 'expo-camera';

import Loading from '@/components/loading';

import { api } from '@/services/api';
import { Cover } from '@/components/market/cover';
import { Details, PropsDetails } from '@/components/market/details';
import { Coupon } from '@/components/market/coupon';
import { Button } from '@/components/button';
import { ScrollView } from 'react-native-gesture-handler';

type DataProps = PropsDetails & {
    cover: string;
}

export default function Market() {
    const [data, setData] = useState<DataProps>();
    const [isLoading, setIsLoading] = useState(true);
    const [coupon, setCoupon] = useState<string | null>(null);
    const [couponIsFetching, setCouponIsFetching] = useState(false);
    const [isVisibleCameraModal, setIsVisibleCameraModal] = useState(false);

    const [_, requestPermission] = useCameraPermissions();
    const params = useLocalSearchParams<{ id: string }>();

    const qrLock = useRef(false);

    async function fetchMarket() {
        try {
            const { data } = await api.get('/markets/' + params.id);
            setData(data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Failed to fetch market', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        }
    }

    async function handleOpenCamera() {
        try {
            const { granted } = await requestPermission();
            if (!granted) {
                Alert.alert('Error', 'Camera permission denied', [
                    { text: 'OK', onPress: () => router.back() }
                ]);
                return;
            }

            qrLock.current = false;
            setIsVisibleCameraModal(true);
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Failed to open camera', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        }
    }

    async function getCoupon(id: string) {
        try {
            setCouponIsFetching(true);
            const { data } = await api.patch('/coupons/' + id);
            setCoupon(data.coupon);
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Failed to get coupon', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } finally {
            setCouponIsFetching(false);
        }
    }

    function handleUseCoupon(id: string) {
        setIsVisibleCameraModal(false);

        Alert.alert('Confirm', 'It is not possible to reuse a redeemed coupon. Do you really want to redeem the coupon?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'OK', onPress: () => getCoupon(id)
                }
            ]
        )
    }

    useEffect(() => {
        fetchMarket();
    }, [params.id, coupon]);

    if (isLoading) return <Loading />;

    if (!data) return <Redirect href="/home" />;

    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle="light-content" hidden={isVisibleCameraModal} />

            <ScrollView showsVerticalScrollIndicator={false}>
                <Cover uri={data.cover} />
                <Details data={data} />
                {coupon && <Coupon code={coupon} />}
            </ScrollView>

            <View style={{ padding: 32 }}>
                <Button onPress={handleOpenCamera}>
                    <Button.Title>Ler QR Code</Button.Title>
                </Button>
            </View>

            <Modal style={{ flex: 1 }} visible={isVisibleCameraModal}>
                <CameraView
                    style={{ flex: 1 }}
                    facing='back'
                    onBarcodeScanned={({ data }) => {
                        if (data && !qrLock.current) {
                            qrLock.current = true;
                            setTimeout(() => handleUseCoupon(data), 500);
                        }
                    }}
                />

                <View style={{ position: 'absolute', bottom: 32, left: 32, right: 32 }}>
                    <Button
                        onPress={() => setIsVisibleCameraModal(false)}
                        isLoading={couponIsFetching}
                    >
                        <Button.Title>Voltar</Button.Title>
                    </Button>
                </View>
            </Modal>
        </View>
    );
}