import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Post.css";

export default function Post() {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({}); // per post comments

  // Get email from localStorage
  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/posts");
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePost = async () => {
    if (!email) return alert("Email is required. Please login.");
    if (!caption && !image) return alert("Please add a caption or image.");

    const formData = new FormData();
    formData.append("email", email); // store email in DB
    formData.append("caption", caption);
    if (image) formData.append("image", image);

    try {
      await axios.post("http://localhost:5000/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Reset input fields
      setCaption("");
      setImage(null);

      // Refresh posts without leaving page
      fetchPosts();

      // Optional: Scroll to top of posts
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (id) => {
    try {
      await axios.put(`http://localhost:5000/posts/${id}/like`);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (id) => {
    if (!commentText[id]) return;
    try {
      await axios.put(`http://localhost:5000/posts/${id}/comment`, {
        comment: commentText[id],
      });
      setCommentText((prev) => ({ ...prev, [id]: "" }));
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="post-page">
      <h2>Create a Post</h2>
      <div className="create-post">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <button onClick={handlePost}>Post</button>
      </div>

      {/* <h2>Posts</h2>
      {posts.map((post) => (
        <div key={post._id} className="post-card">
          <p><strong>{post.email}</strong></p>

          {post.image?.data && (
            <img
              src={`data:${post.image.contentType};base64,${post.image.data}`}
              alt="Post"
              style={{ maxWidth: "300px" }}
            />
          )}

          <p>{post.caption}</p>
          <p>Likes: {post.likes}</p>
          <button onClick={() => handleLike(post._id)}>Like 👍</button>

          <div className="comments">
            <p>Comments:</p>
            {post.comments.length > 0 ? (
              post.comments.map((c, i) => (
                <p key={i}>
                  {typeof c === "string" ? (
                    c
                  ) : (
                    <>
                      <strong>{c.email}:</strong> {c.text}
                    </>
                  )}
                </p>
              ))
            ) : (
              <p>No comments</p>
            )}

            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText[post._id] || ""}
              onChange={(e) =>
                setCommentText((prev) => ({
                  ...prev,
                  [post._id]: e.target.value,
                }))
              }
            />
            <button onClick={() => handleComment(post._id)}>Comment</button>
          </div>
        </div>
      ))} */}
    </div>
  );
}
