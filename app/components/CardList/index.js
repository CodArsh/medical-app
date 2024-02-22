import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/FontAwesome5';
import PropTypes from 'prop-types';
import styles from './styles';
import BaseSetting from '@config/setting';
import { useSelector } from 'react-redux';
import { BaseColors } from '@config/theme';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Assessementcomplete,
  Assessementdue,
  Assessementmissed,
  Events,
  Hamburger,
} from '@components/SVG_Bundle';

export default function CardList({
  showClock, // Prop to control whether to show the clock icon
  showmanIcon,
  iconName,
  othericons,
  iconType,
  due,
  backgroundColoricon,
  data,
  status,
  assessment,
  onPress,
  rightArrow,
  isRead, // New prop to indicate whether the notification is read
}) {
  const { darkmode } = useSelector(state => state.auth);

  const renderDot = () => (
    <View
      style={[
        styles.dotContainer,
        {
          backgroundColor: isRead === 0 ? BaseColors.primary : 'transparent',
        },
      ]}
    />
  );

  const ClockIcon = () => (
    <View
      style={[styles.iconContainer, { backgroundColor: backgroundColoricon }]}
    >
      {renderDot()}
      <Icon1 name={iconName} size={30} color="white" />
    </View>
  );
  const Due = () => (
    <View
      style={[styles.iconContainer, { backgroundColor: backgroundColoricon }]}
    >
      <Assessementdue width={25} height={25} color="white" />
    </View>
  );
  const Othericon = () => (
    <View
      style={[styles.iconContainer, { backgroundColor: backgroundColoricon }]}
    >
      <Assessementcomplete width={25} height={25} />
    </View>
  );
  const Missedicon = () => (
    <View
      style={[styles.iconContainer, { backgroundColor: backgroundColoricon }]}
    >
      <Assessementmissed width={25} height={25} />
    </View>
  );
  const ManIcon = () => (
    <View
      style={[styles.iconContainer, { backgroundColor: backgroundColoricon }]}
    >
      <Events height={23} width={23} fill={BaseColors.white} />
    </View>
  );

  return (
    <TouchableOpacity
      style={[
        styles.main,
        {
          backgroundColor: darkmode ? BaseColors.black : BaseColors.white,
          borderColor: darkmode ? BaseColors.textColor : BaseColors.black10,
          elevation: darkmode ? 0 : 3,
        },
      ]}
      onPress={onPress}
      activeOpacity={BaseSetting.buttonOpacity}
    >
      <View style={styles.container}>
        <View style={styles.insideBox}>
          {showClock ? (
            <ClockIcon />
          ) : showmanIcon ? (
            <ManIcon />
          ) : iconType === 'Completed' ? (
            <Othericon />
          ) : iconType === 'Missed' ? (
            <Missedicon />
          ) : iconType === 'Pending' ? (
            <Due />
          ) : (
            <View style={styles.iconContainer}>{renderDot()}</View>
          )}
          <View style={{ marginHorizontal: 10 }}>
            <Text
              style={{
                fontSize: 17,
                color: darkmode ? BaseColors.white : BaseColors.black80,
              }}
            >
              {data}
            </Text>
            <View style={styles.statusBox}>
              <View
                style={[
                  styles.chipBox,
                  {
                    backgroundColor: darkmode
                      ? BaseColors.black80
                      : BaseColors.lightBg,
                    borderColor: darkmode
                      ? BaseColors.textColor
                      : BaseColors.black80,
                  },
                ]}
              >
                <View style={{ flexDirection: 'row' }}>
                  <View
                    style={[
                      styles.colorcontainer,
                      {
                        backgroundColor:
                          status === 'Completed'
                            ? BaseColors.secondary
                            : BaseColors.lightorange,
                      },
                    ]}
                  ></View>
                  <Text
                    style={{
                      color: darkmode ? BaseColors.white : BaseColors.black80,
                      textAlign: 'center',
                      fontSize: 12,
                    }}
                  >
                    {status.length > 45
                      ? `${status.substring(0, 45)}...`
                      : status}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.chipBox,
                  {
                    backgroundColor:
                      assessment === ''
                        ? null
                        : darkmode
                        ? BaseColors.black80
                        : BaseColors.lightBg,
                    borderColor: darkmode
                      ? BaseColors.white
                      : BaseColors.black80,
                  },
                ]}
              >
                <Text
                  style={{
                    color: darkmode ? BaseColors.white : BaseColors.black80,
                    textAlign: 'center',
                    fontSize: 12,
                  }}
                >
                  {assessment}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {rightArrow && (
          <View>
            <Icon
              name="right"
              size={15}
              style={{
                color: darkmode ? BaseColors.white : BaseColors.black80,
              }}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

CardList.propTypes = {
  showClock: PropTypes.bool, // Prop to control whether to show the clock icon

  data: PropTypes.string,
  status: PropTypes.string,
  assessment: PropTypes.string,
  onPress: PropTypes.func,
  rightArrow: PropTypes.bool,
  isRead: PropTypes.number,
};

CardList.defaultProps = {
  showClock: false,
  assessment: '',
  status: '',
  iconName: 'default-icon', // Provide a default icon name if needed
  backgroundColoricon: 'default-color', // Provide a default color if needed
  onPress: () => {},
  data: '',
  isRead: 0,
};
