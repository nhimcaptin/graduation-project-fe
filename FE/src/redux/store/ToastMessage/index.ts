import { createSlice } from '@reduxjs/toolkit';
import REDUX_SLICE_NAMES from '../../../consts/redux-slice-names';
import { useDispatch } from 'react-redux';

interface InitialStateType {
  toastMessage: object;
}

const initialState: InitialStateType = {
  toastMessage: {}
};

export const toastMessageSlice = createSlice({
  name: REDUX_SLICE_NAMES.TOAST_NOTIFICATION,
  initialState,
  reducers: {
    setToastMessage: (state, { payload }) => {
      state.toastMessage = payload.infoToast;
    }
  }
});

export const { setToastMessage } = toastMessageSlice.actions;

export const useSetToastInformationState = () => {
  const dispatch = useDispatch();
  const setToastInformation = (infoToast: object) => {
    dispatch(setToastMessage({ infoToast }));
  };
  return { setToastInformation };
};

export default toastMessageSlice.reducer;
