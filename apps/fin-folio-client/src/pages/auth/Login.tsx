import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/hooks/useAuth";
import { isLoginDto, type AuthFormData } from "@/types";
import { useNavigate } from "react-router";

const Login = () => {
  const { signIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (data: AuthFormData) => {
    // Since we know this is login mode, we can safely cast
    // const result = await dispatch(signIn(data as LoginDto));
    if (isLoginDto(data)) {
      const result = await signIn(data);
      if (result.success) {
        navigate("/", { replace: true });
      }
    }
  };
  return <AuthForm mode="login" onSubmit={handleSubmit} loading={isLoading} />;
};

export default Login;
