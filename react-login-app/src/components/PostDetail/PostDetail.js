import React, { useState, useEffect } from 'react';
import { fetchPostById } from '../../api';

// this component lets you view and edit a single post.
// We always check localStorage first, because if the user already edited this post, i want to show the latest version instead of the original one from the API.
// after saving, the changes are stored in localStorage so they survive a page reload.
const PostDetail = ({ postId, onClose }) => {
  const [post, setPost] = useState(null);
  const [editedPost, setEditedPost] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // First, check localStorage for updated post data
    
    const savedPost = localStorage.getItem(`post_${postId}`);
    if (savedPost) {
      setPost(JSON.parse(savedPost));
      setEditedPost(JSON.parse(savedPost));
      setLoading(false);
    } else {
      // Use the centralized API function instead of native fetch
      // This ensures all API calls are consistent and maintainable
      fetchPostById(postId)
        .then(data => {
          setPost(data);
          setEditedPost(data);
          setLoading(false);
        })
        .catch(error => {
          setLoading(false);
          setPost(null);
        });
    }
  }, [postId]);

  const handleChange = (e) => {
    setEditedPost({ ...editedPost, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem(`post_${postId}`, JSON.stringify(editedPost));
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      if (onClose) onClose();
    }, 1200);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
        <div className="loader" style={{ width: 40, height: 40, border: '4px solid #f3f4f6', borderTop: '4px solid #f472b6', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: 16 }} />
        <span style={{ color: '#888', fontSize: 16 }}>Loading...</span>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
      </div>
    );
  }

  if (!post) return <div style={{ color: '#c00', textAlign: 'center', padding: 32 }}>Post not found.</div>;

  return (
    <div style={{ padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320, width: '100%' }}>
      <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 24, color: '#7c3aed', letterSpacing: -1, textAlign: 'center' }}>Edit Post</h2>
      <div style={{ marginBottom: 20, width: '100%', maxWidth: 400 }}>
        <label style={{ display: 'block', marginBottom: 6, color: '#7c3aed', fontWeight: 600 }}>Title</label>
        <input
          type="text"
          name="title"
          value={editedPost.title}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: 8,
            border: '1.5px solid #7c3aed',
            fontSize: 15,
            background: '#f8fafc',
            marginBottom: 8,
            color: '#333',
            fontWeight: 500
          }}
        />
      </div>
      <div style={{ marginBottom: 24, width: '100%', maxWidth: 400 }}>
        <label style={{ display: 'block', marginBottom: 6, color: '#7c3aed', fontWeight: 600 }}>Body</label>
        <textarea
          name="body"
          value={editedPost.body}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '10px',
            minHeight: 100,
            borderRadius: 8,
            border: '1.5px solid #7c3aed',
            fontSize: 15,
            background: '#f8fafc',
            resize: 'vertical',
            color: '#333',
            fontWeight: 500
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, width: '100%' }}>
        <button
          onClick={onClose}
          style={{
            padding: '7px 16px',
            background: '#f3f4f6',
            color: '#7c3aed',
            border: '1.5px solid #7c3aed',
            borderRadius: 6,
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s',
            minWidth: 80
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          style={{
            padding: '7px 16px',
            background: '#7c3aed',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(124,58,237,0.08)',
            transition: 'background 0.2s',
            minWidth: 100
          }}
        >
          Save
        </button>
      </div>
      {isSaved && (
        <div style={{
          marginTop: 18,
          background: '#f3f4f6',
          color: '#7c3aed',
          padding: '10px 16px',
          borderRadius: 6,
          textAlign: 'center',
          fontWeight: 600,
          fontSize: 15
        }}>
          Changes saved!
        </div>
      )}
    </div>
  );
};

export default PostDetail;
