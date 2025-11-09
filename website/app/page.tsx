"use client";

import { useState, useEffect } from "react";
import AuthPage from "@/components/auth/auth-page";
import ChatPage from "@/components/chat/chat-page";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };
    checkAuth();
  }, []);

  return isAuthenticated ? (
    <ChatPage
      onLogout={() => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userName");
        setIsAuthenticated(false);
      }}
    />
  ) : (
    <AuthPage onAuthSuccess={() => setIsAuthenticated(true)} />
  );
}
