import { useNavigate } from "react-router-dom";
import useAuth from "../../hook/useAuth";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleLogin = () => {
    try {
      const submitData = {
        token: "This is token",
        responseUserInfo: {
          statusCode: 200,
        },
      };
      login(submitData);
      navigate('/', { replace: false });
    } catch (error) {}
  };
  return (
    <>
      1231312313123123 <button onClick={() => handleLogin()}>Đăng nhập</button>
    </>
  );
};

export default Login;
