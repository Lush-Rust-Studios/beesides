"use client";

import { useEffect } from "react";
import { initializeAuthListener } from "@/lib/supabase/session";

/**
 * AuthProvider component
 *
 * This component initializes the auth listener and handles auth state across the app
 */
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Initialize the auth listener and store the unsubscribe function
    const unsubscribe = initializeAuthListener();

    // Clean up the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  return <>{children}</>;
}
