// components/Pagination.tsx
import React from "react";
import styled from "styled-components";
import { gray20, gray40, gray60 } from "../style/color";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 20px 0;
`;

const Button = styled.button<{ disabled?: boolean }>`
  padding: 10px;
  margin: 0 5px;
  background-color: ${(props) => (props.disabled ? { gray20 } : { gray40 })};
  color: black;
  border: none;
  border-radius: 5px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:hover {
    background-color: ${(props) => (props.disabled ? { gray40 } : { gray60 })};
  }
`;

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const actualPage = currentPage + 1;
  const handlePrev = () => {
    if (actualPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (actualPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <PaginationContainer>
      <Button onClick={handlePrev} disabled={actualPage === 1}>
        이전
      </Button>
      <span>
        {actualPage} / {totalPages}
      </span>
      <Button onClick={handleNext} disabled={actualPage === totalPages}>
        다음
      </Button>
    </PaginationContainer>
  );
};

export default Pagination;
