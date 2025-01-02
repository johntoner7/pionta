import React, { useState } from 'react';
import styles from './Mobile.module.scss';
import MapComponent from './map/Map';
import { Tab, Typography, Button } from '@mui/material';
import TabButtons from './panel/Tabs';
import Filters from './panel/Filters';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const Mobile: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const toggleFilters = () => {
        setFiltersOpen(!filtersOpen);
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <Button onClick={toggleMenu} className={styles.menuButton}>
                    {menuOpen ? <CloseIcon /> : <MenuIcon />} Filters
                </Button>
            </div>

            {/* Collapsible Menu */}
            <div
                className={`${styles.menu} ${menuOpen ? styles.menuOpen : ''}`}
            >
                <ul>
                    <Filters />
                    {/* button to close menu */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button onClick={toggleMenu} className={styles.closeButton}>
                            <CloseIcon sx={{fontSize: 30}} />
                        </Button>
                    </div>
                </ul>
            </div>

            {/* Main Content */}
            <div className={styles.content}>
                <div className={styles.map}>
                    <MapComponent />
                </div>
                <div className={styles.filters}></div>
            </div>
        </div>
    );
};

export default Mobile;
