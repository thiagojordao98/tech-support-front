import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <ul className="navbar-list">
                <li className="navbar-item">
                    <Link to="/home" className="navbar-link">Home</Link>
                </li>
                <li className="navbar-item">
                    <Link to="/sponser" className="navbar-link">Sponser</Link>
                </li>
                <li className="navbar-item">
                    <Link to="/about" className="navbar-link">About</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;