import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch as useReduxDispatch, useSelector as useReduxSelector } from 'react-redux';
import REDUX_SLICE_NAMES from '../consts/redux-slice-names';
import loadingSlice from './store/loadingScreen';
import toastMessageSlice from './store/ToastMessage';
import userSlice from './store/userInfo';

const store = configureStore({
  reducer: combineReducers({
    [REDUX_SLICE_NAMES.USER_INFO]: userSlice,
    [REDUX_SLICE_NAMES.LOADING_FULL_SCREEN]: loadingSlice,
    [REDUX_SLICE_NAMES.TOAST_NOTIFICATION]: toastMessageSlice,
  })
});

export const useSelector = useReduxSelector;

export const useDispatch = () => useReduxDispatch();

export default store;
