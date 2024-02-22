/* eslint-disable react-native/no-inline-styles */
import { BaseColors, FontFamily } from '@config/theme';
import React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { useSelector } from 'react-redux';

export default function Dropdown(props) {
  const { darkmode } = useSelector(state => state.auth);

  const {
    open = false,
    setOpen = () => null,
    value = null,
    setValue = () => null,
    onOpen = () => null,
    items = [],
    placeholder = '',
  } = props;

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      placeholder={placeholder}
      setOpen={setOpen}
      setValue={setValue}
      itemSeparator={true}
      showTickIcon={false}
      onOpen={() => {
        onOpen();
      }}
      placeholderStyle={{
        fontFamily: FontFamily.regular,
        fontSize: 14,
        marginRight: 3,
        color: darkmode ? BaseColors.white : BaseColors.black60,
      }}
      style={{
        borderWidth: darkmode ? 1 : 0,
        borderColor: darkmode ? BaseColors.white : BaseColors.black60,
        backgroundColor: darkmode ? BaseColors.black60 : BaseColors.white,
      }}
      textStyle={{
        color: darkmode ? BaseColors.white : BaseColors.black60,
        fontSize: 16,
      }}
      containerStyle={{
        shadowColor: BaseColors.black60,
      }}
      dropDownContainerStyle={{
        borderColor: darkmode ? BaseColors.white : BaseColors.black50,
        backgroundColor: darkmode ? BaseColors.black : BaseColors.white,
      }}
      itemSeparatorStyle={{
        backgroundColor: BaseColors.black50,
      }}
      selectedItemLabelStyle={{
        fontWeight: 'bold',
        color: BaseColors.white,
      }}
      selectedItemContainerStyle={{
        backgroundColor: BaseColors.primary,
      }}
    />
  );
}
