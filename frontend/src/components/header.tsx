import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="flex py-2 sm:py-6 px-4 sm:px-6 items-center justify-between container">
      <Link to="/" className="text-lg sm:text-2xl font-bold">
        WebName
      </Link>
      <Link
        to={"/api/auth/google" as any}
        className="text-sm sm:text-base font-medium"
      >
        Sign in
      </Link>
    </header>
  );
}
