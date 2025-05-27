// this component handles both the posts list and the stats chart.
// We are fetching users and posts in parallel so the chart and list can be built together, and the UI feels snappy.
// we always check localStorage for updated posts, so edits persist even after a refresh. this way, what you see is always the latest version, not just what the API returns.
// search and pagination are handled on the client side, and search always uses the latest (possibly edited) data. 
// debounce is there so we don't filter on every keystroke and make the UI smoother.
// pagination is modular and can be reused elsewhere.

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import PostDetail from '../PostDetail/PostDetail';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FiSearch, FiChevronRight } from 'react-icons/fi';
import { fetchPosts, fetchUsers } from '../../api';
import useDebounce from '../../hooks/useDebounce';
import styles from './PostsList.module.css';
import { useNavigate } from 'react-router-dom';
import Pagination from './Pagination'; // Modular pagination component

const getUpdatedPost = (postId, originalPost) => {
  const updated = localStorage.getItem(`post_${postId}`);
  return updated ? JSON.parse(updated) : originalPost;
};

const ACCENT = '#7c3aed'; // purple
const ACCENT_DARK = '#5b21b6';
const ACCENT_LIGHT = '#ede9fe';
const AUTHOR_BG = '#a78bfa';
const TITLE_COLOR = '#23272f';

// purple-based color palette for the pie chart
const PIE_COLORS = [
  '#7c3aed', // purple
  '#a78bfa', // lilac
  '#f472b6', // pink
  '#c4b5fd', // light lilac
  '#fbcfe8', // very light pink
  '#ede9fe', // very light purple
  '#a21caf', // dark purple
  '#f9a8d4', // pastel pink
  '#818cf8', // blueish purple
  '#e0e7ff'  // very light blue-purple
];

function highlightText(text, term) {
  if (!term) return text;
  const regex = new RegExp(`(${term})`, 'gi');
  return text.split(regex).map((part, i) =>
    regex.test(part) ? <mark key={i} style={{ background: '#fff3cd', color: '#856404', padding: 0 }}>{part}</mark> : part
  );
}

