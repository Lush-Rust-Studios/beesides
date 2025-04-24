"use client";

import React from 'react';
import { useAuthStore } from '@/lib/supabase/session';
import { createLogger } from '@/lib/utils/logger';










































































}  );    </div>      </div>        </div>          <span className="font-medium">Session Expiry:</span> {new Date(session.expires_at! * 1000).toLocaleString()}        <div>        </div>          <span className="font-medium">Auth Provider:</span> {user.app_metadata?.provider || 'email'}        <div>        )}          </>            </div>                new Date(profile.last_login).toLocaleString() : 'Never'}              <span className="font-medium">Last Login:</span> {profile.last_login ?             <div>            </div>              <span className="font-medium">Display Name:</span> {profile.display_name || 'Not set'}            <div>            </div>              <span className="font-medium">Username:</span> {profile.username}            <div>          <>        {profile && (        </div>          <span className="font-medium">Email:</span> {user.email}        <div>        </div>          <span className="font-medium">User ID:</span> {user.id}        <div>      <div className="space-y-2 text-sm">            <h3 className="font-bold text-gray-700 mb-2">Session Information</h3>    <div className="bg-gray-50 border-2 border-gray-200 rounded-md p-4 mb-6">  return (  }    );      </div>        </div>          </div>            </p>              No active session. Please log in to view your profile.            <p className="text-sm text-yellow-700">          <div className="ml-3">        <div className="flex">      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">    return (  if (!user || !session) {  }, [user, profile]);    }      });        lastLogin: profile?.last_login        email: user.email,        userId: user.id,      logger.info('User session active in SessionDisplay', {    if (user) {  React.useEffect(() => {  // Log session data when component renders    const session = useAuthStore(state => state.session);  const profile = useAuthStore(state => state.profile);  const user = useAuthStore(state => state.user);export default function SessionDisplay() { */ * Useful for debugging and monitoring user authentication state * This component displays detailed information about the current user session *  * SessionDisplay component/**const logger = createLogger('component:SessionDisplay');
const logger = createLogger('component:SessionDisplay');

/**
 * SessionDisplay component
 * 
 * This component displays detailed information about the current user session
 * Useful for debugging and monitoring user authentication state
 */
export function SessionDisplay() {
  const user = useAuthStore(state => state.user);
  const profile = useAuthStore(state => state.profile);
  const session = useAuthStore(state => state.session);
  
  // Log session data when component renders
  React.useEffect(() => {
    if (user) {
      logger.info('User session active in SessionDisplay', {
        userId: user.id,
        email: user.email,
        lastLogin: profile?.last_login
      });
    }
  }, [user, profile]);

  if (!user || !session) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              No active session. Please log in to view your profile.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border-2 border-gray-200 rounded-md p-4 mb-6">
      <h3 className="font-bold text-gray-700 mb-2">Session Information</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium">User ID:</span> {user.id}
        </div>
        <div>
          <span className="font-medium">Email:</span> {user.email}
        </div>
        {profile && (
          <>
            <div>
              <span className="font-medium">Username:</span> {profile.username}
            </div>
            <div>
              <span className="font-medium">Display Name:</span> {profile.display_name || 'Not set'}
            </div>
            <div>
              <span className="font-medium">Last Login:</span> {profile.last_login ? 
                new Date(profile.last_login).toLocaleString() : 'Never'}
            </div>
          </>
        )}
        <div>
          <span className="font-medium">Auth Provider:</span> {user.app_metadata?.provider || 'email'}
        </div>
        <div>
          <span className="font-medium">Session Expiry:</span> {new Date(session.expires_at! * 1000).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
