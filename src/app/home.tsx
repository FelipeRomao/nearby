import { View, Text, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import MapView, { Callout, Marker } from 'react-native-maps';

import { api } from '@/services/api';
import { PlaceProps } from '@/components/place';
import { Places } from '@/components/places';
import { colors, fontFamily } from '@/styles/theme'
import { Categories, CategoriesProps } from '@/components/categories';
import { router } from 'expo-router';

type MarketProps = PlaceProps & {
    latitude: number;
    longitude: number;
}

const currentLocation = {
    latitude: -23.561187293883442,
    longitude: -46.656451388116494
}

export default function Home() {
    const [categories, setCategories] = useState<CategoriesProps>([]);
    const [category, setCategory] = useState('');
    const [markets, setMarkets] = useState<MarketProps[]>([]);

    async function fetchCategories() {
        try {
            const { data } = await api.get('/categories');
            setCategories(data);
            setCategory(data[0].id);
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Failed to fetch categories');
        }
    }

    async function fetchMarkets() {
        try {
            if (!category) return;

            const { data } = await api.get('/markets/category/' + category);
            setMarkets(data);
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Failed to fetch markets');
        }
    }

    async function getCurrentLocation() {
        try {
            const { granted } = await Location.requestForegroundPermissionsAsync();

            if (granted) {
                const { coords } = await Location.getCurrentPositionAsync();
                currentLocation.latitude = coords.latitude;
                currentLocation.longitude = coords.longitude;
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Failed to get current location');
        }
    }

    useEffect(() => {
        // getCurrentLocation();
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchMarkets();
    }, [category]);

    console.log(currentLocation);

    return (
        <View style={{ flex: 1, backgroundColor: "#CECECE" }}>
            <Categories
                data={categories}
                onSelect={setCategory}
                selected={category}
            />

            <MapView style={{ flex: 1 }} initialRegion={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            }}>
                <Marker
                    coordinate={currentLocation}
                    identifier='current'
                    image={require('@/assets/location.png')}
                />

                {markets.map((market) => (
                    <Marker
                        key={market.id}
                        identifier={market.id}
                        coordinate={{
                            latitude: market.latitude,
                            longitude: market.longitude
                        }}
                        title={market.name}
                        description={market.description}
                        image={require('@/assets/pin.png')}
                    >
                        <Callout onPress={() => router.navigate(`/market/${market.id}`)}>
                            <Text style={{
                                fontSize: 14,
                                color: colors.gray[600],
                                fontFamily: fontFamily.medium
                            }}
                            >
                                {market.name}
                            </Text>

                            <Text style={{
                                fontSize: 12,
                                color: colors.gray[600],
                                fontFamily: fontFamily.regular
                            }}
                            >
                                {market.address}
                            </Text>
                        </Callout>
                    </Marker>
                ))}
            </MapView>

            <Places data={markets} />
        </View>
    )
}