import React, { useEffect, useReducer } from "react";

import SplashScreen from "../components/SplashScreen/index";
import Toast from "../components/Toast";
import { STATUS_CODE } from "../consts/statusCode";
import { useSetUserInformationState } from "../redux/store/userInfo";
import { useSetToastInformationState } from "../redux/store/ToastMessage";
import { STATUS_TOAST } from "../consts/statusCode";
import apiService from "../services/api-services";
import URL_PATHS from "../services/url-path";

const ACTION_TYPE = {
  INITIALISE: "INITIALISE",
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
};

interface InitialAuthStateProps {
  isAuthenticated: boolean;
  isInitialised: boolean;
  user: string | null;
}

const initialAuthState: InitialAuthStateProps = {
  isAuthenticated: false,
  isInitialised: false,
  user: null
};

const reducer = (state: any, action: { type: string; payload?: any }) => {
  switch (action.type) {
    case ACTION_TYPE.INITIALISE: {
      const { isAuthenticated, user } = action.payload;
      return {
        ...state,
        isAuthenticated,
        isInitialised: true,
        user,
      };
    }
    case ACTION_TYPE.LOGIN: {
      const { user } = action.payload;
      return {
        ...state,
        isAuthenticated: true,
        user,
      };
    }
    case ACTION_TYPE.LOGOUT: {
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    }
    default: {
      return state;
    }
  }
};

const AuthContext = React.createContext({
  ...initialAuthState,
  login: (data: any) => Promise,
  logout: () => Promise,
});

interface IAuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: IAuthProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialAuthState);
  const { setUserInformation } = useSetUserInformationState();
  const { setToastInformation } = useSetToastInformationState();

  const login = async (data: any) => {
    console.log("data", data)
    localStorage.setItem("token", data.token);
    let userInfo = null;
    try {
      if (data.token) {
        const responseUserInfo: any = await apiService.get(URL_PATHS.GET_CURRENT_USER);
        console.log("responseUserInfo", responseUserInfo)
        // const responseUserInfo: any = {
        //   body: "12313123131231231321123131313123",
        // };
        if (responseUserInfo) {
          userInfo = responseUserInfo.body;
          if (userInfo) {
            setUserInformation(userInfo);
          }
        }
      }
    } catch (error) {
      localStorage.clear();
      setToastInformation({
        status: STATUS_TOAST.ERROR,
        message: "Hệ thống lỗi vui lòng thử lại sau",
      });
    } finally {
      dispatch({
        type: ACTION_TYPE.LOGIN,
        payload: {
          user: userInfo,
        },
      });
    }
    return true;
  };

  const logout = () => {
    localStorage.clear();
    dispatch({ type: ACTION_TYPE.LOGOUT });
  };

  const initData = async () => {
    let token = localStorage.getItem("token");
    let userInfo: any = null;
    try {
      if (token) {
        // const responseUserInfo: any = await GetCurrentUser();
        const responseUserInfo: any = {
          body: "12313123131231231321123131313123",
        };
        if (responseUserInfo) {
          userInfo = responseUserInfo.body;
          if (userInfo) {
            setUserInformation(userInfo);
          }
        }
      }
    } catch (error) {
      localStorage.clear();
      setToastInformation({
        status: STATUS_TOAST.ERROR,
        message: "Hệ thống lỗi vui lòng thử lại sau",
      });
    } finally {
      setTimeout(() => {
        dispatch({
          type: ACTION_TYPE.INITIALISE,
          payload: {
            isAuthenticated: Boolean(token && userInfo),
            // isAuthenticated: true,
            user: userInfo,
          },
        });
      }, 200);
    }
  };

  useEffect(() => {
    initData();
  }, []);

  if (!state.isInitialised) {
    return <SplashScreen />;
  }

  return (
    <>
      <AuthContext.Provider
        value={{
          ...state,
          logout,
          login,
        }}
      >
        {children}
      </AuthContext.Provider>
      <Toast />
    </>
  );
};

export default AuthContext;
