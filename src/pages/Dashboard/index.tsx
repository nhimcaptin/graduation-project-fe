import useAuth from "../../hook/useAuth";

const Dashboard = () => {
  const { logout } = useAuth();
  const handleSubmit = () => {
    logout();
  };
  return (
    <>
      Dashboard <button onClick={() => handleSubmit()}>Đăng xuất</button>
    </>
  );
};

export default Dashboard;
