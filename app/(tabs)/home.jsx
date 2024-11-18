import { View, Text, ScrollView, Image, StyleSheet, TextInput, Modal, TouchableWithoutFeedback } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { BellIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import Categories from '../../components/Categories';
import axios from 'axios';
import RecommnededBooks from '../../components/RecommnededBooks';
import { collection, getDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../../Configs/FirebaseConfig';
import { Video } from 'expo-av';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NameInitialsAvatar } from 'react-name-initials-avatar';
import UserAvatar from 'react-native-user-avatar';
import { Colors } from '../../constants/Colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


export default function HomeScreen() {

  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);
  const [user, setUser] = useState({});
  const [categoriesData, setCategoriesData] = useState([]);
  const [books, setBooks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    setIsPlaying(false);
  };


  useEffect(() => {
    fetchUser();
    fetchCategories();
    fetchBooksByCategory();
  }, []);

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
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const querySnapshot = await getDoc(userDocRef);

        if (querySnapshot.exists()) {
          const userData = querySnapshot.data();
          setUser(userData);
        } else {
          console.log('No such document!');
        }
      } else {
        console.log('No user is logged in.');
      }
    } catch (error) {
      console.error('Error fetching users: ', error);
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

    } catch (error) {
      console.error('Error fetching categories: ', error);
    }
  };



  const fetchBooksByCategory = async (category) => {
    try {
      const categoriesRef = collection(db, 'categories', 'MNfBRAvIBxnjZLxklVuQ', 'storiesCategory');

      const categoryQuery = query(categoriesRef, where('strCategory', '==', category));

      const categorySnapshot = await getDocs(categoryQuery);

      if (categorySnapshot.empty) {
        console.log(`No category found for '${category}'`);
        return;
      }

      // Fetch books for the selected category
      categorySnapshot.forEach(async (categoryDoc) => {
        console.log('Category Found:', categoryDoc.id, categoryDoc.data());

        const booksRef = collection(db, 'categories', 'MNfBRAvIBxnjZLxklVuQ', 'storiesCategory', categoryDoc.id, 'Books');
        const booksSnapshot = await getDocs(booksRef);

        if (booksSnapshot.empty) {
          console.log('No books found in the Books subcollection!');
          return;
        }

        const booksData = booksSnapshot.docs.map(bookDoc => ({
          id: bookDoc.id,
          ...bookDoc.data(),
        }));

        console.log('Books:', booksData);
        setBooks(booksData);
      });

    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };



  const displayName = user.fullName || 'Unknown User'; 

  // Example usage:



  // const getCategories = async () => {
  //   try {
  //     const response = await axios.get('https://themealdb.com/api/json/v1/1/categories.php');
  //     if (response && response.data && response.data.categories) {
  //       setCategories(response.data.categories);
  //     }
  //   } catch (err) {
  //     console.log('error message', err.message);
  //   }
  // };


  // const getRecipes = async (category = 'Beef') => {
  //   console.log("Fetching recipes for category:", category);
  //   try {
  //     const response = await axios.get(`https://themealdb.com/api/json/v1/1/filter.php?c=${category}`);
  //     console.log("API Response:", response.data.meals);
  //     if (response && response.data && response.data.meals) {
  //       console.log("Fetched meals:", response.data.meals);
  //       setMeals(response.data.meals);
  //     } else {
  //       console.log("No meals found in the response");
  //     }
  //   } catch (err) {
  //     console.error("Error fetching recipes:", err.message);
  //   }
  // };

  console.log("user name undfined or null ", user.fullName)

  const [activeCategory, setActiveCategory] = useState('Mahadev');
  return (

    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.avatarContainer}>

          <View style={styles.avatarusername}>
          <Text style={styles.avatarText}>Vedas</Text>
          <View style={{flexDirection:'row', alignItems:'center', gap:5,}}>
          <MaterialIcons name="notifications-none" size={32} color="black" />
          <UserAvatar style={styles.avatar} size={40} name={user.fullName} bgColors={[  "#5C6B73",
              "#A3A39D",
              "#4E4A47",
              "#D2B49F",
              "#6A4E23" ]} />
 
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
          {categoriesData.length > 0 ? (
            <Categories categoriesData={categoriesData} handlePlayIconPress={handlePlayIconPress} activeCategory={activeCategory} handleChangeCategory={handleChangeCategory} />
          ) : (
            <Text>No categories available</Text>
          )}
        </View>
        {/* greetings and punchline */}
        <View style={styles.greetingsContainer}>

          <Text style={styles.greetingTextMain}>Good<Text style={{ color: '#f59e0b' }}> Reads</Text></Text>
          <Text style={styles.greetingText}>
            “अग्निदेव से कहा कि माघ महीने में जो भी स्त्री सबसे पहले प्रयाग में स्नान करे उसके शरीर में आप इस शक्ति को स्थित कर देना। माघ का महीना आने पर सुबह ब्रह्म मुहूर्त में सर्वप्रथम सप्तऋषियों की पत्नियां प्रयाग में स्नान करने पहुंचीं। स्नान करने के उपरांत जब उन्होंने अत्यधिक ठंड का अनुभव किया तो उनमें से छः स्त्रियां अग्नि के पास जाकर आग तापने लगीं।”
          </Text >
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
    marginTop: -120,
  },
  scrollViewContent: {
    paddingBottom: 50,
    paddingTop: hp(14),
  },
  avatarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 103, 31, 0.7)' ,
    paddingHorizontal: 15,
    paddingVertical: 17,
    marginTop: 10,
    gap: 20,
    color: 'white',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    shadowColor: 'rgba(255, 103, 31, 0.6)',

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
    marginTop:30,
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    width:'100%',
  },

  // avatar:{
  //   height:hp(6),
  //   width:hp(6),
  // },
  avatarText: {
    color: Colors.white,
    fontSize: 28,
    fontFamily: 'outfit-bold',
    fontWeight:'bold',
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
    marginLeft: 20,
    opacity: 0.65,
    fontFamily: 'outfit-medium'
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
