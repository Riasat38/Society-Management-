import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar.js';

import { getUserFromStorage } from './utils.js';
import './HelpWall.css';
const HelpWall = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [helpDescr, setHelpDescr] = useState('');
  const [bloodDonation, setBloodDonation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = getUserFromStorage();
    
    if (!token) {
      window.location.href = '/society/login';
      return;
    }

    setUser(token);

    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:4069/society/homepage/wall', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setPosts(response.data);
        setError(null);
        console.log('Help posts fetched:', response.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleCreatePost = async () => {
    if (!user?.token) return;
    if (!helpDescr.trim()) {
      alert('Please enter a description');
      return;
    }

    try {
      const newPost = { description: helpDescr, bloodDonation };
      const response = await axios.post('http://localhost:4069/society/homepage/wall', newPost, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Create post response:', response.data);
      setPosts([...posts, response.data.helpPost]);
      setHelpDescr('');
      setBloodDonation(false);
      setError(null);
    } catch (error) {
      console.error('Failed to create post:', error);
      setError('Failed to create post. Please try again.');
    }
  };

  const handleUpdatePost = async (postId, updatedDescription) => {
    if (!user?.token) return;
    if (!updatedDescription.trim()) {
      alert('Please enter a valid description');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:4069/society/homepage/wall/${postId}/update`, 
        { description: updatedDescription },
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setPosts(posts.map(post => post._id === postId ? response.data.helpPost : post));
      setError(null);
    } catch (error) {
      console.error('Failed to update post:', error);
      setError('Failed to update post. Please try again.');
    }
  };

  const handleResolvePost = async (postId) => {
    if (!user?.token) return;

    try {
      const response = await axios.put(
        `http://localhost:4069/society/homepage/wall/${postId}/resolve`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setPosts(posts.map(post => post._id === postId ? response.data.helpPost : post));
      setError(null);
    } catch (error) {
      console.error('Failed to resolve post:', error);
      setError('Failed to resolve post. Please try again.');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!user?.token) return;
    
    try {
      await axios.delete(`http://localhost:4069/society/homepage/wall/${postId}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      setPosts(posts.filter(post => post._id !== postId));
      setError(null);
    } catch (error) {
      console.error('Failed to delete post:', error);
      setError('Failed to delete post. Please try again.');
    }
  };

  const handleAddComment = async (postId, commentContent) => {
    if (!user?.token) return;
    if (!commentContent.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:4069/society/homepage/wall/${postId}/comment`,
        { content: commentContent },
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setPosts(posts.map(post => post._id === postId ? response.data.helpPost : post));
      setError(null);
    } catch (error) {
      console.error('Failed to add comment:', error);
      setError('Failed to add comment. Please try again.');
    }
  };

  const handleUpdateComment = async (postId, commentId, updatedContent) => {
    if (!user?.token) return;
    if (!updatedContent.trim()) {
      alert('Please enter a valid comment');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:4069/society/homepage/wall/${postId}/comment/${commentId}`,
        { content: updatedContent },
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setPosts(posts.map(post => post._id === postId ? response.data.helpPost : post));
      setError(null);
    } catch (error) {
      console.error('Failed to update comment:', error);
      setError('Failed to update comment. Please try again.');
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (!user?.token) return;

    try {
      const response = await axios.delete(
        `http://localhost:4069/society/homepage/wall/${postId}/comment/${commentId}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setPosts(posts.map(post => post._id === postId ? response.data.helpPost : post));
      setError(null);
    } catch (error) {
      console.error('Failed to delete comment:', error);
      setError('Failed to delete comment. Please try again.');
    }
  };

  const renderPosts = () => {
    if (isLoading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!posts.length) return <div className="no-posts">No help posts available</div>;

    return (
      <div className="posts-list">
        {posts.map(post => (
          <div key={post._id} className="post-item">
            <p><strong>Description:</strong> {post.description}</p>
            {post.bloodDonation && <p className="blood-donation"><strong>Blood Donation Needed</strong></p>}
            <p><strong>Posted by:</strong> {post.user.name}</p>
            <p><strong>Flat Number:</strong> {post.user.flatno}</p>
            <p><strong>Contact Number:</strong> {post.user.contactno}</p>
            {user.id === post.user._id && !post.resolve_status && (
              <div className="post-actions">
                <button 
                  onClick={() => handleUpdatePost(post._id, prompt('Update description:', post.description))}
                  className="update-btn"
                >
                  Update
                </button>
                <button 
                  onClick={() => handleDeletePost(post._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
                <button 
                  onClick={() => handleResolvePost(post._id)}
                  className="resolve-btn"
                >
                  Resolve
                </button>
              </div>
            )}
            <div className="comments-section">
              <h4>Comments</h4>
              {post.comments.map(comment => (
                <div key={comment._id} className="comment-item">
                  <p>{comment.content}</p>
                  <p><strong>By:</strong> {comment.user.name}</p>
                  {user.id === comment.user._id && (
                    <div className="comment-actions">
                      <button 
                        onClick={() => handleUpdateComment(post._id, comment._id, prompt('Update comment:', comment.content))}
                        className="update-btn"
                      >
                        Update
                      </button>
                      <button 
                        onClick={() => handleDeleteComment(post._id, comment._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <textarea 
                placeholder="Add a comment"
                onBlur={(e) => {
                  handleAddComment(post._id, e.target.value);
                  e.target.value = '';
                }}
                className="comment-input"
              ></textarea>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <h2>HelpWall</h2>
        <div className="create-post-form">
          <h3>Create a Help Post</h3>
          <label>
            Description:
            <textarea 
              value={helpDescr} 
              onChange={(e) => setHelpDescr(e.target.value)}
              placeholder="Enter your help request description"
            ></textarea>
          </label>
          <label>
            Blood Donation Needed:
            <input 
              type="checkbox" 
              checked={bloodDonation} 
              onChange={(e) => setBloodDonation(e.target.checked)} 
            />
          </label>
          <button 
            onClick={handleCreatePost}
            disabled={!helpDescr.trim()}
            className="create-btn"
          >
            Create Post
          </button>
        </div>
        {renderPosts()}
      </div>
    </div>
  );
};

export default HelpWall;