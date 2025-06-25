import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const response = await fetch("http://localhost:5173/auth/login", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        alert(
          `Login failed: ${response.status} - ${
            err.detail || response.statusText
          }`
        );
        return;
      }

      const data = await response.json();
      console.log("Login success:", data);

      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
      }
      if (data.email) {
        localStorage.setItem("user_email", data.email);
      } else {
        // Eğer backend email göndermiyorsa, buraya email state’ini koyabilirsin
        localStorage.setItem("user_email", email);
      }

      // Storage değişikliği olduğunu bildir
      window.dispatchEvent(new Event("storageChanged"));

      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      alert("An error occurred. Check console.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4 mt-10 rounded-xl border bg-card text-card-foreground shadow relative mx-auto max-w-sm w-96 p-6">
        <div>
          <h3 className="text-2xl font-bold">Sign In</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Enter your email and password to login to your account
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Email
            </label>
            <Input
              className="mt-2"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Password
            </label>
            <Input
              className="mt-2"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
        </div>
        <div>
          <Button size="full" type="submit">
            Login
          </Button>
        </div>
      </div>
    </form>
  );
}
