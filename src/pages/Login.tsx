import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  return (
    <>
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
              placeholder="Enter your password"
            />
          </div>
        </div>
        <div>
          <Button size="full" type="submit">
            Register
          </Button>
        </div>
      </div>
    </>
  );
}
