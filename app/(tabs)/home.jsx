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
import { Colors } from '../../constants/Colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Homefeed from '../Veeds/homeFeed';





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


  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    setIsPlaying(false);
  };


  useEffect(() => {
        fetchUser();
        fetchCategories();
        fetchBooksByCategory();
    // console.log("current user from redux", currentUser)
  }, [currentUser]);

  handleChangeCategory = category => {
    fetchBooksByCategory(category);
    setActiveCategory(category);
    setBooks([]);

  }

  handlePlayIconPress = category => {
    console.log("icon is pressed")
    toggleModal();
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
      <View style={styles.avatarContainer}>

        <View style={styles.avatarusername}>
          <Text style={styles.avatarText}>Vedas</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, }}>
            <MaterialIcons name="notifications-none" size={32} color="black" />
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>

              <Image style={{ width: 30, height: 30, marginLeft: 5 }} source={require('../../assets/images/profile-pic.png')} />
            </TouchableOpacity>


          </View>


        </View>





      </View>
      <Modal
        transparent
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={toggleModal}
      >
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Video
                source={require('../../assets/images/mahadev-intro.mp4')}
                style={styles.video}
                resizeMode="cover"
                isLooping
                shouldPlay
                isMuted
              />
              <View style={styles.controls}>
                <TouchableOpacity onPress={toggleModal} style={styles.controlButton}>
                  <Ionicons name="close-circle" size={30} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>


      {/* Search Bar
                <View style={styles.searchContainer}>
                    <TextInput
                        placeholder='Search any recipe here'
                        placeholderTextColor={"#ffff"}
                        style={{flex:1, fontSize:hp(2)}}
                    />
                    <MagnifyingGlassIcon size={hp(2.3)} strokeWidth={3} color={'#fff'} />
                </View> */}

      {/* Categories */}
      <View style={styles.line} />
      <View>
        {categoriesData && (
          <Categories categoriesData={categoriesData} handlePlayIconPress={handlePlayIconPress} activeCategory={activeCategory} handleChangeCategory={handleChangeCategory} />
        )}

      </View>
      {/* greetings and punchline */}
      <View style={styles.greetingsContainer}>

        <Text style={styles.greetingTextMain}>Good<Text style={{ color: '#f59e0b' }}> Reads</Text></Text>
        <Text style={styles.greetingText}>
          “अग्निदेव से कहा कि माघ महीने में जो भी स्त्री सबसे पहले प्रयाग में स्नान करे उसके शरीर में आप इस शक्ति को स्थित कर देना। माघ का महीना आने पर सुबह ब्रह्म मुहूर्त में सर्वप्रथम सप्तऋषियों की पत्नियां प्रयाग में स्नान करने पहुंचीं। स्नान करने के उपरांत जब उन्होंने अत्यधिक ठंड का अनुभव किया तो उनमें से छः स्त्रियां अग्नि के पास जाकर।”
        </Text >
      </View>

      <Homefeed />


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: -10,
  },
  scrollViewContent: {
    paddingBottom: 50,
    paddingTop: hp(14),
  },
  avatarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.Primary,
    paddingHorizontal: 15,
    paddingVertical: 20,
    marginTop: 10,
    gap: 20,
    color: 'white',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    shadowColor: Colors.Primary,

    shadowOpacity: 1,
    shadowRadius: 10,


  },
  // line: {
  //   height: 6,
  //   backgroundColor: '#FF671F',
  //   width: '100%',
  //   borderRadius: 10, 
  // },

  avatarusername: {
    marginTop: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },

  // avatar:{
  //   height:hp(6),
  //   width:hp(6),
  // },
  avatarText: {
    color: Colors.white,
    fontSize: 28,
    fontFamily: 'outfit-bold',
    fontWeight: 'bold',
  },
  avatarText2: {
    marginTop: -4,
    color: 'white',
    fontSize: 16,
    fontFamily: 'outfit-bold',
    opacity: 0.7,
  },
  greetingsContainer: {
    display: 'flex',
    marginHorizontal: 16,
    marginBottom: 15,
    marginTop: 15,
    gap: 10,
  },
  greetingText: {
    fontSize: hp(2),
    color: '#4B5563',
    marginLeft: 5,
    opacity: 0.65,
    fontFamily: 'outfit-medium',
    marginBottom: 5,
  },
  greetingTextMain: {
    fontSize: hp(3),
    color: '#4B5563',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: 'black',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 20,
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
