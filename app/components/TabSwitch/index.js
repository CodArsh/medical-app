/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Animated, TouchableOpacity, Text, View } from 'react-native';
import { BaseColors } from '@config/theme';
import { styles } from './styles';
import BaseSetting from '@config/setting';
import { useSelector } from 'react-redux';

/**
 * Component for TabSwitch
 * @function TabSwitch
 */
export default function TabSwitch(props) {
  const { darkmode } = useSelector(state => {
    return state.auth;
  });
  const {
    insideTab,
    tabSize,
    threePack,
    subTabSize,
    tabs,
    onTabChange,
    activeTab,
    isRTL = false,
  } = props;

  const activeTabIndex = props.tabs.findIndex(
    tab => tab.id === props.activeTab.id,
  );

  const [translateValue] = useState(
    new Animated.Value((isRTL ? -1 : 1) * (1 + activeTabIndex * tabSize + 20)),
  );

  const setspring = index => {
    Animated.spring(translateValue, {
      toValue: (isRTL ? -1 : 1) * (1 + index * subTabSize),
      velocity: 10,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    setspring(activeTabIndex);
  }, [activeTab]);

  const renderTabData = () => {
    return (
      <View
        style={[
          styles.wrapper,
          {
            borderRadius: insideTab ? 50 : 0,
            width: tabSize,
            backgroundColor: darkmode
              ? insideTab
                ? BaseColors.black50
                : BaseColors.lightBlack
              : insideTab
              ? BaseColors.lightBg
              : null,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.slider,
            {
              transform: [
                {
                  translateX: translateValue,
                },
              ],
              marginLeft: threePack ? 0 : -6,
              width: subTabSize,
              borderBottomWidth: !insideTab ? 3 : 0,
              borderRadius: insideTab ? 50 : 0,
              borderBottomColor: insideTab
                ? BaseColors.orange
                : BaseColors.secondary,
              backgroundColor: insideTab ? BaseColors.orange : null,
            },
          ]}
        />
        {tabs.map((obj, index) => (
          <TouchableOpacity
            key={`${index + 1}`}
            activeOpacity={BaseSetting.buttonOpacity}
            onPress={() => {
              onTabChange(obj);
            }}
            style={{
              ...styles.tab,
              width: subTabSize,
            }}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTabIndex === index
                      ? insideTab
                        ? BaseColors.white
                        : BaseColors.secondary
                      : BaseColors.msgColor,
                },
              ]}
            >
              {obj.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return renderTabData();
}

TabSwitch.propTypes = {
  tabs: PropTypes.array,
  onTabChange: PropTypes.func,
  tabSize: PropTypes.number,
  subTabSize: PropTypes.number,
  activeTab: PropTypes.object,
  insideTab: PropTypes.bool,
};

TabSwitch.defaultProps = {
  tabs: [
    { id: '1', name: 'tab 1' },
    { id: '2', name: 'tab 2' },
  ],
  onTabChange: () => {},
  tabSize: BaseSetting.nWidth - 40,
  subTabSize: BaseSetting.nWidth * 0.47,
  activeTab: {},
  insideTab: false,
};
