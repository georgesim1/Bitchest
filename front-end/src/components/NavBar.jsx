import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Box, AppBar, CssBaseline, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Toolbar, ListItemButton } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import MailIcon from '@mui/icons-material/Mail';

const drawerWidth = 240;

function ResponsiveDrawer(props) {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isLoggedIn, setIsLoggedIn] = React.useState(() => {
        // Check local storage on initial render.
        return localStorage.getItem('isLoggedIn') === 'true';
    });

    const location = useLocation();
    const navigate = useNavigate();

    React.useEffect(() => {
        console.log("Is logged in:", isLoggedIn);
    }, [isLoggedIn]);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const isLoginPage = location.pathname === "/login";

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.setItem('isLoggedIn', 'false');
        navigate('/login');
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
                {isLoggedIn && (
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleLogout}>
                            <ListItemIcon>
                                <MailIcon />
                            </ListItemIcon>
                            <ListItemText primary="Log Out" />
                        </ListItemButton>
                    </ListItem>
                )}
            </List>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        !isLoginPage && (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}></AppBar>

            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
                <Drawer container={container} variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }, }}>
                    {drawer}
                </Drawer>
                <Drawer variant="permanent" sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }, }} open>
                    {drawer}
                </Drawer>
            </Box>

            <Box component="main" sx={{ flexGrow: 1, p: 3, ml: { sm: drawerWidth }, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
                <Toolbar /> {/* This pushes content below the AppBar */}
                {/* Your main content goes here */}
            </Box>
        </Box>
        )
    );
}

export default ResponsiveDrawer;
