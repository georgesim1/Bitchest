import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import axios from "../api/axios";
import { Link, useNavigate, useLocation } from 'react-router-dom';



const drawerWidth = 240;

function ResponsiveDrawer(props) {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const location = useLocation();
    const navigate = useNavigate();

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
        <div>
            <img src='/assets/bitchest_logo.png' alt="Logo" />
            <Divider />
            <List>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <InboxIcon />
                            </ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItemButton>
                    </ListItem>
                </Link>
                <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <MailIcon />
                            </ListItemIcon>
                            <ListItemText primary="Mon Profile" />
                        </ListItemButton>
                    </ListItem>
                </Link>
                <Link to="/crypto-list" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <MailIcon />
                            </ListItemIcon>
                            <ListItemText primary="Cryptocurrencies" />
                        </ListItemButton>
                    </ListItem>
                </Link>
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleLogout}>
                            <ListItemIcon>
                                <MailIcon />
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
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
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
