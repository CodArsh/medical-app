import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  Switch,
} from 'react-native';
import styles from './styles';
import BaseSetting from '@config/setting';
import { useSelector } from 'react-redux';
import { BaseColors } from '@config/theme';
import Icon1 from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import { isNull } from 'lodash';
import { Images } from '@config';

import {
  Dateofbirth,
  Loginwithfaceid,
  PolicySvg,
  SvgChangePassword,
  SvgDark,
  SvgEmail,
  SvgFaceId,
  SvgGender,
  SvgNotification,
  SvgPhone,
  SvgPronouns,
  SvgSex,
  SvgSignout,
  SvgTwoFactor,
  SvgUser,
  TermsSvg,
} from '@components/SVG_Bundle';
import { getApiData } from '@utils/apiHelper';
import Toast from 'react-native-toast-message';
const InfoCard = props => {
  const { userData } = useSelector(state => {
    return state.auth;
  });
  const { data, mainTitle, SwitchChange, tabPress } = props;
  const { darkmode, isBiometric } = useSelector(state => {
    return state.auth;
  });
  const noProfilePic =
    isNull(userData.profile_pic) || userData.profile_pic === undefined;

  const renderLeftIcon = title => {
    switch (title) {
      case 'Two Factor Authentication':
        return <SvgTwoFactor darkmode={darkmode} />;
      case 'Change Password':
        return <SvgChangePassword darkmode={darkmode} />;
      case 'Notifications Settings':
        return (
          <SvgNotification
            fill={BaseColors.spanishGray}
            height={16}
            width={16}
          />
        );
      case 'Dark Theme':
        return <SvgDark darkmode={darkmode} />;
      case 'Sign Out':
        return (
          <SvgSignout
            fill={darkmode ? BaseColors.white : BaseColors.spanishGray}
          />
        );
      case 'Terms of Services':
        return <TermsSvg darkmode={darkmode} />;
      case 'Privacy Policy':
        return <PolicySvg darkmode={darkmode} />;
      case 'First Name':
        return (
          <SvgUser
            height={15}
            width={15}
            fill={darkmode ? BaseColors.white : BaseColors.spanishGray}
          />
        );
      case 'Middle Name':
        return (
          <SvgUser
            height={15}
            width={15}
            fill={darkmode ? BaseColors.white : BaseColors.spanishGray}
          />
        );
      case 'Last Name':
        return (
          <SvgUser
            height={15}
            width={15}
            fill={darkmode ? BaseColors.white : BaseColors.spanishGray}
          />
        );

      case 'Date of Birth':
        return <Dateofbirth darkmode={darkmode} height={18} width={18} info />;
      case 'Gender':
        return (
          <SvgGender
            fill={darkmode ? BaseColors.white : BaseColors.spanishGray}
            height={18}
            width={18}
          />
        );
      case 'Pronouns':
        return (
          <SvgPronouns
            fill={darkmode ? BaseColors.white : BaseColors.spanishGray}
          />
        );
      case 'Sex':
        return <SvgSex darkmode={darkmode} />;
      case 'Patient Phone':
        return (
          <SvgPhone
            style={{
              fill: BaseColors.textColor,
              stroke: BaseColors.textColor,
            }}
            darkmode={darkmode}
          />
        );
      case 'Patient Email':
        return <SvgEmail darkmode={darkmode} />;
      case 'Guardian phone':
        return (
          <SvgPhone
            style={{
              fill: BaseColors.textColor,
              stroke: BaseColors.textColor,
            }}
            darkmode={darkmode}
          />
        );
      case 'Guardian email':
        return <SvgEmail darkmode={darkmode} />;
      default:
    }
  };
  return (
    <View
      style={[
        styles.settigCon,
        // {
        //   backgroundColor: darkmode ? BaseColors.lightBlack : BaseColors.white,
        // },
      ]}
    >
      <View style={styles.mainTitleStyle}>
        <Text
          style={[
            styles.titleText,
            {
              color: darkmode ? BaseColors.white : BaseColors.lightBlack,
            },
          ]}
        >
          {mainTitle}
        </Text>
      </View>

      <View style={styles.infoshadow}>
        <View
          style={{
            backgroundColor: darkmode ? BaseColors.black90 : BaseColors.white,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
        >
          {mainTitle === 'Patient Information' ? (
            <Image
              source={
                noProfilePic ? Images.avatar : { uri: userData.profile_pic }
              }
              resizeMode="cover"
              style={styles.userDp}
            />
          ) : null}
        </View>
        {data?.map((item, index) => {
          return item?.title === null ? null : item.id == 4 &&
            Platform.OS === 'android' ? null : (
            <TouchableOpacity
              key={item?.id}
              activeOpacity={item?.switch ? 1 : BaseSetting.buttonOpacity}
              onPress={() => tabPress && tabPress(item)}
              style={[
                styles.settingItem,
                index === 0 &&
                (mainTitle !== 'Patient Information') &
                  (mainTitle == 'contact Information')
                  ? styles.topBorder
                  : [
                      styles.otherBorder,
                      {
                        borderTopLeftRadius:
                          (index === 0) & (mainTitle !== 'Patient Information')
                            ? 12
                            : null,
                        borderTopRightRadius:
                          (index === 0) & (mainTitle !== 'Patient Information')
                            ? 12
                            : null,
                        backgroundColor: darkmode
                          ? BaseColors.black90
                          : BaseColors.white,
                        borderColor: BaseColors.borderColor,
                        borderTopWidth: index === 0 ? 0 : 0.3,
                      },
                    ],
                index === data.length - 1 ? styles.radiusDesign : null,
              ]}
            >
              <View style={[styles.cardContainer]}>
                <View style={[styles.innerCard]}>
                  {item?.title === 'Login With Fingerprint' ? (
                    <Icon1
                      name={item.leftIcon}
                      size={15}
                      color={darkmode ? BaseColors.white : BaseColors.black90}
                    />
                  ) : item?.title === 'Login With Face ID' ? (
                    <SvgFaceId />
                  ) : (item?.id === '3' &&
                      item?.title === 'Connect With Google') ||
                    item?.title === 'Disconnect With Google' ||
                    item?.title === 'Connect With Apple' ||
                    item?.title === 'Disconnect With Apple' ? (
                    <Icon2
                      name={item.leftIcon}
                      size={15}
                      color={darkmode ? BaseColors.white : BaseColors.black90}
                    />
                  ) : item?.leftIcon === 'microphone' ? (
                    <Icon2
                      name={item.leftIcon}
                      size={15}
                      color={darkmode ? BaseColors.white : BaseColors.black90}
                    />
                  ) : item?.leftIcon === 'spider' ? (
                    <Icon2
                      name={item.leftIcon}
                      size={15}
                      color={darkmode ? BaseColors.white : BaseColors.black90}
                    />
                  ) : item?.leftIcon === 'sports' ? (
                    <Icon3
                      name={item.leftIcon}
                      size={15}
                      color={darkmode ? BaseColors.white : BaseColors.black90}
                    />
                  ) : item?.leftIcon === 'graduation-cap' ? (
                    <Icon2
                      name={item.leftIcon}
                      size={15}
                      color={darkmode ? BaseColors.white : BaseColors.black90}
                    />
                  ) : item?.leftIcon === 'calendar-check' ? (
                    <Icon2
                      name={item.leftIcon}
                      size={15}
                      color={darkmode ? BaseColors.white : BaseColors.black90}
                    />
                  ) : (
                    renderLeftIcon(item?.title)
                  )}
                </View>
                <View>
                  <Text
                    style={[
                      styles.settingItemText,
                      {
                        color: darkmode ? BaseColors.white : BaseColors.black90,
                      },
                    ]}
                  >
                    {item.title}
                  </Text>
                </View>
              </View>

              <View style={styles.righttitletextContainer}>
                {item?.switch ? (
                  <Switch
                    trackColor={{
                      false: BaseColors.msgColor,
                      true: BaseColors.primary,
                    }}
                    thumbColor={BaseColors.white}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={v => {
                      SwitchChange && SwitchChange(item, v);
                    }}
                    value={item.title === 'Dark Theme' ? darkmode : isBiometric}
                  />
                ) : (
                  <Text
                    style={[
                      styles.righttitletext,
                      {
                        color: darkmode ? BaseColors.white : BaseColors.black90,
                      },
                    ]}
                  >
                    {item.righttitle ? item.righttitle : '-'}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default InfoCard;
