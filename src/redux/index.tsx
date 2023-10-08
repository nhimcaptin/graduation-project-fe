import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch as useReduxDispatch, useSelector as useReduxSelector } from 'react-redux';
import REDUX_SLICE_NAMES from '../consts/redux-slice-names';
import loadingSlice from './store/loadingScreen';
import toastMessageSlice from './store/ToastMessage';
import userSlice from './store/userInfo';
import checkingChanges from './store/checkingChanges';
import confirmModalSlice from './store/confirmModal';

const store = configureStore({
  reducer: combineReducers({
    [REDUX_SLICE_NAMES.USER_INFO]: userSlice,
    [REDUX_SLICE_NAMES.LOADING_FULL_SCREEN]: loadingSlice,
    [REDUX_SLICE_NAMES.TOAST_NOTIFICATION]: toastMessageSlice,
    [REDUX_SLICE_NAMES.CHECKING_CHANGES]: checkingChanges,
    [REDUX_SLICE_NAMES.CONFIRM_MODAL]: confirmModalSlice,
  })
});

export const useSelector = useReduxSelector;

export const useDispatch = () => useReduxDispatch();

export default store;
