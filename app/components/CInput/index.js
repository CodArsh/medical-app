/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Animated,
  View,
  TextInput,
  Text,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { BaseColors } from '@config/theme';
import styles from './styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Search from 'react-native-vector-icons/Feather';
import BaseSetting from '@config/setting';
import {
  SvgEmail,
  SvgEmailb,
  SvgPhone,
  SvgPhoneb,
  SvgUser,
} from '@components/SVG_Bundle';
import { connect } from 'react-redux';
import { color } from 'react-native-elements/dist/helpers';

const IOS = Platform.OS === 'ios';

class CInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginSide: false,
      focused: false,
      TopValue: new Animated.Value(IOS ? 20 : 18),
      HrOpacity: new Animated.Value(0),
      phone: 'phone',
      mail: 'mail',
      key: 'key',
      eye: 'eye-slash',
      user: 'user',
      envelope: 'envelope',
      search: 'search',
      lock: 'lock',
      onOff: 'off',
      secureTextEntry: true,
    };
  }

  updateTopValue = () => {
    if (this.state.focused === true) {
      Animated.timing(this.state.TopValue, {
        toValue: IOS ? 2 : 0,
        timing: 1500,
        useNativeDriver: false, // Add This line
      }).start();
      Animated.timing(this.state.HrOpacity, {
        toValue: 10,
        timing: 1000,
        useNativeDriver: false, // Ad
      }).start();
    } else {
      Animated.timing(this.state.TopValue, {
        toValue: 16,
        timing: 1500,
        useNativeDriver: false, // Ad
      }).start();
      Animated.timing(this.state.HrOpacity, {
        toValue: 0,
        timing: 50,
        useNativeDriver: false, // Ad
      }).start();
    }
  };

  onFocus() {
    this.setState({ focused: true }, () => {
      this.updateTopValue();
      if (this.props.onFocus) {
        this.props.onFocus();
      }
    });
  }

  onBlur() {
    this.setState({ focused: false }, () => {
      this.updateTopValue();
      if (this.props.onBlur) {
        this.props.onBlur();
      }
    });
  }
  focus() {
    if (this.inputRef) {
      this.inputRef.focus();
    }
  }

  handlePicker = val => {
    const { countryValue, editable } = this.props;
    if (countryValue && editable) {
      countryValue(val);
      this.setState({ openPicker: false });
    }
  };

  render() {
    const { focused, TopValue, HrOpacity } = this.state;
    const {
      loginSide,
      inputStyle,
      textArea,
      value,
      placeholder,
      black,
      headerTitle,
      isRequired,
      changeHeadTitle,
      changeViewWidthSty,
      inputContainerStyle,
      prBorder,
      editable,
      usericon,
      phoneicon,
      mailicon,
      keyicon,
      eyePassword,
      lock,
      isSearch,
      envelope,
      userIcon,
      onChangeText,
      phone,
      showError,
      blackPlaceholder,
      errorText,
      darkCode = false,
      autoCapitalize = 'none',
      limitedText = false,
      darkmode,
    } = this.props;
    const FORTAB = false;

    return (
      <View>
        <View
          style={[
            styles.MT10,
            {
              marginVertical: 8,
            },
            {
              minHeight: BaseSetting.nHeight * 0.06,
              backgroundColor: darkmode ? BaseColors.black20 : 'white',
              borderWidth: 1,
              borderColor: !darkmode ? BaseColors.black20 : 'white',
              color: 'red',
            },
            changeViewWidthSty,
          ]}
        >
          {headerTitle !== '' ? (
            <Animated.View
              style={{
                height: 1.5,
                // backgroundColor: BaseColors.primary,
                position: 'absolute',
                top: 0,
                paddingHorizontal: headerTitle.length * 4 + 2,
                left: 5,
                zIndex: 5,
                opacity: HrOpacity,
              }}
            />
          ) : null}

          {headerTitle !== '' ? (
            <Animated.Text
              allowFontScaling={false}
              numberOfLines={1}
              style={[
                styles.commonInputHeaderText,
                changeHeadTitle,
                {
                  paddingHorizontal: 5,
                  marginTop: IOS ? 0 : 5,
                  position: 'absolute',
                  top: value ? (IOS ? 2 : 0) : TopValue,
                  left: 5,
                  fontSize: 12,
                  opacity: focused || value ? 1 : 1,
                  backgroundColor: '#0000',
                  zIndex: 5,
                  color: blackPlaceholder
                    ? BaseColors.greyColor
                    : BaseColors.primary,
                },
              ]}
            >
              {headerTitle}
              {isRequired ? (
                <Text
                  allowFontScaling={false}
                  style={{ color: 'red', fontSize: 25 }}
                >
                  *
                </Text>
              ) : null}
            </Animated.Text>
          ) : null}
          <View
            style={[
              prBorder ? styles.prBorderSetup : styles.mainViewSty,
              {
                borderColor: focused ? '#000' : BaseColors.borderColor,
                // height: textArea ? teaxArea : normalText,
                justifyContent: textArea ? 'flex-start' : 'center',
                backgroundColor: !editable && !textArea ? '#e5e5e5' : '',
              },
              inputContainerStyle,
            ]}
          >
            {_.isObject(phone) && !_.isEmpty(phone) ? (
              <TouchableOpacity
                activeOpacity={BaseSetting.buttonOpacity}
                style={styles.countryPickerView}
                // onPress={() =>
                //   editable ? this.setState({ openPicker: true }) : null
                // }
              >
                {/* <CountryPicker
                {...{
                  translation: 'eng',
                  onSelect: (val) => this.handlePicker(val),
                  countryCode: phone.cca2,
                  cca2: phone.cca2,
                  withFilter: true,
                  withAlphaFilter: true,
                  withFlagButton: true,
                  withFlag: true,
                  onClose: () => this.setState({ openPicker: false }),
                  placeholder: '',
                }}
                visible={openPicker}
              /> */}

                <Text
                  style={{
                    ...styles.codeTextStyle,
                    color: black
                      ? BaseColors.black
                      : darkCode
                      ? BaseColors.greyColor
                      : BaseColors.primary,
                  }}
                >
                  {phone.pCode}
                </Text>
              </TouchableOpacity>
            ) : null}

            <View style={{ flex: 1 }}>
              <View
                style={{
                  width: '85%',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: 15,
                }}
              >
                {phoneicon ? (
                  <TouchableOpacity
                    style={{
                      width: 50,
                      textAlign: 'center',
                      marginLeft: 5,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <SvgPhoneb
                      loginSide={loginSide}
                      height={20}
                      width={20}
                      style={{
                        fill: BaseColors.primary,
                        stroke: BaseColors.primary,
                      }}
                    />
                  </TouchableOpacity>
                ) : null}
                {usericon ? (
                  <TouchableOpacity
                    style={{
                      width: 50,
                      textAlign: 'center',
                      marginLeft: 5,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <SvgUser height={18} width={18} fill={BaseColors.primary} />
                  </TouchableOpacity>
                ) : null}
                {mailicon ? (
                  <TouchableOpacity
                    style={{
                      width: 50,
                      textAlign: 'center',
                      marginLeft: 5,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <SvgEmailb
                      height={20}
                      width={20}
                      loginSide={loginSide}
                      style={{
                        fill: BaseColors.primary,
                        stroke: BaseColors.primary,
                      }}
                    />
                  </TouchableOpacity>
                ) : null}
                {keyicon ? (
                  <TouchableOpacity
                    style={{
                      width: 50,
                      textAlign: 'center',

                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Icon2
                      name={this.state.key}
                      style={{ fontSize: 25, color: BaseColors.primary }}
                    />
                  </TouchableOpacity>
                ) : null}
                <TextInput
                  maxLength={limitedText ? 20 : 340}
                  {...this.props}
                  secureTextEntry={
                    eyePassword ? this.state.secureTextEntry : false
                  }
                  ref={ref => {
                    this.inputRef = ref;
                  }}
                  // rest of the code

                  placeholderTextColor={
                    darkmode ? BaseColors.white50 : BaseColors.black50
                  }
                  selectionColor={BaseColors.selection}
                  style={[
                    styles.commonInputTextSty,
                    textArea ? { textAlignVertical: 'top' } : null,
                    {
                      paddingLeft:
                        _.isObject(phone) && !_.isEmpty(phone)
                          ? 0
                          : FORTAB
                          ? 20
                          : 10,
                    },
                    {
                      color: !darkmode
                        ? BaseColors.lightBlack
                        : BaseColors.white,
                    },
                    { width: eyePassword || isSearch ? '86%' : '100%' },
                    { fontSize: 15, maxHeight: BaseSetting.nHeight * 0.2 },

                    inputStyle,
                  ]}
                  onChangeText={onChangeText}
                  editable={editable}
                  autoCorrect={false}
                  autoCapitalize={autoCapitalize}
                  allowFontScaling={false}
                  blurOnSubmit={true}
                  multiline={textArea}
                  numberOfLines={textArea ? 5 : 1}
                  returnKeyType={'next'}
                  placeholder={placeholder}
                  underlineColorAndroid="#0000"
                  onFocus={() => this.onFocus()}
                  onBlur={() => this.onBlur()}
                  cursorColor={BaseColors.primary}
                />
                {/* {(this.state.onOff = {...this.props}.secureTextEntry)} */}
                {eyePassword ? (
                  <TouchableOpacity
                    style={{
                      textAlign: 'center',
                      marginLeft: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() =>
                      this.setState({
                        eye: this.state.eye === 'eye' ? 'eye-slash' : 'eye',
                        onOff: this.state.eye === 'off' ? 'on' : 'off',
                        lock: this.state.lock === 'lock' ? 'unlock' : 'lock',
                        secureTextEntry: !this.state.secureTextEntry,
                      })
                    }
                  >
                    <Icon
                      name={this.state.eye}
                      style={{
                        fontSize: 25,
                        color: darkmode ? BaseColors.white : BaseColors.black80,
                      }}
                    />
                  </TouchableOpacity>
                ) : null}
                {userIcon && (
                  <TouchableOpacity
                    style={{
                      textAlign: 'center',
                      // paddingTop: IOS ? 15 : 20,
                      marginLeft: -30,
                      paddingRight: 15,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Icon
                      name={this.state.user}
                      style={{ fontSize: 20, color: BaseColors.black80 }}
                    />
                  </TouchableOpacity>
                )}
                {envelope && (
                  <TouchableOpacity
                    style={{
                      textAlign: 'center',
                      // paddingTop: IOS ? 15 : 20,
                      marginLeft: -32,
                      paddingRight: 15,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Icon
                      name={this.state.envelope}
                      style={{ fontSize: 20, color: BaseColors.black80 }}
                    />
                  </TouchableOpacity>
                )}
                {lock && (
                  <TouchableOpacity
                    style={{
                      textAlign: 'center',
                      // paddingTop: IOS ? 15 : 20,
                      marginLeft: -30,
                      paddingRight: 15,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Icon
                      name={this.state.lock}
                      style={{ fontSize: 25, color: BaseColors.black80 }}
                    />
                  </TouchableOpacity>
                )}
                {isSearch && (
                  <TouchableOpacity
                    style={{
                      textAlign: 'center',
                      paddingTop: 15,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: IOS ? 4 : 0,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: BaseColors.primary,
                        borderRadius: 30,
                      }}
                    >
                      <Search name={'search'} style={styles.search} />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>
        <View>
          {showError && errorText ? (
            <Text style={styles.errorTxt} numberOfLines={2}>
              {errorText}
            </Text>
          ) : null}
        </View>
      </View>
    );
  }
}

CInput.propTypes = {
  loginSide: PropTypes.bool,
  inputStyle: PropTypes.any,
  datePickerMainViewStyle: PropTypes.any,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  datePicker: PropTypes.bool,
  black: PropTypes.bool,
  disable: PropTypes.bool,
  format: PropTypes.string,
  onSubmitEditing: PropTypes.func,
  onChangeText: PropTypes.func,
  placeholder: PropTypes.string,
  textArea: PropTypes.bool,
  mode: PropTypes.string,
  headerTitle: PropTypes.string,
  fieldIconName: PropTypes.string,
  inputContainerStyle: PropTypes.any,
  editable: PropTypes.bool,
  phone: PropTypes.objectOf(PropTypes.any),
  countryValue: PropTypes.func,
};

CInput.defaultProps = {
  inputStyle: null,
  onFocus: null,
  onBlur: null,
  datePicker: false,
  format: 'DD-MM-YYYY',
  onSubmitEditing: null,
  onChangeText: null,
  placeholder: '',
  textArea: false,
  black: false,
  disable: false,
  mode: 'date',
  headerTitle: '',
  datePickerMainViewStyle: null,
  fieldIconName: '',
  inputContainerStyle: {},
  editable: true,
  phone: {},
  countryValue: null,
};

const mapStateToProps = state => {
  return {
    darkmode: state.auth.darkmode,
  };
};

export default connect(mapStateToProps)(CInput);
