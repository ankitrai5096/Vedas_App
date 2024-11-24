import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import Loading from '../../components/Loading';
import { useRoute } from '@react-navigation/native';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import { Colors } from '../../constants/Colors';

export default function Members() {
    const navigation = useNavigation();
    const route = useRoute();
    const router = useRouter();

    const item = useLocalSearchParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (item) {
            setBook(item);
            setLoading(false);
        }
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
            </View>

            <View style={styles.imageContainer2}>
            <Image
                 source={{ uri: book?.thumbnail || 'default_image_url_here' }}
                    style={styles.recipeImage}
                />
            </View>
             


            {/* Back Button */}
            <View style={styles.backButtonContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={{fontWeight:'bold',color:'white'}}>{'< Go back'}</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <Loading size="large" />
            ) : book ? (
                <View style={styles.contentContainer}>
                    {/* Name and Author */}
                    <View style={styles.textContainer}>
                        <Text style={styles.bookName}>{book?.bookName}</Text>
                        <Text style={styles.bookAuthor}>{book?.bookAuthor}</Text>
                    </View>

                    {/* Book Summary */}
                    <View style={styles.textContainer}>
                        <Text style={styles.heading}>Book Summary</Text>
                        <Text style={styles.bookSummary}>{book?.BookSummary}</Text>
                    </View>

                    {/* Book Details */}
                    {/* <View style={styles.textContainer}>
                        <Text style={styles.heading}>Book Details</Text>
                        <Text style={styles.bookDetail}>{book?.BookDetail}</Text>
                    </View> */}

                    {/* Start Reading Button */}
                    <TouchableOpacity  onPress={() =>
    router.push({
      pathname: "/books/readingSpace",
      params: { bookContent: item?.BookDetail },
    })
  }  style={styles.button}>
                        <Text style={styles.buttonText}>Start Reading</Text>
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
         backgroundColor:Colors.Primary,
         height:300,
         borderBottomLeftRadius:20,
         borderBottomRightRadius:20,

    },
    imageContainer2: {
        flexDirection: 'row',
        justifyContent: 'center',

    },
    recipeImage: {
        marginTop:-180,
        width: wp(50),
        aspectRatio: 9 / 12,
        borderRadius:10,
        paddingBottom:50,


    },
    backButtonContainer: {
        position: 'absolute',
        top: hp(5),
        left: wp(4),
    },
    contentContainer: {
        paddingHorizontal: wp(4),
        paddingVertical: hp(3),
    },
    textContainer: {
        marginBottom: hp(2),
        textAlign:'center'
    },
    bookName: {
        fontSize: hp(3.5),
        fontWeight: 'bold',
        color: '#374151',
        textAlign:'center'
    },
    bookAuthor: {
        fontSize: hp(1.8),
        fontWeight: '500',
        color: '#6B7280',
          textAlign:'center',
          marginTop:5,
          opacity:0.7,
    },
    heading: {
        fontSize: hp(2.5),
        fontWeight: 'bold',
        color: '#4B5563',

    },
    bookSummary: {
        fontSize: hp(1.9),
        fontWeight: '500',
        color: '#4B5563',

    },
    bookDetail: {
        fontSize: hp(1.9),
        fontWeight: '500',
        color: '#4B5563',

    },
    button: {
        backgroundColor: '#FF671F',
        borderRadius: 10,
        padding: 20,
        width: '60%',
        alignSelf: 'center',
        marginTop: 25,
    },
    buttonText: {
        color: Colors.white,
        fontSize: 16,
        textAlign: 'center',
    },
});
