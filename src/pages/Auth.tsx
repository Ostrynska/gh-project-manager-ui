// pages/Login.js
import { useEffect } from "react";

interface AuthProps {
  redirectToDashboard: boolean;
}

export default function Auth({ redirectToDashboard }: AuthProps) {
  useEffect(() => {
    if (redirectToDashboard) {
      window.location.href = "/";
      return;
    }

    const clientId = "4jv9mce2p6q6f6mkanobk6hhlt";
    const redirectUri = "http://localhost:5174";
    const cognitoDomain = "https://eu-north-1vstzqrh3p.auth.eu-north-1.amazoncognito.com";

    window.location.href = `${cognitoDomain}/login?client_id=${clientId}&response_type=code&scope=aws.cognito.signin.user.admin&redirect_uri=${encodeURIComponent(redirectUri)}`;
  }, [redirectToDashboard]);

  return null;
}
