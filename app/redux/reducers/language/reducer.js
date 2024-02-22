import types from './actions';

const initialState = {
  languageData: 'en',
  selectLanguage: false,
  updateLanguage: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.SET_LANGUAGE:
      return {
        ...state,
        languageData: action.languageData,
      };
    case types.SELECT_LANGUAGE:
      return {
        ...state,
        selectLanguage: action.selectLanguage,
      };
    case types.UPDATE_LANGUAGE:
      return {
        ...state,
        updateLanguage: action.updateLanguage,
      };
    default:
      return state;
  }
}
