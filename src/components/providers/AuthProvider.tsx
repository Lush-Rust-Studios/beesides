"use client";

import { useEffect } from "react";
import { initializeAuthListener } from "@/lib/supabase/session";
import { createLogger } from "@/lib/utils/logger";

// Create a logger for the AuthProvider component
const logger = createLogger("component:AuthProvider");

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
    // Log auth provider initialization
    logger.info("Initializing AuthProvider");

    // Initialize the auth listener and store the unsubscribe function
    const unsubscribe = initializeAuthListener();

    // Clean up the listener when the component unmounts
    return () => {
      logger.debug("Cleaning up auth listener");
      unsubscribe();
    };
  }, []);

  return <>{children}</>;
}
