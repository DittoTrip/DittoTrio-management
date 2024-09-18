// App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MemberManagement from "./pages/MemberManagement";
import CategoryManagement from "./pages/CategoryManagement";
import SpotManagement from "./pages/SpotManagement";
import ReportManagement from "./pages/ReportManagement";
import SpotRequestManagement from "./pages/SpotRequestManagement";
import styled from "styled-components";
import Sidebar from "./components/SlideBar";

const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const Content = styled.div`
  flex: 1;
  padding: 20px 50px;
  margin: 0 auto;
`;

const App: React.FC = () => {
  return (
    <Router>
      <Container>
        <Sidebar />
        <Content>
          <Routes>
            <Route path="/members" element={<MemberManagement />} />
            <Route path="/categories" element={<CategoryManagement />} />
            <Route path="/spots" element={<SpotManagement />} />
            <Route path="/reports" element={<ReportManagement />} />
            <Route path="/spot-requests" element={<SpotRequestManagement />} />
          </Routes>
        </Content>
      </Container>
    </Router>
  );
};

export default App;
