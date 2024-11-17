import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ChevronLeftIcon, ClockIcon, FireIcon } from 'react-native-heroicons/outline';
import Loading from '../../components/Loading';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { Colors } from '../../constants/Colors';

export default function Members() {
    const navigation = useNavigation();
    const route = useRoute();
    const { item } = route.params;
    // console.log("route params", route.params)
    // console.log("item", item)
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
        setBook(item);
    }, []);

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
            style={styles.container}
        >
            <StatusBar style="light" />

            {/* Book Image */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: book?.thumbnail }}
                    style={styles.recipeImage}
                />
            </View>

            {/* Back Button */}
            <View style={styles.backButtonContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ChevronLeftIcon size={hp(3.5)} strokeWidth={4.5} color="#fbbf24" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <Loading size="large" />
            ) : book ? (
                <View style={{ paddingHorizontal: wp(4), flexDirection: 'column', justifyContent: 'space-between', paddingVertical: hp(3) }}>
                    {/* Name and Author */}
                    <View style={{ marginBottom: hp(2) }}>
                        <Text style={{ fontSize: hp(3), fontWeight: 'bold', flex: 1, color: '#374151' }}>
                            {book?.bookName}
                        </Text>
                        <Text style={{ fontSize: hp(2), fontWeight: '500', flex: 1, color: '#6B7280' }}>
                            {book?.bookAuthor}
                        </Text>
                    </View>

                    {/* Book Summary */}
                    <View style={{ marginVertical: hp(2) }}>
                        <Text style={{ fontSize: hp(2.5), fontWeight: 'bold', flex: 1, color:'black' }}>
                            Book Summary
                        </Text>
                        <Text style={{ fontSize: hp(1.9), fontWeight: 'semibold', flex: 1, color: '#4B5563' }}>
                            {book?.BookSummary}
                        </Text>
                    </View>

                    {/* Book Details */}
                    <View style={{ marginVertical: hp(2) }}>
                        <Text style={{ fontSize: hp(2.5), fontWeight: 'bold', flex: 1, color: '#4B5563' }}>
                            Book Details
                        </Text>
                        <Text style={{ fontSize: hp(1.9), fontWeight: 'semibold', flex: 1, color: '#4B5563' }}>
                            {book?.BookDetail}
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText} >Start Reading</Text>
                    </TouchableOpacity>
                </View>


            ) : (
                <Text>No book data available</Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollViewContent: {
        paddingBottom: 30,
    },
    imageContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    recipeImage: {
        width: wp(98),
        height: hp(50),
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    backButtonContainer: {
        width: '100%',
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 45,
        paddingLeft: 20,
    },
    button: {
        color: Colors.white,
        padding: 20,
        backgroundColor: '#FF671F',
        borderRadius: 10,
        marginTop: 25,
        width: '50%'
    },
    buttonText: {
        color: Colors.white,
fontSize:16
    }
});
