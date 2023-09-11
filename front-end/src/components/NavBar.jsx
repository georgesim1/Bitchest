import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import List from '@mui/material/List';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ListItem from '@mui/material/ListItem';
import PaidIcon from '@mui/icons-material/Paid';
import ListItemButton from '@mui/material/ListItemButton';
import LogoutIcon from '@mui/icons-material/Logout';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import axios from "../api/axios";
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

function ResponsiveDrawer(props) {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const [userName, setUserName] = useState(null);
    const [balance, setPortfolio] = useState(null);

 
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        setUserName(user?.name);
    }, []);
    
    const fetchPortfolioBalance = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/users/portfolio');
            if (response && response.data) {
                setPortfolio(response.data.balance);
                
            }
        } catch (error) {
            console.error("Failed to fetch portfolio balance: ", error);
        }
    }

    useEffect(() => {
        fetchPortfolioBalance();
    }, []);
    
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const isLoginPage = location.pathname === "/login";

    const handleLogout = async () => {
        try {
            const response = await axios.post('/logout');
            console.log(response);
            if (response) {
                localStorage.removeItem('user');
                localStorage.setItem('isLoggedIn', 'false');
                navigate(0);
            }
        } catch (error) {
            console.error(error);
        }
    };
    
    const drawer = (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <img src='/assets/bitchest_logo.png' alt="Logo" />

        {userName && (
            <Box sx={{ padding: 2, bgcolor: '#f5f5f5' }}>
                Welcome : {userName}
            </Box>
        )}
            <Divider />
            <Box flexGrow={1}>
                <List>
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <HomeIcon />
                                </ListItemIcon>
                                <ListItemText primary="Home" />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                    <Link to="/crypto-list" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <PaidIcon />
                                </ListItemIcon>
                                <ListItemText primary="Cryptocurrencies" />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                </List>
            </Box>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleLogout} sx={{ color: "#fff", bgcolor: 'red', '&:hover': { bgcolor: '#b71c1c' } }}>
                        <ListItemIcon>
                            <LogoutIcon sx={{ color: "#fff" }} />
                        </ListItemIcon>
                        <ListItemText primary="Log Out" />
                    </ListItemButton>
                </ListItem>
            </List>
        </div>
    );
    

    const container = window !== undefined ? () => window().document.body : undefined;
    
    return (
        !isLoginPage && (
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` }, bgcolor: "#ffffff" }}>
                    <Toolbar>
                        <IconButton
                            color="#000"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            
        </Typography>
        {balance && (
            <React.Fragment>
                <AccountBalanceWalletIcon color="primary" sx={{ mr: 1 }} />
                <Typography 
                    variant="h6" 
                    noWrap 
                    component="div" 
                    color="#000000"
                >
                    Portfolio Balance: ${parseFloat(balance).toFixed(2)}
                </Typography>
            </React.Fragment>
        )}
                    </Toolbar>
                </AppBar>

                <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
                    <Drawer container={container} variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }, }}>
                        {drawer}
                    </Drawer>
                    <Drawer variant="permanent" sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }, }} open>
                        {drawer}
                    </Drawer>
                </Box>

                <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
                {/* This creates space so your content won't overlap AppBar */}  
                </Box>
            </Box>
        )
    );
}

export default ResponsiveDrawer;
