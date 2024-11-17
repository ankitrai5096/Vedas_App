import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Configs/FirebaseConfig';
import { heightPercentageToDP } from 'react-native-responsive-screen';

const Chat = () => {
  const [categoriesData, setCategoriesData] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchBooksByCategory = async (categoryId) => {
    try {
      const booksRef = collection(db, 'categories', 'MNfBRAvIBxnjZLxklVuQ', 'storiesCategory', categoryId, 'Books');
      const booksSnapshot = await getDocs(booksRef);

      if (booksSnapshot.empty) {
        console.log('No books found in the Books subcollection!');
        return [];
      }

      return booksSnapshot.docs.map(bookDoc => ({
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
      const storiesCategoryRef = collection(db, 'categories', 'MNfBRAvIBxnjZLxklVuQ', 'storiesCategory');
      const querySnapshot = await getDocs(storiesCategoryRef);

      if (querySnapshot.empty) {
        console.log('No documents found in the storiesCategory collection!');
        return;
      }

      const categoriesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategoriesData(categoriesData);

      const allBooks = await Promise.all(categoriesData.map(async (category) => {
        const categoryBooks = await fetchBooksByCategory(category.id);
        return categoryBooks;
      }));

      setBooks(allBooks.flat());
    } catch (error) {
      console.error('Error fetching categories: ', error);
    }
  };
  console.log("all books", books)
  console.log("categories data for mahadev", categoriesData[4])

  return (
    <View style={styles.container}>
      <Text style={styles.greetingTextMain}>Books Shelf</Text>
      <ScrollView>
        {categoriesData.map((category, index) => (
          <View key={category.id}>
            <Text style={styles.categoryTitle}>{category.strCategory}</Text>
            {books.filter(book => book.strCategory === category.strCategory).map((book) => (
              <View key={book.id} style={styles.bookContainer}>
              <Image 
                source={{ uri: book.thumbnail }} 
                style={styles.thumbnail} 
                resizeMode="cover" // Adjust as needed
              />
              <Text>{book.bookName}</Text>
            </View>
            ))}
          </View>
        ))}
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
    fontSize: heightPercentageToDP(3),
    color: '#f59e0b',
    fontWeight: 'bold',
  },
  categoryTitle: {
    fontSize: heightPercentageToDP(2.5),
    fontWeight: 'bold',
    marginVertical: 10,
  },
  thumbnail: {
    width: 100,
    height: 150, 
    marginBottom: 5,
    borderRadius:5
  },
});
