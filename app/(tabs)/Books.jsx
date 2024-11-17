import { StyleSheet, Text, View, ScrollView, Image, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Configs/FirebaseConfig';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '../../constants/Colors';
import Loading from '../../components/Loading';
import MasonryList from '@react-native-seoul/masonry-list';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

const Chat = () => {
  const navigation = useNavigation();

  const [categoriesData, setCategoriesData] = useState([]);
  const [books, setBooks] = useState([]);



  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchBooksByCategory = async (categoryId) => {
    try {
      const booksRef = collection(
        db,
        'categories',
        'MNfBRAvIBxnjZLxklVuQ',
        'storiesCategory',
        categoryId,
        'Books'
      );
      const booksSnapshot = await getDocs(booksRef);

      if (booksSnapshot.empty) {
        console.log('No books found in the Books subcollection!');
        return [];
      }

      return booksSnapshot.docs.map((bookDoc) => ({
        id: bookDoc.id,
        ...bookDoc.data(),
      }));
    } catch (error) {
      console.error('Error fetching books:', error);
      return [];
    }
  };

  const fetchCategories = async () => {
    try {
      const storiesCategoryRef = collection(
        db,
        'categories',
        'MNfBRAvIBxnjZLxklVuQ',
        'storiesCategory'
      );
      const querySnapshot = await getDocs(storiesCategoryRef);

      if (querySnapshot.empty) {
        console.log('No documents found in the storiesCategory collection!');
        return;
      }

      const categoriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategoriesData(categoriesData);

      const allBooks = await Promise.all(
        categoriesData.map(async (category) => {
          const categoryBooks = await fetchBooksByCategory(category.id);
          return categoryBooks;
        })
      );

      setBooks(allBooks.flat());
    } catch (error) {
      console.error('Error fetching categories: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greetingTextMain}>Available Books</Text>

      <ScrollView>
        {categoriesData ? (
          categoriesData.map((category) => {
            const filteredBooks = books.filter(
              (book) => book.strCategory === category.strCategory
            );

            // Add index manually to each book
            const indexedBooks = filteredBooks.map((book, idx) => ({
              ...book,
              index: idx,
            }));

            return (
              <Animated.View
                key={category.id}
                entering={FadeInDown.delay(1000).duration(600).springify().damping(12)}
              >
                <View>
                  {/* Render Category Title */}
                  <Text style={styles.categoryTitle}>{category.strCategory}</Text>

                  {/* Render Masonry List for Each Category */}
                  <MasonryList
                    data={indexedBooks}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <Pressable
                      onPress={() => {
                        console.log('Pressed book:', item); 
                        navigation.navigate('Members', { item });
                      }}
                    >
                        <View style={[styles.bookContainer]}>
                          <Image
                            source={{ uri: item.thumbnail }}
                            style={[
                              styles.thumbnail,
                              { height: item.index % 3 === 0 ? hp(22) : hp(25) },
                            ]}
                            resizeMode="cover"
                          />
                          <Text style={styles.bookName}>
                            {item.bookName.length > 20
                              ? `${item.bookName.slice(0, 20)}...`
                              : item.bookName}
                          </Text>
                        </View>
                      </Pressable>

                    )}
                  />
                </View>
              </Animated.View>
            );
          })
        ) : (
          <Loading />
        )}
      </ScrollView>
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 50,
    paddingHorizontal: 10,
  },

  greetingTextMain: {
    fontSize: hp(3),
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: hp(1.5),
  },
  categoryTitle: {
    fontSize: hp(2),
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 2,
    color: Colors.Primary,
    padding: 5,
    backgroundColor: 'rgba(255, 103, 31, 0.2)',
    width: '28%',
    borderRadius: 10,
    textAlign: 'left',
    fontFamily: 'outfit-bold',
    marginBottom: 10,
  },
  bookContainer: {
    width: wp(42),
    marginBottom: 10,
    alignItems: 'center',
  },
  thumbnail: {
    width: wp(42),
    borderRadius: 5,
    backgroundColor: "rgba(255, 103, 31, 01)"
  },
  bookName: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
});
