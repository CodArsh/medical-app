import React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { BaseColors } from '@config/theme';
import styles from './styles';
import _ from 'lodash';
import { Images } from '@config';
import Details from '@components/Details';
import { useSelector } from 'react-redux';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Text, Image } from 'react-native';
import BaseSetting from '@config/setting';

const Milestones = ({ navigation, route }) => {
  const { darkmode } = useSelector(state => state.auth);
  const data = [
    {
      id: '1',
      image: Images.content,
      text: 'headache',
      number: '4',
      color: BaseColors.checkcircle,
    },
    {
      id: '2',
      image: Images.contentpending,
      text: 'Sensitivity to Noise',
      number: '6',
      color: BaseColors.primary,
      imagecolor: BaseColors.primary,
    },
    {
      id: '3',
      image: Images.content,
      text: 'Ongoing',
      number: '2',
      color: BaseColors.checkcircle,
      imagecolor: BaseColors.yellowStarColor,
    },
    {
      id: '4',
      image: Images.content,
      text: 'New Milestones',
      number: '4',
      color: BaseColors.yellowStarColor,
    },
    {
      id: '5',
      image: Images.content,
      text: 'Not Started',
      number: '6',
      color: BaseColors.secondary,
      imagecolor: BaseColors.cardDescColor,
    },
    {
      id: '6',
      image: Images.content,
      text: 'Cancelled',
      number: '2',
      color: BaseColors.darkorang,
      imagecolor: BaseColors.darkorang,
    },
    {
      id: '1',
      image: Images.content,
      text: 'headache',
      number: '4',
      color: BaseColors.checkcircle,
    },
    {
      id: '2',
      image: Images.contentpending,
      text: 'Sensitivity to Noise',
      number: '6',
      color: BaseColors.primary,
      imagecolor: BaseColors.primary,
    },
    {
      id: '3',
      image: Images.content,
      text: 'Ongoing',
      number: '2',
      color: BaseColors.checkcircle,
      imagecolor: BaseColors.yellowStarColor,
    },
    {
      id: '4',
      image: Images.content,
      text: 'New Milestones',
      number: '4',
      color: BaseColors.yellowStarColor,
    },
  ];
  const Details = ({
    iconName,
    text,
    number,
    iconColor,
    numberColor,
    navigation,
  }) => {
    const { darkmode } = useSelector(state => state.auth);
    return (
      <View
        style={[
          styles.container,
          {
            borderColor: darkmode ? BaseColors.textColor : BaseColors.black10,
            backgroundColor: darkmode ? null : BaseColors.white,
            elevation: darkmode ? 0 : 3,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Dashboard');
          }}
          activeOpacity={BaseSetting.buttonOpacity}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ height: 45, width: 90 }}>
              <Text
                style={[
                  styles.textt,
                  { color: darkmode ? BaseColors.white : BaseColors.black90 },
                ]}
              >
                {text}
              </Text>
            </View>
            <Image source={Images.emoji} resizeMode="contain" />
          </View>
          <View style={styles.graphcontainer}>
            <Image
              source={Images.graph1}
              resizeMode="contain"
              style={styles.img2}
            />

            <View style={styles.numbercontainer}>
              <View>
                <Text style={[styles.number, { color: numberColor }]}>
                  {number}
                </Text>
              </View>
              <Image source={Images.down} resizeMode="contain" />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  const renderItem = ({ item }) => {
    return (
      <Animated.View
        entering={FadeInDown}
        style={{ width: '50%', alignItems: 'center' }}
      >
        <Details
          text={item.text}
          number={item.number}
          imageSource={item.image}
          style={styles.imgs}
          numberColor={item.color}
          imageColor={item.imagecolor}
          navigation={navigation}
        />
      </Animated.View>
    );
  };
  return (
    <View
      style={[
        styles.maincontainer,
        {
          backgroundColor: darkmode ? BaseColors.lightBlack : BaseColors.white,
        },
      ]}
    >
      <FlatList
        renderItem={renderItem}
        data={data}
        keyExtractor={item => item.index}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          width: '100%',
        }}
        numColumns={2}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Milestones;
