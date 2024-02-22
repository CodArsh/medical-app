import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

export const items = [
  { label: 'Email', value: 'Email' },
  { label: 'Phone', value: 'Phone' },
];

export const switchOptions = [
  { id: 'detail', name: 'Details' },
  { id: 'history', name: 'History' },
  { id: 'account', name: 'Account' },
];

export const settings = [
  {
    id: '1',
    leftIcon: Platform.OS === 'ios' ? 'smile-o' : 'finger-print',
    title: `Login With ${Platform.OS === 'ios' ? 'Face ID' : 'Fingerprint'}`,
    slug: Platform.OS === 'ios' ? 'face_id' : 'touch_id',
    switch: true,
  },
  {
    id: '2',
    leftIcon: 'shield',
    slug: 'two_fa',
    title: 'Two Factor Authentication',
    righttitle: <Icon name="right" size={15} />,
    switch: false,
    navto: 'AuthenticationFactor',
  },
  {
    id: '3',
    leftIcon: 'google',
    slug: 'google_connect',
    title: 'Connect With Google',
    righttitle: <Icon name="right" size={15} />,
    switch: false,
  },
  {
    id: '4',
    leftIcon: 'apple',
    slug: 'apple_connect',
    title: 'Connect With Apple',
    righttitle: <Icon name="right" size={15} />,
    switch: false,
  },
  {
    id: '5',
    leftIcon: 'key',
    title: 'Change Password',
    righttitle: <Icon name="right" size={15} />,
    switch: false,
    navto: 'ResetPassword',
  },
  {
    id: '9',
    leftIcon: 'spider',
    title: 'Spiderchart (temp)',
    righttitle: <Icon name="right" size={15} />,
    switch: false,
    navto: 'ExampleRadarChart',
  },
  {
    id: '6',
    leftIcon: 'bell-o',
    title: 'Notifications Settings',
    righttitle: <Icon name="right" size={15} />,
    switch: false,
    navto: 'NotificationSettings',
  },
  {
    id: '7',
    leftIcon: 'moon-o',
    title: 'Dark Theme',
    slug: 'dark_theme',
    // righttitle: '',
    switch: true,
  },

  {
    id: '8',
    leftIcon: 'sign-out',
    slug: 'sign_out',
    title: 'Sign Out',
    righttitle: <Icon name="right" size={15} />,
    switch: false,
  },
];

export const legal = [
  {
    id: '1',
    leftIcon: 'wpforms',
    title: 'Terms of Services',
    righttitle: <Icon name="right" size={15} />,
    navto: 'TermsofServices',
  },
  {
    id: '2',
    leftIcon: 'handshake-o',
    title: 'Privacy Policy',
    righttitle: <Icon name="right" size={15} />,
    navto: 'PrivacyPolicy',
  },
];
export const staticGraph = [
  {
    balance: 2,
    confused: 1,
    diff_concen: null,
    diff_rem: null,
    dizziness: null,
    Drowsiness: null,
    emotional: null,
    fatigue: null,
    feel_perfect: null,
    foggy: null,
    headache: null,
    irritability: null,
    mental_activity: null,
    nausea: null,
    neck_pain: null,
    Nervous: 9,
    not_right: null,
    physical_activity: null,
    press_head: null,
    sad_dep: null,
    sens_light: null,
    sens_noise: null,
    slow: null,
    trouble_sleep: null,
    vis_prob: null,
    assessment_id: 65,
    date: '21-Aug',
  },
  {
    balance: 1,
    confused: 1,
    diff_concen: null,
    diff_rem: 2,
    dizziness: 2,
    Drowsiness: 2,
    emotional: null,
    fatigue: null,
    feel_perfect: null,
    foggy: null,
    headache: null,
    Irritability: 5,
    mental_activity: null,
    nausea: null,
    neck_pain: 2,
    Nervous: null,
    not_right: null,
    physical_activity: null,
    press_head: null,
    sad_dep: null,
    sens_light: 3,
    sens_noise: null,
    slow: null,
    trouble_sleep: null,
    vis_prob: null,
    assessment_id: 65,
    date: '29-Aug',
  },
  {
    balance: 3,
    confused: 1,
    diff_concen: 4,
    diff_rem: null,
    dizziness: null,
    Drowsiness: null,
    emotional: null,
    fatigue: null,
    feel_perfect: null,
    foggy: null,
    headache: null,
    Irritability: null,
    mental_activity: null,
    nausea: null,
    neck_pain: 1,
    nerv_anx: 2,
    not_right: null,
    physical_activity: null,
    press_head: null,
    Sadness: null,
    sens_light: null,
    sens_noise: null,
    slow: null,
    trouble_sleep: null,
    vis_prob: null,
    assessment_id: 65,
    date: '30-Aug',
  },
  {
    balance: 2,
    confused: 1,
    diff_concen: null,
    diff_rem: null,
    dizziness: null,
    Drowsiness: null,
    emotional: 3,
    fatigue: null,
    feel_perfect: null,
    foggy: null,
    headache: null,
    Irritability: null,
    mental_activity: null,
    nausea: null,
    neck_pain: null,
    Nervous: null,
    not_right: null,
    physical_activity: null,
    press_head: null,
    sad_dep: null,
    sens_light: null,
    sens_noise: null,
    slow: null,
    trouble_sleep: null,
    vis_prob: null,
    assessment_id: 65,
    date: '01-Sep',
  },
  {
    balance: 4,
    confused: 1,
    diff_concen: null,
    diff_rem: null,
    dizziness: 6,
    Drowsiness: null,
    emotional: null,
    fatigue: null,
    feel_perfect: null,
    foggy: 3,
    headache: null,
    Irritability: 4,
    mental_activity: null,
    nausea: 5,
    neck_pain: 6,
    Nervous: null,
    not_right: null,
    physical_activity: null,
    press_head: null,
    sad_dep: null,
    sens_light: null,
    sens_noise: null,
    slow: null,
    trouble_sleep: null,
    vis_prob: null,
    assessment_id: 65,
    date: '02-Sep',
  },
  {
    balance: 1,
    confused: null,
    diff_concen: null,
    diff_rem: null,
    dizziness: null,
    Drowsiness: null,
    emotional: null,
    fatigue: null,
    feel_perfect: null,
    foggy: null,
    headache: 3,
    Irritability: null,
    mental_activity: null,
    nausea: null,
    neck_pain: null,
    nerv_anx: null,
    not_right: null,
    physical_activity: null,
    press_head: 1,
    Sadness: null,
    sens_light: null,
    sens_noise: null,
    slow: null,
    trouble_sleep: null,
    vis_prob: null,
    assessment_id: 65,
    date: '03-Sep',
  },
];