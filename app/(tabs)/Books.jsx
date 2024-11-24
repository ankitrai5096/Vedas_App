import { View, Text, ScrollView, Image, StyleSheet, TextInput, Modal, TouchableWithoutFeedback } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { BellIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import Categories from '../../components/Categories';
import axios from 'axios';
import RecommnededBooks from '../../components/RecommnededBooks';
import { collection, getDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { auth, db, fireDB } from '../../Configs/FirebaseConfig';
import { Video } from 'expo-av';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NameInitialsAvatar } from 'react-name-initials-avatar';
import UserAvatar from 'react-native-user-avatar';
import { Colors } from '../../constants/Colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import CategoryTags from '../../components/CategoryTags';


export default function HomeScreen() {

  const currentUser = useSelector((state) => state.auth.user);
  const user = auth().currentUser;




  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);
  // const [user, setUser] = useState({});
  const [categoriesData, setCategoriesData] = useState([]);
  const [books, setBooks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null);

  const navigation = useNavigation();



  useEffect(() => {
    fetchCategories();
    fetchBooksByCategory();
    console.log("current user from redux", currentUser)
  }, [currentUser]);

  handleChangeCategory = category => {
    fetchBooksByCategory(category);
    setActiveCategory(category);
    setBooks([]);

  }


  const fetchUser = async () => {

    try {
      if (user) {
        const userDocRef = fireDB.collection('users').doc(currentUser.uid);
        const documentSnapshot = await userDocRef.get();

        if (documentSnapshot.exists) {
          const userData = documentSnapshot.data();
          // setUser(userData);
          console.log('User data from Firestore at home page:', userData);
        } else {
          console.log('No such document!');
        }
      } else {
        console.log('No user is logged in.');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };




  const fetchCategories = async () => {
    try {
      if (user) {
        const storiesCategoryRef = fireDB
          .collection('categories')
          .doc('MNfBRAvIBxnjZLxklVuQ')
          .collection('storiesCategory');

        const querySnapshot = await storiesCategoryRef.get();

        if (querySnapshot.empty) {
          console.log('No documents found in the storiesCategory collection!');
          return;
        }

        const categoriesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCategoriesData(categoriesData);
      } else {
        console.log('No user is logged in.');
      }
    } catch (error) {
      console.error('Error fetching categories: ', error);
    }
  };



  const fetchBooksByCategory = async (category) => {
    try {

      if (user) {


        // Reference to the storiesCategory collection
        const storiesCategoryRef = fireDB
          .collection('categories')
          .doc('MNfBRAvIBxnjZLxklVuQ')
          .collection('storiesCategory');

        // Query to find the category
        const categoryQuerySnapshot = await storiesCategoryRef
          .where('strCategory', '==', category || activeCategory)
          .get();

        if (categoryQuerySnapshot.empty) {
          console.log(`No category found for '${category}'`);
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
        setBooks(allBooks); // Ensure `setBooks` is properly defined in your component
      } else {
        console.log("user not authenticated")
      };
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };




  const [activeCategory, setActiveCategory] = useState('Mahadev');
  return (



    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >





        <View style={styles.searchContainer}>
          <TextInput
            placeholder='Search a book here...'
            placeholderTextColor={"#ffff"}
            // placeholderFontWeight={'500'}
            style={{ flex: 1, fontSize: hp(2),fontWeight:'bold' }}
          />
          <MagnifyingGlassIcon size={hp(2.3)} strokeWidth={3} color={'#fff'} />
        </View>


        {/* Categories */}
        <View style={styles.line} />
        <View>
          {categoriesData && (
            <CategoryTags categoriesData={categoriesData} handlePlayIconPress={handlePlayIconPress} activeCategory={activeCategory} handleChangeCategory={handleChangeCategory} />
          )}

        </View>

        <View>
          <RecommnededBooks books={books} categoriesData={categoriesData} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',

  },
  scrollViewContent:{
    marginTop: 40,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: Colors.Primary,
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 10,
    paddingHorizontal: 20,
  },
  openButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  openButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 103, 31, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',

  },
  modalContent: {
    width: '90%',
    backgroundColor: '#ffff',
    borderRadius: 15,
    overflow: 'hidden',
    alignItems: 'center',
    borderColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 4,
  },
  video: {
    width: '100%',
    height: 450,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',

  },
  controlButton: {
    position: 'absolute',
    top: -440,
    left: 120,

  },
});
