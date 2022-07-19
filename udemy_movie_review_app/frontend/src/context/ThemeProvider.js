import React, { createContext, useEffect } from 'react'

export const ThemeContext = createContext();

//whatever we pass into value object, can use inside children

const defaultTheme = 'light';
const darkTheme = 'dark';

export default function ThemeProvider({ children }) {
    
    const toggleTheme = () => {
        const oldTheme = getTheme();

        const newTheme = oldTheme === defaultTheme ? darkTheme : defaultTheme;

        updateTheme(newTheme, oldTheme);
    };

    useEffect(() => {
        //when the user comes back or refreshes the page, the theme stays the way they want
        //1st, get the theme from local storage
        const theme = getTheme();
        //If the user has not visisted before or no cookies, set the default theme
        if (!theme) {
            updateTheme(defaultTheme)
        }
        else {
            //user has visted before
            //Finally, apply the theme
            updateTheme(theme)
        }
    }, []);

    return (
        <ThemeContext.Provider value = {{toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    );
}


const getTheme = () => {
    return localStorage.getItem("theme");
}

const updateTheme = (theme, themeToRemove) => {
    if (themeToRemove) {
        //also need to remove the old class
        document.documentElement.classList.remove(themeToRemove)
    }
    //adding in the dark class to the html so that it will activate the dark:... that was specified
    document.documentElement.classList.add(theme)
    //console.log("from theme provider");
    //console.log(document.documentElement)

    //best place to store the theme the user specified
    localStorage.setItem("theme", theme)
}