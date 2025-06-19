import { Button } from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useSettingsModalStore } from "../hooks/SettingsModalStore";
import { ApiUsage } from "../components/ApiUsage";

export default function Topside() {
  const { showTotalCost } = useSettingsModalStore();
  const navigate = useNavigate();
  return (
    <div className="container mx-auto px-4 pt-3">
      <div className="flex md:flex-row flex-col items-center justify-between">
        <Link className="text-xl font-bold" to="/">
          Voice API Tester
        </Link>
        {showTotalCost && <ApiUsage />}
        <div className="flex items-center md:gap-4 gap-0 justify-end">
          <Button onClick={() => navigate("/login")} variant="ghost">
            Sign in
          </Button>
          <Button onClick={() => navigate("/register")} variant="ghost">
            Register
          </Button>
        </div>
      </div>
    </div>
  );
}
