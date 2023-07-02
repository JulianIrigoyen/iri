import React from 'react';
import styled from 'styled-components';

const BlogPostContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const Body = styled.p`
  text-align: justify;
  line-height: 1.5;
`;

const DeleteButton = styled.button`
  background-color: #ff0000;
  color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  margin-top: 0.5rem;
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
