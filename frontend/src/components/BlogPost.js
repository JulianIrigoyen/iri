import React from 'react';
import styled from 'styled-components';

const BlogPostContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  width: 100%;
  border-radius: 10px;
  box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
  transition: transform var(--transition-speed);

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

const DeleteButton = styled.button`
  background-color: var(--color-btn);
  color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  border-radius: 5px;
  transition: background-color var(--transition-speed);

  &:hover {
    background-color: darken(var(--color-btn), 10%);
  }
`;

const BlogPost = ({ post, onDelete }) => {
  const handleDelete = () => {
    onDelete(post.id);
  };

  return (
    <BlogPostContainer>
      <Title>{post.title}</Title>
      <Body>{post.body}</Body>
      <DeleteButton onClick={handleDelete}>Delete</DeleteButton>
    </BlogPostContainer>
  );
};

export default BlogPost;
