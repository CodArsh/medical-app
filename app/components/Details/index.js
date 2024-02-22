import { Images } from '@config';
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from './styles';
import BaseSetting from '@config/setting';
import { useSelector } from 'react-redux';
import { BaseColors } from '@config/theme';

const Details = ({ iconName, text, number, iconColor, numberColor }) => {
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
      <TouchableOpacity activeOpacity={BaseSetting.buttonOpacity}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ height: 45, width: 90 }}>
            <Text
              style={[
                styles.text,
                { color: darkmode ? BaseColors.white : BaseColors.black90 },
              ]}
            >
              {text}
            </Text>
          </View>
          <Image source={Images.emoji1} resizeMode="contain" />
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

export default Details;
