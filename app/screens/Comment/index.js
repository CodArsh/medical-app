import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  BackHandler,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from './styles';
import HeaderBar from '@components/HeaderBar';
import Button from '@components/Button';
import BaseSetting from '@config/setting';
import { getApiData } from '@utils/apiHelper';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { BaseColors } from '@config/theme';
import { useSelector } from 'react-redux';
const Comment = ({ navigation, route }) => {
  const DATA = route?.params?.otherData;

  const event_title = DATA?.event_title;
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { darkmode } = useSelector(state => state.auth);
  const eventId = route?.params?.event_id || route?.params?.eventId;
  const [commentText, setCommentText] = useState('');
  const [btnLoad, setBtnLoad] = useState(false);
  async function commentPost() {
    setBtnLoad(true);
    try {
      const params = {
        event_id: eventId,
        comment: commentText,
        created_from: 'app',
      };
      const response = await getApiData(
        BaseSetting.endpoints.comment,
        'POST',
        params,
        '',
        false,
      );
      if (response?.status) {
        Toast.show({
          text1: response?.message.toString(),
          type: 'success',
        });
        navigation.navigate('Events', event_title);
      } else {
        Toast.show({
          text1: response?.message.toString(),
          type: 'error',
        });
      }
      setBtnLoad(false);
    } catch (error) {
      console.log('error while posting comment =======>>>', error);
      Toast.show({
        text1: error.toString(),
        type: 'error',
      });
      setBtnLoad(false);
    }
  }
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );

    return () => backHandler.remove();
  }, []);

  const handleBackPress = () => {
    setShowConfirmation(true);
    return true;
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const handleConfirm = () => {
    navigation.navigate('Events', event_title);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: darkmode ? BaseColors.lightBlack : BaseColors.white,
        },
      ]}
    >
      <HeaderBar HeaderText={'Comment'} HeaderCenter />
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.main}>
          <View style={styles.topTitle}>
            <Text
              style={[
                styles.titleOne,
                { color: darkmode ? BaseColors.white : BaseColors.black90 },
              ]}
            >
              Assessment Completed
            </Text>
            <Text
              style={[
                styles.titleTwo,
                { color: darkmode ? BaseColors.white : BaseColors.black90 },
              ]}
            >
              Thank you for completing your subsequent visit assessment.
            </Text>

            <View style={styles.innerView}>
              <Text
                style={[
                  styles.titleThree,
                  { color: darkmode ? BaseColors.white : BaseColors.black90 },
                ]}
              >
                Any additional comments you would like to share with your
                provider?
              </Text>
              <TextInput
                placeholder="Share your comments..."
                style={[
                  styles.inputBar,
                  {
                    borderColor: darkmode
                      ? BaseColors.white
                      : BaseColors.black90,
                    color: darkmode ? BaseColors.white : BaseColors.black90,
                  },
                ]}
                value={commentText}
                multiline
                onChangeText={value => setCommentText(value)}
                placeholderTextColor={
                  darkmode ? BaseColors.white : BaseColors.black90
                }
              />
            </View>
          </View>
          <View />
          <View style={styles.doneBtn}>
            <Button
              shape="round"
              title={'Done'}
              onPress={commentPost}
              loading={btnLoad}
            />
          </View>
          {showConfirmation && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={showConfirmation}
              onRequestClose={handleCancel}
            >
              <View style={styles.confirmationModalCenteredView}>
                <View
                  style={[
                    styles.confirmationModalView,
                    {
                      backgroundColor: darkmode
                        ? BaseColors.textColor
                        : BaseColors.white,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.confirmationModalTitleText,
                      {
                        color: darkmode ? BaseColors.white : BaseColors.black,
                      },
                    ]}
                  >
                    Are you sure?
                  </Text>
                  <Text
                    style={[
                      styles.confirmationModalText,
                      {
                        color: darkmode ? BaseColors.white : BaseColors.black,
                      },
                    ]}
                  >
                    You want to leave this screen?
                  </Text>
                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={[styles.button, styles.confirmButton]}
                      onPress={handleConfirm}
                      disabled={confirmLoading}
                    >
                      {confirmLoading ? (
                        <ActivityIndicator color="white" size="small" />
                      ) : (
                        <Text style={styles.buttonText}>Confirm</Text>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={[styles.button, styles.cancelButton]}
                      onPress={handleCancel}
                    >
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default Comment;
