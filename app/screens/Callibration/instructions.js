import React, { useState, useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import Swiper from 'react-native-swiper';
import HeaderBar from '@components/HeaderBar';
import { BaseColors } from '@config/theme';
import Button from '@components/Button';
import styles from './styles';
import { useSelector } from 'react-redux';
import {
  SvgCab_a1,
  SvgCab_a2,
  SvgCab_b1,
  SvgCab_b2,
} from '@components/SVG_Bundle';

const Instructions = ({ navigation }) => {
  const { darkmode } = useSelector(state => state.auth);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

  const handleNextClick = () => {
    if (activeIndex === 0) {
      swiperRef.current.scrollBy(1, true);
      setActiveIndex(1);
    } else {
      navigation.navigate('Callibration');
    }
  };

  const handleIndexChanged = index => {
    setActiveIndex(index);
  };

  return (
    <>
      <HeaderBar leftText="Cancel" />
      <View
        style={[
          styles.container,
          {
            backgroundColor: darkmode
              ? BaseColors.lightBlack
              : BaseColors.white,
          },
        ]}
      >
        <View style={styles.topIn}>
          <Text
            style={[
              styles.title,
              { color: darkmode ? BaseColors.white : BaseColors.textGrey },
            ]}
          >
            ASSESSMENT INSTRUCTIONS
          </Text>
          <Text
            style={[
              styles.miniTitle,
              { color: darkmode ? BaseColors.white : BaseColors.textGrey },
            ]}
          >
            Tips for Success
          </Text>
        </View>
        <View style={styles.swipeCover}>
          <Text
            style={[
              styles.outerText,
              {
                color: darkmode ? BaseColors.white : BaseColors.textGrey,
              },
            ]}
          >
            {activeIndex ? 'Good Lighting' : 'Sit Comfortably'}
          </Text>
          <Swiper
            style={styles.wrapper}
            showsButtons={false}
            scrollEnabled={false}
            loop={false}
            onIndexChanged={handleIndexChanged}
            ref={swiperRef}
            showsPagination={false}
          >
            <View style={styles.slide1}>
              <View style={styles.post1}>
                <View style={styles.rightLine}>
                  <SvgCab_a1 />
                </View>
                <SvgCab_a2 />
              </View>
            </View>
            <View style={styles.slide2}>
              <View style={styles.post2}>
                <View style={styles.rightLine}>
                  <SvgCab_b1 />
                </View>
                <SvgCab_b2 />
              </View>
            </View>
          </Swiper>
          <View style={styles.dotWrapper}>
            <Pressable
              style={!activeIndex ? styles.activeUpper : styles.inActiveUpper}
              onPress={() => (
                activeIndex && swiperRef.current.scrollBy(-1, true),
                setActiveIndex(0)
              )}
            >
              <View
                style={!activeIndex ? styles.activeInner : styles.inActiveInner}
              />
            </Pressable>

            <Pressable
              style={activeIndex ? styles.activeUpper : styles.inActiveUpper}
              onPress={() => (
                !activeIndex && swiperRef.current.scrollBy(1, true),
                setActiveIndex(1)
              )}
            >
              <View
                style={activeIndex ? styles.activeInner : styles.inActiveInner}
              />
            </Pressable>
          </View>
        </View>
        <View style={styles.desc}>
          <Text
            style={[
              styles.miniTitle,
              { color: darkmode ? BaseColors.white : BaseColors.textGrey },
            ]}
          >
            {activeIndex
              ? 'Best to test indoors with good lighting - avoid intensely bright rooms or testing in the dark.   '
              : 'Remain seated for the test. Keep your face and head position still during testing.'}
          </Text>
          <Button
            title={activeIndex === 0 ? 'Next' : 'Camera Set Up'}
            style={styles.btnStyle}
            onPress={handleNextClick}
          />
        </View>
      </View>
    </>
  );
};

export default Instructions;
