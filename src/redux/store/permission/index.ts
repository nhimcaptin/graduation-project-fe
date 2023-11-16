import { createSlice } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import REDUX_SLICE_NAMES from '../../../consts/redux-slice-names';

export interface IAction {
    code: string;
    name: string;
}

export interface IResource {
    code: string;
    name: string;
}
export interface IPermission {
    actions: IAction[];
    resource: IResource;
}
export interface IGetPermissionResponse {
    permissions: IPermission[];
}

export interface Permissions {
    actionCode: string | null;
    resourceCode: string | null;
}

interface InitialStateType {
    permissions: IPermission[];
}

const initialState: InitialStateType = {
    permissions: [],
};

export const permissionSlice = createSlice({
    name: REDUX_SLICE_NAMES.PERMISSION,
    initialState,
    reducers: {
        setPermissionsAction: (state, { payload }) => {
            state.permissions = payload;
        }
    }
});

export const { setPermissionsAction } = permissionSlice.actions;

export const usePermissionState = () => {
    const dispatch = useDispatch();
    const setPermission = (data: any) => {
        dispatch(setPermissionsAction(data));
    };

    return {  setPermission };
};

export default permissionSlice.reducer;
