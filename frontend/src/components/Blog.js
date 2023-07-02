import React, {useState, useEffect} from 'react';
import BlogPost from './BlogPost';

const Blog = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('/blog-posts')  // adjust the URL according to your Flask API
            .then(response => response.json())
            .then(data => setPosts(data))
            .catch(error => console.error('Error:', error));
    }, []);

    const handleDelete = (postId) => {
        fetch(`/${postId}/delete-post`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(() => {
                const newPosts = posts.filter(post => post.id !== postId);
                setPosts(newPosts);

            })
            .catch(error => console.error('Error:', error));
    };

    return (
        <div>
            {posts.map((post) => (
                <BlogPost key={post.id} post={post} onDelete={handleDelete}/>
            ))}
        </div>
    );
};

export default Blog;
