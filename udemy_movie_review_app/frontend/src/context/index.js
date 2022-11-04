import React from 'react'
import ThemeProvider from './ThemeProvider';
import NotificationProvider from './NotificationProvider';
import AuthProvider from './AuthProvider';
import SearchProvider from './SearchProvider';
import MoviesProvider from './MoviesProvider';

export default function ContextProviders({ children }) {
    //have to put authProvider under the notificationProvider

    //have the put the searchProvider inside the NotoficationProvider to use the useNotification hook
    return (
        <NotificationProvider>
            <SearchProvider>
                <MoviesProvider>
                    <AuthProvider>
                        <ThemeProvider>
                            <React.StrictMode>
                                {children}
                            </React.StrictMode>
                        </ThemeProvider>
                    </AuthProvider>
                </MoviesProvider>
            </SearchProvider>
        </NotificationProvider>
  )
}
