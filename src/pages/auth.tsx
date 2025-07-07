"use client";

import { useState } from "react";
import Login from "./auth/login";
import Register from "./auth/register";

export default function Auth() {
  const [showRegister, setShowRegister] = useState(false);

  return showRegister ? (
    <Register onSwitchToLogin={() => setShowRegister(false)} />
  ) : (
    <Login onSwitchToRegister={() => setShowRegister(true)} />
  );
}
