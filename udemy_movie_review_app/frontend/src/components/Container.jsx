import React from 'react';

export default function Container({ children, className }) {
    
    // when changing the screen size like in opening the dev panel and enlarging it, want to keep some padding
    // https://tailwindcss.com/docs/responsive-design
    // that is where the px-2 (padding x of 2) xl:p-0 (set the breakpoint, for the xl, don't want to give any padding )
    return (
        <div className={"max-w-screen-xl mx-auto px-2 xl:p-0 " + className}>
            {children}
        </div>
    )
}