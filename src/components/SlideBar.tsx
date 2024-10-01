// components/Sidebar.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { gray20 } from "../style/color";

const SidebarContainer = styled.div`
  width: 250px;
  background-color: ${gray20};
  color: black;
  height: 100%;
  padding: 25px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
`;

const MenuItem = styled.li<{ active: boolean }>`
  margin-bottom: 10px;

  a {
    text-decoration: none;
    color: black;
    font-weight: ${(props) =>
      props.active ? "bold" : "normal"}; /* 선택된 메뉴는 진하게 표시 */
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <SidebarContainer>
      <Title>관리자 메뉴</Title>
      <MenuList>
        <MenuItem active={location.pathname === "/login"}>
          <Link to="/login">로그인</Link>
        </MenuItem>
        <MenuItem active={location.pathname === "/members"}>
          <Link to="/members">회원 관리</Link>
        </MenuItem>
        <MenuItem active={location.pathname === "/categories"}>
          <Link to="/categories">카테고리 관리</Link>
        </MenuItem>
        <MenuItem active={location.pathname === "/spots"}>
          <Link to="/spots">스팟 관리</Link>
        </MenuItem>
        <MenuItem active={location.pathname === "/reports"}>
          <Link to="/reports">신고 관리</Link>
        </MenuItem>
        <MenuItem active={location.pathname === "/spot-requests"}>
          <Link to="/spot-requests">스팟 신청 관리</Link>
        </MenuItem>
        <MenuItem active={location.pathname === "/quest"}>
          <Link to="/quest">퀘스트 관리</Link>
        </MenuItem>
      </MenuList>
    </SidebarContainer>
  );
};

export default Sidebar;
