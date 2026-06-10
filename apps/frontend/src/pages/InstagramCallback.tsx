import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { exchangeInstagramCode } from "../services/api";

export const InstagramCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Completing Instagram connection…");

  useEffect(() => {
    const connect = async () => {
      const code = searchParams.get("code");
      const error = searchParams.get("error");
      const errorReason = searchParams.get("error_reason");
      const errorDescription = searchParams.get("error_description");

      if (error || errorReason || errorDescription) {
        setMessage(errorDescription || errorReason || error || "Instagram connection was cancelled.");
        return;
      }

      if (!code) {
        setMessage("No authorization code was returned by Instagram.");
        return;
      }

      try {
        const redirectUri = import.meta.env.VITE_INSTAGRAM_REDIRECT_URI || `${window.location.origin}/instagram/callback`.replace(/^http:\/\/localhost/, 'https://localhost');
        await exchangeInstagramCode(code, redirectUri);
        navigate("/", { replace: true });
      } catch (err: any) {
        setMessage(err.response?.data?.error || "Failed to connect Instagram account.");
      }
    };

    void connect();
  }, [navigate, searchParams]);

  return (
    <div className="mx-auto mt-24 max-w-xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
      <h1 className="text-2xl font-semibold text-gray-900">Instagram Setup</h1>
      <p className="mt-3 text-sm text-gray-600">{message}</p>
    </div>
  );
};
