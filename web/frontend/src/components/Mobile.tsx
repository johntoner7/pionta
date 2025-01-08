import React, { useContext, useState } from 'react';
import styles from './Mobile.module.scss';
import MapComponent from './map/Map';
import { Tab, Typography, Button, Card } from '@mui/material';
import TabButtons from './panel/Tabs';
import Filters from './panel/Filters';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBeer } from '@fortawesome/free-solid-svg-icons';
import { FaCross, FaWindowClose } from 'react-icons/fa';
import { PintsContext } from '../PintsContext';

const Mobile: React.FC = () => {
    const context = useContext(PintsContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const [aboutOpen, setAboutOpen] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const toggleAbout = () => {
        setAboutOpen(!aboutOpen);
    }

    const toggleFilters = () => {
        setFiltersOpen(!filtersOpen);
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <Button onClick={toggleAbout} className="d-flex align-items-center">
                    <Typography variant="h5" className={styles.title}>
                        <b>Pionta </b>
                    </Typography>
                    <FontAwesomeIcon icon={faBeer} color="#007bff" size="2x" />
                </Button>
                <Button onClick={toggleMenu} className={styles.menuButton}>
                  <MenuIcon /> Menu
                </Button>
            </div>

            {/* Collapsible Menu */}
            <div
                className={`${styles.menu} ${menuOpen ? styles.menuOpen : ''}`}
            >
                <ul>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '10px 0' }}>
                    <Button onClick={toggleMenu} className={styles.closeButton} variant="contained" style={{ padding: '10px 20px', borderRadius: '20px' }}>
                        <Typography variant="h6" className={styles.closeTitle} style={{ fontWeight: 'bold' }}>
                            BACK TO MAP
                        </Typography>
                    </Button>
                </div>
                    <Filters />
                    {/* button to close menu */}
                </ul>
            </div>

            <div
                className={`${styles.about} ${aboutOpen ? styles.aboutOpen : ''}`}
            >
                <ul>
                    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                        <Typography variant="h5" className={styles.aboutTitle}>
                            <b>About</b>
                        </Typography>
                        <Typography variant="body1" className={styles.aboutText}>
                        Pionta is a web application designed to help users find the prices of pints at various bars in Belfast.
                        </Typography>
                        <Typography variant="body1" className={styles.aboutText}>
                        Currently the main features of the application are:
                        </Typography>
                        <Typography variant="body1" className={styles.aboutList}>
                        <ul>
                            <li>Users can view a map of Belfast with markers indicating the location of bars. Clicking on a marker will display the price of a pint at that bar.</li>
                            <li>Users can filter the bars displayed on the map by price, rating, and distance from their current location.</li>
                            <li>Users can view all known prices at a selected bar.</li>
                        </ul>
                        </Typography>
                        <Typography variant="body1" className={styles.aboutText}>
                         More features coming soon! 
                         <br />
                         Sláinte
                        </Typography>
                        <Button onClick={toggleAbout} className={styles.closeButton}>
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
