import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MasonryList from '@react-native-seoul/masonry-list';

import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import Loading from './Loading';
import { useNavigation } from '@react-navigation/native';

export default function RecommnededBooks({categoriesData, books}) {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Reccomended Books</Text>
            <View>
                {categoriesData.length == 0? (
                  <Loading size="large" />  
                ) : (
                    <MasonryList
                        data={books}
                        keyExtractor={(item) => item}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, i }) => <RecipeCard item={item} index={i} navigation={navigation} />}
                        // refreshing={isLoadingNext}
                        // onRefresh={() => refetch({ first: ITEM_CNT })}
                        onEndReachedThreshold={0.1}
                    // onEndReached={() => loadNext(ITEM_CNT)}
                    />
                )}

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: wp(4),
        marginTop: hp(2),
    },
    headerText: {
        fontSize: hp(3),
        fontWeight: '600',
        color: '#4B5563', // Neutral-600 color
        marginBottom: hp(1.5),
    },
});

const RecipeCard = ({ item, index, navigation }) => {
    let isEven = index % 2 === 0;
    console.log("item before sendinf",item);

    return (
        <Animated.View entering={FadeInDown.delay(index * 100).duration(600).springify().damping(12)}>
            <Pressable
                style={[
                    hello.pressable,
                    { paddingLeft: isEven ? 0 : 8, paddingRight: isEven ? 8 : 0 },
                ]}
                onPress={()=> navigation.navigate('Members',{ item })}
            >
                <Image
                    source={{ uri: item.thumbnail }}
                    style={[
                        hello.image,
                        { height: index % 3 === 0 ? hp(25) : hp(35) },
                    ]}
                />
                <Text style={hello.strMeal}>
                    {item.bookName.length > 20 ? item.bookName.slice(0, 20) + '...' : item.bookName}
                </Text>
            </Pressable>
        </Animated.View>
    );
};

const hello = StyleSheet.create({
    pressable: {
        width: '100%',
        paddingLeft: 0,
        paddingRight: 0,
        flexDirection: 'column',
        justifyContent: 'center',
        marginBottom: 4,
        spaceY: 1,
    },
    image: {
        width: '100%',
        borderRadius: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.05)', 
    },
    text: {
        fontSize: hp(1.5),
        fontWeight: '600', 
        marginLeft: 2,
        color: '#6B7280', 
    },
    strMeal:{
        paddingLeft:4
    }
});

