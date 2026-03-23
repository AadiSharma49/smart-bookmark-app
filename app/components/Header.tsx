"use client";

import { Button } from "./ui/Button";
import { AuthOperations } from "../types";

interface HeaderProps extends Pick<AuthOperations, 'onLogout'> {
  email?: string;
}

export function Header({ email, onLogout }: HeaderProps) {
  return (
    <div className="bg-black rounded-2xl shadow-md p-6 flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold text-white">
          Welcome back
        </h2>
        <p className="text-blue-500 text-sm">
          {email}
        </p>
      </div>

      <Button
        onClick={onLogout}
        variant="danger"
        className="px-4 py-2"
      >
        Logout
      </Button>
    </div>
  );
}
