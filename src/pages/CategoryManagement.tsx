// pages/CategoryManagement.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import TagInput from "../components/TagInput";
import SpotSearch, { SpotData } from "../components/SpotSearch";
import { gray20, gray40, gray60 } from "../style/color";
import Pagination from "../components/Pagination";
import formatDate from "../utils/formatDate";

// 카테고리 인터페이스 정의
export interface Category {
  categoryId: number;
  name: string;
  majorType: MajorType;
  subType: SubType;
  categorySpotCount: number;
  createdDateTime: Date;
}

export type SubType =
  | "PERSON_ACTOR"
  | "PERSON_SINGER"
  | "PERSON_COMEDIAN"
  | "CONTENT_MOVIE"
  | "CONTENT_DRAMA"
  | "CONTENT_ENTERTAINMENT";

export type MajorType = "CONTENT" | "PERSON";

// subType과 한글 명칭을 매핑하는 객체
const subTypeKoreanMap: { [key in SubType]: string } = {
  PERSON_ACTOR: "배우",
  PERSON_SINGER: "가수",
  PERSON_COMEDIAN: "코미디언",
  CONTENT_MOVIE: "영화",
  CONTENT_DRAMA: "드라마",
  CONTENT_ENTERTAINMENT: "예능",
};

// subType을 한글로 변환하는 함수
const getKoreanSubType = (subType: SubType) => {
  return subTypeKoreanMap[subType] || subType; // 매핑된 값이 없으면 원래 값 반환
};

// Styled components
const Table = styled.table`
  flex: 1;
  width: 75vw;
  border-collapse: separate;
  border-spacing: 0;
  margin-bottom: 20px;
`;

const Thead = styled.thead`
  background-color: #f2f2f2;
  border-radius: 10px;
`;

const Th = styled.th`
  padding: 8px;
  text-align: left;
  &:first-child {
    border-top-left-radius: 10px;
  }
  &:last-child {
    border-top-right-radius: 10px;
  }
`;

const Td = styled.td`
  padding: 8px;
`;

const Input = styled.input`
  padding: 8px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 5px 10px;
  background-color: ${gray20};
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 4px;

  &:hover {
    background-color: ${gray40};
  }

  &:disabled {
    background-color: ${gray60};
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: 8px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 100%;
`;

const ModalTitle = styled.h2`
  margin-bottom: 10px;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  const [categoryModifyReq, setCategoryModifyReq] = useState({
    name: "",
    categoryMajorType: "PERSON" as MajorType,
    categorySubType: "PERSON_SINGER" as SubType,
    hashtagNames: [""],
    spotIds: [0],
  });

  const [tags, setTags] = useState<string[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<SpotData[]>([]);
  const [categoryImage, setCategoryImage] = useState<File | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const token = localStorage.getItem("token");

  const handleAddTag = (newTag: string) => {
    setTags([...tags, newTag]);
  };

  const handleDeleteTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  useEffect(() => {
    fetchCategories(currentPage);
  }, [currentPage]);

  const fetchCategories = async (page: number) => {
    const response = await axios.get(
      `https://dittotrip.site/category/list/admin?query=&page=${page}&size=10`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    setCategories(response.data.categoryForAdminDataList);
    setTotalPages(response.data.totalPages);
  };

  return (
    <div style={{ width: "100%" }}>
      <h2>카테고리 관리</h2>

      <Button onClick={() => setIsAddModalOpen(true)}>추가</Button>

      <Table>
        <Thead>
          <tr>
            <Th>ID</Th>
            <Th>이름</Th>
            <Th>분류</Th>
            <Th>스팟 개수</Th>
            <Th>등록일자</Th>
            <Th>비고</Th>
          </tr>
        </Thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.categoryId}>
              <Td>{category.categoryId}</Td>
              <Td>{category.name}</Td>
              {/* subType을 한글로 변환하여 출력 */}
              <Td>{getKoreanSubType(category.subType)}</Td>
              <Td>{category.categorySpotCount}</Td>
              <Td>{formatDate(category.createdDateTime)}</Td>
              <Td>
                <Button onClick={() => console.log("수정")}>수정</Button>
                <Button onClick={() => console.log("삭제")}>삭제</Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* 기타 모달 내용 생략 */}
    </div>
  );
};

export default CategoryManagement;
