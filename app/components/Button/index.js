import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import styles from './styles';
import { BaseColors } from '@config/theme';
import BaseSetting from '@config/setting';

import PropTypes from 'prop-types';

const Button = props => {
  const {
    title,
    type,
    loading,
    shape,
    onPress,
    style,
    TextStyle,
    newOutline,
    disabled,
  } = props;

  const shapeStyle =
    shape === 'round'
      ? styles.round
      : shape === 'square'
      ? styles.square
      : null;

  let BStyle = {};
  let TStyle = {};
  let indicatColor = '';

  switch (type) {
    case 'outlined':
      BStyle = !newOutline ? styles.outlined : null;
      TStyle = styles.txtBlack;
      indicatColor = BaseColors.secondary;
      break;
    case 'primary':
      BStyle = styles.primary;
      if (disabled) {
        BStyle.backgroundColor = BaseColors.borderColor;
      } else {
        BStyle.backgroundColor = BaseColors.primary;
      }
      TStyle = styles.txtWhite;
      indicatColor = BaseColors.white;
      break;
    default:
      BStyle = {};
      TStyle = {};
      break;
  }

  const renderChildren = () => {
    return loading ? (
      <ActivityIndicator color={indicatColor} animating={loading} />
    ) : (
      <Text style={[styles.DTxt, TStyle, TextStyle]}>{title}</Text>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={BaseSetting.buttonOpacity}
      style={[styles.default, shapeStyle, BStyle, style]}
      onPress={() => {
        loading || disabled ? null : onPress();
      }}
      disabled={disabled}
    >
      {renderChildren()}
    </TouchableOpacity>
  );
};

export default Button;

Button.propTypes = {
  title: PropTypes.string,
  type: PropTypes.oneOf(['primary', 'outlined']),
  shape: PropTypes.oneOf(['round', 'square']),
  loading: PropTypes.bool,
  onPress: PropTypes.func,
  style: PropTypes.object,
  TextStyle: PropTypes.object,
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  title: 'title',
  type: 'primary', // "primary"  | "outlined" | "text"
  shape: 'square', // "round"  | "square"
  loading: false, // true | false
  onPress: () => {},
  style: {},
  TextStyle: {},
  disabled: false,
};
