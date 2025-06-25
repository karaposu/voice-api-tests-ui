import { Button } from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useSettingsModalStore } from "../hooks/SettingsModalStore";
import { ApiUsage } from "../components/ApiUsage";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";

export default function Topside() {
  const { showTotalCost } = useSettingsModalStore();
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const updateUser = () => {
      const email = localStorage.getItem("user_email");
      const token = localStorage.getItem("access_token");
      if (email) {
        setUserEmail(email);
      } else if (token) {
        setUserEmail("LoggedInUser");
      } else {
        setUserEmail(null);
      }
    };

    updateUser();

    window.addEventListener("storageChanged", updateUser);

    return () => {
      window.removeEventListener("storageChanged", updateUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_email");
    window.dispatchEvent(new Event("storageChanged")); // logout sonrası da güncelle
    navigate("/login");
  };

  return (
    <div className="container mx-auto px-4 pt-3">
      <div className="flex md:flex-row flex-col items-center justify-between">
        <Link className="text-xl font-bold" to="/">
          Voice API Tester
        </Link>
        {showTotalCost && <ApiUsage />}
        <div className="flex items-center md:gap-4 gap-0 justify-end">
          {!userEmail ? (
            <>
              <Button onClick={() => navigate("/login")} variant="ghost">
                Sign in
              </Button>
              <Button onClick={() => navigate("/register")} variant="ghost">
                Register
              </Button>
            </>
          ) : (
            <>
              <span className="text-sm font-medium">{userEmail}</span>
              <Button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-500"
                variant="ghost"
              >
                <LogOut className="h-5 w-5 me-1" />
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
