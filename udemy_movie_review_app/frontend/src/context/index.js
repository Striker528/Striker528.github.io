import React from 'react'
import ThemeProvider from './ThemeProvider';
import NotificationProvider from './NotificationProvider';
import AuthProvider from './AuthProvider';

export default function ContextProviders({ children }) {
    //have to put authProvider under the notificationProvider
    return (
        <NotificationProvider>
            <AuthProvider>
                <ThemeProvider>
                    <React.StrictMode>
                        {children}
                    </React.StrictMode>
                </ThemeProvider>
            </AuthProvider>
         </NotificationProvider>
  )
}
