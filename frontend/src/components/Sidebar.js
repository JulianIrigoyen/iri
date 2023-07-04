import React, { useState } from 'react';
import styled from 'styled-components';

const SidebarWrapper = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  height: 100%;
  width: ${props => props.isOpen ? '250px' : '0'};
  transition: 0.5s;
  z-index: 999;
  background-color: #333;
  color: #fff;
  padding: 20px;
  overflow-x: hidden;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: #fff;
  font-size: 30px;
`;

const SidebarContent = styled.div`
  margin-top: 60px;
`;

const Sidebar = ({isOpen, toggleSidebar}) => {

  return (
    <div style={{width: isOpen ? 250 : 0, backgroundColor: '#333', color: '#fff', position: 'fixed', height: '100vh', transition: '0.3s', overflowX: 'hidden', paddingTop: '20px', right: '0', top: '0'}}>
      <button onClick={toggleSidebar} style={{position: 'absolute', top: '20px', right: '20px', background: 'none', fontSize: '30px', color: '#fff', border: 'none'}}>&times;</button>
      <div style={{marginTop: '60px'}}>
        <h1>Hello Sidebar</h1>
        <p>Welcome to my sidebar. Click 'x' to close.</p>
      </div>
    </div>
  );
};

export default Sidebar;
