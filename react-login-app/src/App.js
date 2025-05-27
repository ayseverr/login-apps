import React, { useRef, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login/Login';
import PostsList from './components/PostsList/PostsList';
import PostDetail from './components/PostDetail/PostDetail';

import Navbar from './components/Navbar/Navbar';

const ACCENT = '#7c3aed';
const BG = '#f9fafb';
const DESC = '#6b7280';
const CARD_SHADOW = '0 2px 12px rgba(0,0,0,0.05)';


const Stats = () => <PostsList showOnlyChart />;

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const Layout = () => {
  const statsRef = useRef(null);
  const postsRef = useRef(null);
  const [activeSection, setActiveSection] = useState('stats');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Scroll to section on navbar click
  const handleNavClick = (section) => {
    if (section === 'stats' && statsRef.current) {
      statsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (section === 'posts' && postsRef.current) {
      postsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Intersection Observer for active section
  useEffect(() => {
    const handleScroll = () => {
      const statsTop = statsRef.current?.getBoundingClientRect().top ?? 0;
      const postsTop = postsRef.current?.getBoundingClientRect().top ?? 0;
      if (Math.abs(statsTop) < Math.abs(postsTop)) {
        setActiveSection('stats');
      } else {
        setActiveSection('posts');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: BG }}>
      {/* Navbar is now a separate component for clarity and reusability */}
      <Navbar
        activeSection={activeSection}
        onNavClick={handleNavClick}
        user={user}
        logout={logout}
        navigate={navigate}
      />
      {/* Main Content */}
      <main style={{ maxWidth: 1200, margin: '0 auto', minHeight: '100vh', padding: '0 24px' }}>
        <PostsList showOnlyChart={false} statsRef={statsRef} postsRef={postsRef} accent={ACCENT} bg={BG} desc={DESC} cardShadow={CARD_SHADOW} />
      </main>
    </div>
  );
};

function App() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (user) => {
    login(user);
    navigate('/posts');
  };

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route
        path="/posts"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      />
      <Route
        path="/stats"
        element={
          <PrivateRoute>
            <Layout>
              <Stats />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/post/:postId"
        element={
          <PrivateRoute>
            <Layout>
              <PostDetail />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/posts" />} />
    </Routes>
  );
}

// this is the main app entry point. routing, auth, and layout are all wired up here.
// i'm using AuthProvider outside Router so that authentication state is available everywhere.
// the Layout component handles the sticky navbar and main content.
// login and logout are handled via context and navigation.
// See Layout and Navbar for more details on navigation and user experience.

export default function AppWithProviders() {
  return (
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  );
}
