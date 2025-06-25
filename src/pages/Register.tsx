import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5173/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const err = await response.json();
        alert("Registration failed: " + (err.detail || response.statusText));
        return;
      }

      const data = await response.json();
      console.log("Registration success:", data);
      alert("Registration successful! You can now log in.");
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      alert("An error occurred. Check console.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4 mt-10 rounded-xl border bg-card text-card-foreground shadow relative mx-auto max-w-sm w-96 p-6">
        <div>
          <h3 className="text-2xl font-bold">Register</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Enter your email and password to register
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
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Button size="full" type="submit">
            Register
          </Button>
        </div>
      </div>
    </form>
  );
}
