// /home/tri/user/project/copyMe/src/components/Header.tsx
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="pb-4 mb-2 text-center">
            <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
                copyMe <span role="img" aria-label="clipboard emoji">📋</span>
            </h1>
            <p className="text-sm  text-secondary mt-1">Your friendly neighborhood clipboard</p>
        </header>
    );
};

export default Header;