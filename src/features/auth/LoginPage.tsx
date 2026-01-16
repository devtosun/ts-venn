import { Navigate } from 'react-router-dom';
import { useAuthState } from './state/authState';
import { LoginForm } from './components/LoginForm';

export function LoginPage() {
  const isAuthenticated = useAuthState((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>ts-venn</h1>
        <p className="login-subtitle">Visual Venn Diagram Editor</p>
        <LoginForm />
      </div>
    </div>
  );
}
