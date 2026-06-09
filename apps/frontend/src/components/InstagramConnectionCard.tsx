import { useEffect, useState } from "react";
import { getInstagramConnectionStatus, getInstagramConnectUrl } from "../services/api";

type ConnectionStatus = {
  configured: boolean;
  missing: string[];
  connected: boolean;
  account: {
    instagramUsername: string | null;
    instagramAccountId: string;
    facebookPageName: string | null;
    tokenExpiresAt: string | null;
  } | null;
};

export const InstagramConnectionCard = () => {
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const response = await getInstagramConnectionStatus();
        setStatus(response);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to load Instagram connection status.");
      } finally {
        setLoading(false);
      }
    };

    void loadStatus();
  }, []);

  const handleConnect = async () => {
    try {
      setConnecting(true);
      setError(null);
      const redirectUri = `${window.location.origin}/instagram/callback`;
      const response = await getInstagramConnectUrl(redirectUri);
      window.location.href = response.url;
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to start Instagram connection.");
      setConnecting(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Checking Instagram connection…</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Instagram Connection</h3>
          {!status?.configured && (
            <p className="mt-1 text-sm text-red-600">
              Missing backend env vars: {status?.missing.join(", ")}
            </p>
          )}
          {status?.configured && status.connected && (
            <p className="mt-1 text-sm text-green-700">
              Connected to @{status.account?.instagramUsername || "instagram-account"}
              {status.account?.facebookPageName ? ` via ${status.account.facebookPageName}` : ""}
            </p>
          )}
          {status?.configured && !status.connected && (
            <p className="mt-1 text-sm text-gray-600">
              Connect your Instagram Professional account before publishing.
            </p>
          )}
          {status?.account?.tokenExpiresAt && (
            <p className="mt-1 text-xs text-gray-500">
              Token expires on {new Date(status.account.tokenExpiresAt).toLocaleString()}
            </p>
          )}
        </div>

        {!status?.connected && (
          <button
            onClick={handleConnect}
            disabled={connecting || !status?.configured}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {connecting ? "Opening Instagram…" : "Connect Instagram"}
          </button>
        )}
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
};
