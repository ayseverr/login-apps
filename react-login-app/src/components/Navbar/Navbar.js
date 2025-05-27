import React from 'react';
import styles from './Navbar.module.css';
import { AiOutlineFileText } from 'react-icons/ai';
import { BiBarChartAlt2 } from 'react-icons/bi';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { CgProfile } from 'react-icons/cg';

export default function Navbar({ activeSection, onNavClick, user, logout, navigate }) {
  return (
    <nav className={styles.navbarRoot}>
      <div className={styles.navbarInner}>
        <div className={styles.navbarTitle}>
          <AiOutlineFileText size={24} />
          Dashboard <span style={{ color: '#6b7280', fontWeight: 400, fontSize: 18 }}>&gt;</span> Posts
        </div>
        <div className={styles.navbarLinks}>
          <button
            onClick={() => onNavClick('stats')}
            style={{
              color: activeSection === 'stats' ? '#7c3aed' : '#222',
              background: 'none',
              border: 'none',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
              borderBottom: activeSection === 'stats' ? '3px solid #7c3aed' : '3px solid transparent',
              padding: '8px 0',
              transition: 'color 0.2s, border-bottom 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <BiBarChartAlt2 size={20} /> Stats
          </button>
          <button
            onClick={() => onNavClick('posts')}
            style={{
              color: activeSection === 'posts' ? '#7c3aed' : '#222',
              background: 'none',
              border: 'none',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
              borderBottom: activeSection === 'posts' ? '3px solid #7c3aed' : '3px solid transparent',
              padding: '8px 0',
              transition: 'color 0.2s, border-bottom 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <HiOutlineDocumentText size={20} /> Posts
          </button>
          <div className={styles.navbarProfile}>
            <CgProfile size={20} />
            Welcome, <span style={{ color: '#222', fontWeight: 600 }}>{user?.email}</span>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className={styles.logoutBtn}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 