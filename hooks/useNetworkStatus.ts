import { useEffect, useState } from "react";

function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNetworkWarning, setShowNetworkWarning] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowNetworkWarning(false);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowNetworkWarning(true);
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return { isOnline, showNetworkWarning };
}

export default useNetworkStatus;
