// Reusable header component

import React from "react";
import { Link } from "react-router-dom";

export default function Header({onLogout, isAuthenticated}) {
    return (
        <header className="header">
            <div className="header-inner">
                <Link to="/" className="logo-link">
                    <h1 className="logo">Equiwelf</h1>
                </Link>

                <div className="nav-links">
                    {isAuthenticated ? (
                        <button onClick={onLogout}>Logout</button>
                    ) : (
                        <Link to="/auth">Login</Link>
                    )}
                </div>
            </div>
        </header>
    );
}