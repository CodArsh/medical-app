import { Text, View } from 'react-native';
import React from 'react';
import { BaseColors } from '@config/theme';

import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

export default function CText(props) {
  const { userData, darkmode } = useSelector(state => state.auth);
  const { title, required, style, textColor } = props;

  return (
    <View style={[style]}>
      <Text style={{ color: darkmode ? BaseColors.white : BaseColors.black90 }}>
        {title}
        {required ? <Text style={{ color: BaseColors.red }}> * </Text> : null}:
      </Text>
    </View>
  );
}

CText.propTypes = {
  title: PropTypes.string,
  required: PropTypes.boolean,
  style: Object,
};

CText.defaultProps = {
  title: 'title',
  required: false,
  style: {},
};
