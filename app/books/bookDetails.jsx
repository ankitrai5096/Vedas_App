import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import Loading from '../../components/Loading';
import { useRoute } from '@react-navigation/native';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useSelector } from 'react-redux';
import { auth, fireDB } from '../../Configs/FirebaseConfig';
import RecommnededBooks from '../../components/RecommnededBooks';
import YouMayAlsoLike from '../../components/YouMayAlsoLike';

export default function Members() {

    const currentUser = useSelector((state) => state.auth.user);
    const user = auth().currentUser;
    const navigation = useNavigation();
    const route = useRoute();
    const router = useRouter();

    const item = useLocalSearchParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);


    const [categoriesData, setCategoriesData] = useState([]);
    const [books, setBooks] = useState([]);



    const fetchBooksByCategory = async (item) => {
        try {

            if (user && item.strCategory) {


                // Reference to the storiesCategory collection
                const storiesCategoryRef = fireDB
                    .collection('categories')
                    .doc('MNfBRAvIBxnjZLxklVuQ')
                    .collection('storiesCategory');

                // Query to find the category
                const categoryQuerySnapshot = await storiesCategoryRef
                    .where('strCategory', '==', item.strCategory)
                    .get();

                if (categoryQuerySnapshot.empty) {
                    console.log(`No category found for '${item.strCategory}'`);
                    return;
                }

                // Iterate over the matching categories
                const allBooks = [];
                for (const categoryDoc of categoryQuerySnapshot.docs) {
                    console.log('Category Found:', categoryDoc.id, categoryDoc.data());

                    // Reference to the Books sub-collection
                    const booksRef = storiesCategoryRef
                        .doc(categoryDoc.id)
                        .collection('Books');

                    const booksSnapshot = await booksRef.get();

                    if (booksSnapshot.empty) {
                        console.log('No books found in the Books subcollection!');
                        continue;
                    }

                    const booksData = booksSnapshot.docs.map((bookDoc) => ({
                        id: bookDoc.id,
                        ...bookDoc.data(),
                    }));

                    allBooks.push(...booksData);
                }

                console.log('Books:', allBooks);
                setBooks(allBooks);
            } else {
                console.log("user not authenticated")
            };
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    useEffect(() => {
        if (item) {
            setBook(item);
            setLoading(false);
            fetchBooksByCategory(item)
        }
    }, []);

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
            style={styles.container}
        >
            <StatusBar style="light" />

            {/* 
            <View style={styles.imageContainer}>
            </View> */}




            {/* Back Button */}
            <View style={styles.backButtonContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={{ fontWeight: 'bold', color: 'white' }}>{'< Go back'}</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <Loading size="large" />
            ) : book ? (
                <View style={styles.contentContainer}>

                    <View style={[styles.shadowBox, { backgroundColor: 'rgba(211, 211, 211, 0.3)', top: 108, left: 0 }]} />

                    <View style={[styles.shadowBox, { backgroundColor: 'rgba(211, 211, 211, 0.5)', top: 113, left: 5 }]} />

                    {/* Second Box - Background Shadow */}
                    <View style={[styles.shadowBox, { backgroundColor: 'rgba(176, 176, 176, 0.9)', top: 118, left: 10 }]} />

                    <View style={styles.imageContainer2}>
                        <Image
                            source={{ uri: book?.thumbnail || 'default_image_url_here' }}
                            style={styles.recipeImage}
                        />

                        <View style={styles.textContainer}>
                            <Text style={styles.bookName}>{book?.bookName}</Text>
                            <Text style={styles.bookAuthor}>{book?.bookAuthor}</Text>
                            <TouchableOpacity onPress={() =>
                                router.push({
                                    pathname: "/books/readingSpace",
                                    params: { bookContent: item?.BookDetail },
                                })
                            } style={styles.button}>
                                <Text style={styles.buttonText}>Start Reading</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                    <Text style={styles.heading}>Discription</Text>
                    <View style={styles.line} />
                    <View style={styles.textContainer}>
                        <Text style={styles.bookSummary}>{book?.BookSummary}</Text>
                    </View>



                    <Text style={styles.heading}>You may also like </Text>
                    <View style={styles.line2} />

                    <YouMayAlsoLike books={books} book={book} />


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
        backgroundColor: Colors.Primary,
        height: 300,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,

    },
    imageContainer2: {
        marginTop: 100,
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 15,
        marginBottom: 25,
        position: 'relative', // To layer elements inside
    },

    shadowBox: {
        position: 'absolute',
        width: wp(40),
        aspectRatio: 9 / 12,
        borderRadius: 5,
    },

    recipeImage: {
        width: wp(40),
        aspectRatio: 9 / 12,
        borderRadius: 5,
        zIndex: 10, 
    },

    line: {
        height: 2,
        backgroundColor: 'rgba(255, 103, 31, 0.6)',
        width: '30%',
        borderRadius: 10,
        // opacity: 0.2,
        marginTop: 5,
    },
    line2: {
        height: 2,
        backgroundColor: 'rgba(255, 103, 31, 0.6)',
        width: '45%',
        borderRadius: 10,
        // opacity: 0.2,
        marginTop: 5,
    },
    recipeImage: {
        width: wp(40),
        aspectRatio: 9 / 12,
        borderRadius: 5,



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
        textAlign: 'left',
        // gap:10,
    },
    bookName: {
        fontSize: hp(2.5),
        fontWeight: 'bold',
        color: '#374151',
        textAlign: 'left',
        marginBottom: 5,
    },
    bookAuthor: {
        fontSize: hp(1.8),
        fontWeight: '500',
        color: '#6B7280',
        textAlign: 'left',
        opacity: 0.7,
        marginBottom: 15,
    },
    heading: {
        fontSize: hp(2.2),
        opacity: 1,
        fontWeight: 'bold',
        color:"rgba(255, 103, 31, 0.8)"

    },
    bookSummary: {
        marginTop: 10,
        fontSize: hp(2),
        opacity: 0.4,
        fontWeight: '500',

    },
    bookDetail: {
        fontSize: hp(1.9),
        fontWeight: '500',
        color: '#4B5563',

    },
    button: {
        backgroundColor: '#FF671F',
        borderRadius: 5,
        padding: 10,
        width: wp(35.5),
        alignSelf: 'left',
        // marginTop: 25,
    },
    buttonText: {
        color: Colors.white,
        fontSize: 15,
        textAlign: 'left',
        fontWeight: 'bold'
    },
});
