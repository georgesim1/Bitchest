import { BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Profile from './components/Profile.jsx';
import CryptoList from './components/CryptoList.jsx';
import Navbar from './components/Navbar.jsx';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import { Box, Toolbar } from '@mui/material';

// import CryptoList from './components/CryptoList';
const drawerWidth = 240;

function App() {
  const user = localStorage.getItem('user');
  return (
    
      <div className="">
        <Navbar />
        <AuthProvider>
                <Box
                  component="main"
                  sx={{ flexGrow: 1, p: 3, width: { sm: user ? `calc(100% - ${drawerWidth}px)`:'100%' },  marginLeft:{ sm: user ? `${drawerWidth}px`:0}}}>
                    <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/crypto-list" element={
                          <PrivateRoute>
                          <CryptoList />
                      </PrivateRoute>
                    } />
                    <Route path="/profile" element={
                          <PrivateRoute>
                          <Profile />
                      </PrivateRoute>
                    } />
                    <Route path="/" element={
                <PrivateRoute>
                    <Home />
                </PrivateRoute>
            } />
                </Routes>
                  {/* Place the main content here */}
                </Box>
        </AuthProvider>
      </div>
  )
}

export default App




