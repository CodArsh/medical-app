const actions = {
  SET_LANGUAGE: 'auth/SET_LANGUAGE',
  SELECT_LANGUAGE: 'auth/SELECT_LANGUAGE',
  UPDATE_LANGUAGE: 'auth/UPDATE_LANGUAGE',

  setLanguage: languageData => dispatch =>
    dispatch({
      type: actions.SET_LANGUAGE,
      languageData,
    }),
  setSelectLanguage: selectLanguage => dispatch =>
    dispatch({
      type: actions.SELECT_LANGUAGE,
      selectLanguage,
    }),
  languageUpdate: updateLanguage => dispatch =>
    dispatch({
      type: actions.UPDATE_LANGUAGE,
      updateLanguage,
    }),
};

export default actions;
