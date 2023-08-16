import { BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Navbar from './components/Navbar.jsx';
import { AuthProvider } from './contexts/AuthContext';
// import PrivateRoute from './components/PrivateRoute';

// import CryptoList from './components/CryptoList';

function App() {
  return (
      <div className="">
        <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/home" element={<Home />} />
                    {/* ... other routes ... */}
                </Routes>
        </AuthProvider>
      </div>
  )
}

export default App