const PostsList = ({ showOnlyChart = false, statsRef, postsRef }) => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [userPostCounts, setUserPostCounts] = useState([]);
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;
  const localStatsRef = useRef(null);
  const localPostsRef = useRef(null);
  const statsSectionRef = statsRef ? statsRef : localStatsRef;
  const postsSectionRef = postsRef ? postsRef : localPostsRef;
  const navigate = useNavigate();

  // Add debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // i want to avoid double loading spinners, so i fetch both users and posts at the same time
  useEffect(() => {
    Promise.all([
      fetchUsers(),
      fetchPosts()
    ]).then(([usersData, postsData]) => {
      setUsers(usersData);
      setPosts(postsData);
      // this is for the chart: count how many posts each user has
      const counts = {};
      postsData.forEach(post => {
        counts[post.userId] = (counts[post.userId] || 0) + 1;
      });
      const chartData = usersData.map((u, idx) => ({
        name: u.name,
        value: counts[u.id] || 0,
        fill: PIE_COLORS[idx % PIE_COLORS.length]
      }));
      setUserPostCounts(chartData);
    });
  }, []);

  // always merge posts with localStorage so edits are never lost
  const getAllUpdatedPosts = (posts) => {
    return posts.map(post => getUpdatedPost(post.id, post));
  };

  // search/filter always uses the latest (possibly edited) data
  const allPosts = getAllUpdatedPosts(Array.isArray(posts) ? posts : []);
  const filteredPosts = allPosts.filter(post =>
    post.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    post.body.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / postsPerPage));
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  const handleViewDetails = (postId) => {
    setSelectedPostId(postId);
  };

  const handleCloseModal = () => {
    setSelectedPostId(null);
  };

  // handle page change from pagination component

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // whenever the search term changes, i want to reset to page 1 so the user always sees results
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  return (
    <div className={styles.container}>
      {/* chart section: shows post distribution per user */}
      <div ref={statsSectionRef} id="stats-section" className={styles.chartSection}>
        <h2 className={styles.chartTitle}>Posts</h2>
        <p className={styles.welcomeText}>Welcome, <span className={styles.userEmail}>{user?.email}</span></p>
        <div className={styles.chartCard}>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={window.innerWidth > 900 ? 220 : 180} className="posts-chart">
              <PieChart>
                <Pie
                  data={userPostCounts}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={window.innerWidth > 900 ? 70 : 60}
                  outerRadius={window.innerWidth > 900 ? 100 : 80}
                  fill={ACCENT}
                  paddingAngle={3}
                  isAnimationActive
                >
                  {userPostCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.chartLegend}>
            <h3 className={styles.chartLegendTitle}>Posts per User</h3>
            <div style={{ width: '100%' }}>
              <Legend
                layout="vertical"
                verticalAlign="top"
                align={window.innerWidth > 900 ? 'left' : 'center'}
                wrapperStyle={{ position: 'relative', fontSize: 13, width: '100%' }}
                payload={userPostCounts.map((item, index) => ({
                  id: item.name,
                  type: 'square',
                  value: item.name,
                  color: item.fill
                }))}
              />
            </div>
          </div>
        </div>
      </div>
      {/* posts section: search, list, and pagination */}
      {!showOnlyChart && (
        <div ref={postsSectionRef} id="posts-section">
          <div className={styles.searchRow}>
            <div className={styles.searchInputWrap}>
              <input
                type="text"
                placeholder="Search by title or body..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '10px 38px 10px 14px', borderRadius: 12, border: `1.5px solid ${ACCENT_LIGHT}`, fontSize: 16, background: ACCENT_LIGHT, color: TITLE_COLOR, fontWeight: 500, outline: 'none', boxShadow: 'none' }}
              />
              <FiSearch style={{ position: 'absolute', right: 12, top: 12, color: ACCENT, fontSize: 20 }} />
            </div>
          </div>
          {/* search results info */}
          {debouncedSearchTerm && (
            <div className={styles.searchAlert}>
              Found {filteredPosts.length} results | Search term: <span className={styles.searchTerm}>{debouncedSearchTerm}</span>
            </div>
          )}
    
          {filteredPosts.length === 0 && (
            <div className={styles.emptyResults}>
              No posts match this criteria. Try searching for something else in the title or body.
            </div>
          )}
          <div className={styles.grid}>
            {paginatedPosts && paginatedPosts.length > 0 && paginatedPosts.map(post => {
              const displayPost = getUpdatedPost(post.id, post);
              const authorName = users.find(u => u.id === post.userId)?.name || `User ${post.userId}`;
              return (
                <div
                  key={post.id}
                  className={styles.postCard}
                >
                  <div>
                    <div className={styles.postTitle}>
                      {highlightText(displayPost.title, debouncedSearchTerm)}
                    </div>
                    <div className={styles.postBody}>
                      {highlightText(displayPost.body, debouncedSearchTerm)}
                    </div>
                  </div>
                  <div className={styles.authorName}>- {authorName}</div>
                  <div className={styles.detailsButton} onClick={() => handleViewDetails(post.id)}>
                    Details <FiChevronRight style={{ marginLeft: 6, fontSize: 16, verticalAlign: 'middle' }} />
                  </div>
                </div>
              );
            })}
          </div>
          {totalPages > 1 && paginatedPosts && paginatedPosts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      )}
      {/* modal for editing post details */}
      {selectedPostId && (
        <div className={styles.modalBg} onMouseDown={e => { if (e.target === e.currentTarget) handleCloseModal(); }}>
          <div className={styles.modal} onMouseDown={e => e.stopPropagation()}>
            <button
              onClick={handleCloseModal}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'none',
                border: 'none',
                fontSize: 22,
                color: '#888',
                cursor: 'pointer',
                fontWeight: 700
              }}
              aria-label="Close"
            >
              ×
            </button>
            <PostDetail postId={selectedPostId} onClose={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsList;