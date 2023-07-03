import React, { useState } from 'react';
import styled from 'styled-components';
import { FaTrash, FaThumbsUp, FaRegCommentAlt } from 'react-icons/fa';

const BlogPostContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  width: 100%;
  border-radius: 10px;
  box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
  transition: transform var(--transition-speed);
  position: relative;

  &:hover {
    transform: translateY(-10px);
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
`;

const Body = styled.p`
  text-align: justify;
  line-height: 1.5;
`;

const IconButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: grey;
  margin: 0.5rem;

  &:hover {
    color: #ff0000;
  }
`;

const CommentInput = styled.input`
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.5rem;
  margin: 0.5rem;
  width: 100%;
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const BlogPost = ({ post, onDelete }) => {
  const [comment, setComment] = useState('');

  const handleDelete = () => {
    onDelete(post.id);
  };

  const handleLike = () => {
    console.log('Post liked');
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = () => {
    console.log('Comment:', comment);
    setComment('');
  };

  return (
    <BlogPostContainer>
      <Title>{post.title}</Title>
      <Body>{post.body}</Body>
      <ActionsContainer>
        <CommentInput
          type="text"
          value={comment}
          onChange={handleCommentChange}
          placeholder="Add a comment"
        />
        <div>
          <IconButton onClick={handleCommentSubmit}>
            <FaRegCommentAlt size={28} />
          </IconButton>
          <IconButton onClick={handleDelete}>
            <FaTrash size={28} />
          </IconButton>
        </div>
      </ActionsContainer>
    </BlogPostContainer>
  );
};

export default BlogPost;
