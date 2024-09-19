// pages/CategoryManagement.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import TagInput from "../components/TagInput";
import SpotSearch, { SpotData } from "../components/SpotSearch";
import { gray20, gray40, gray60 } from "../style/color";
import Pagination from "../components/Pagination";

export interface Category {
  categoryId: number;
  name: string;
  imageFilePath: string | null;
  myBookmarkId: number | null;
  hashtags: string[];
  spotList: SpotData[];
  totalPages: number;
}

export type SubType =
  | "PERSON_ACTOR"
  | "PERSON_SINGER"
  | "PERSON_COMEDIAN"
  | "CONTENT_MOVIE"
  | "CONTENT_DRAMA"
  | "CONTENT_ENTERTAINMENT";

export type MajorType = "CONTENT" | "PERSON";

const Table = styled.table`
  flex: 1;
  width: 1000px;

  border-collapse: separate;
  border-spacing: 0;
  margin-bottom: 20px;
`;

const Thead = styled.thead`
  background-color: #f2f2f2;
  border-radius: 10px; /* Rounded corners */
`;

const Th = styled.th`
  padding: 8px;
  text-align: left;
  &:first-child {
    border-top-left-radius: 10px; /* Left top corner */
  }
  &:last-child {
    border-top-right-radius: 10px; /* Right top corner */
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

  .sub-title {
    display: inline-block;
    width: 80px;
    font-weight: bold;
  }
  .select-box {
    margin-bottom: 10px;
  }
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
  const [newCategory, setNewCategory] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [categoryModifyReq, setCategoryModifyReq] = useState({
    name: "",
    categoryMajorType: "PERSON" as MajorType,
    categorySubType: "PERSON_SINGER" as SubType,
    hashtagNames: [""],
    spotIds: [0],
  });

  const [selectedSpot, setSelectedSpot] = useState<SpotData[]>([]);

  // 태그
  const [tags, setTags] = useState<string[]>([]);

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
      `http://dittotrip.site/category/list/search/typeless?query=&page=${page}&size=10`,
      {
        headers: {
          Authorization: `${token}`, // Add the Authorization header
        },
      }
    );
    setCategories(response.data.categoryDataList);
    setTotalPages(response.data.totalPages);
  };

  const handleAddCategory = async () => {
    await axios.post("/api/categories", { name: newCategory });
    setNewCategory("");
    fetchCategories(currentPage);
  };

  const handleDeleteCategory = async (categoryId: number) => {
    await axios.delete(`http://dittotrip.site/category/${categoryId}`, {
      headers: {
        Authorization: `${token}`, // Add the Authorization header
      },
    });
    setIsDeleteModalOpen(false);
    fetchCategories(currentPage);
  };

  const handleEditCategory = async () => {
    if (selectedCategory) {
      await axios.put(`/api/categories/${selectedCategory.categoryId}`, {
        categoryModifyReq,
        image: "string", // 기본 이미지 URL (수정할 경우 실제 이미지를 넣을 수 있음)
      });
      setIsEditModalOpen(false);
      setCurrentPage(0);
      fetchCategories(0);
    }
  };

  const openDeleteModal = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setCategoryModifyReq({
      name: category.name,
      categoryMajorType: "PERSON",
      categorySubType: "PERSON_SINGER",
      hashtagNames: category.hashtags,
      spotIds: [0], // 필요한 경우 스팟 ID 리스트를 변경
    });
    setIsEditModalOpen(true);
  };

  return (
    <div style={{ width: "100%" }}>
      <h2>카테고리 관리</h2>

      <Button onClick={handleAddCategory}>추가</Button>

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
              <Td>{/* 분류 표시 */}</Td>
              <Td>{/* 스팟 개수 */}</Td>
              <Td>{/* 등록일자 */}</Td>
              <Td>
                <Button onClick={() => openEditModal(category)}>수정</Button>
                <Button onClick={() => openDeleteModal(category)}>삭제</Button>
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

      {/* 삭제 확인 모달 */}
      {isDeleteModalOpen && selectedCategory && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>카테고리 삭제</ModalTitle>
            <p>정말로 "{selectedCategory.name}" 카테고리를 삭제하시겠습니까?</p>
            <ModalActions>
              <Button onClick={() => setIsDeleteModalOpen(false)}>취소</Button>
              <Button
                onClick={() =>
                  handleDeleteCategory(selectedCategory.categoryId)
                }
              >
                삭제
              </Button>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* 수정 모달 */}
      {isEditModalOpen && selectedCategory && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>카테고리 수정</ModalTitle>
            <div className="select-box">
              <label>
                <div className="sub-title">{"이름 "}</div>
                <Input
                  type="text"
                  value={categoryModifyReq.name}
                  onChange={(e) =>
                    setCategoryModifyReq({
                      ...categoryModifyReq,
                      name: e.target.value,
                    })
                  }
                />
              </label>
            </div>
            <div className="select-box">
              <label>
                <div className="sub-title">{"주요 분류"}</div>
                <Select
                  value={categoryModifyReq.categoryMajorType}
                  onChange={(e) =>
                    setCategoryModifyReq({
                      ...categoryModifyReq,
                      categoryMajorType: e.target.value as MajorType,
                    })
                  }
                >
                  <option value="PERSON">PERSON</option>
                  <option value="CONTENT">CONTENT</option>
                </Select>
              </label>
            </div>
            <div className="select-box">
              <label>
                <div className="sub-title">서브 분류</div>
                <Select
                  value={categoryModifyReq.categorySubType}
                  onChange={(e) =>
                    setCategoryModifyReq({
                      ...categoryModifyReq,
                      categorySubType: e.target.value as SubType,
                    })
                  }
                >
                  {categoryModifyReq.categoryMajorType === "PERSON" ? (
                    <>
                      <option value="PERSON_ACTOR">PERSON_ACTOR</option>
                      <option value="PERSON_SINGER">PERSON_SINGER</option>
                      <option value="PERSON_COMEDIAN">PERSON_COMEDIAN</option>
                    </>
                  ) : (
                    <>
                      <option value="CONTENT_MOVIE">CONTENT_MOVIE</option>
                      <option value="CONTENT_DRAMA">CONTENT_DRAMA</option>
                      <option value="CONTENT_ENTERTAINMENT">
                        CONTENT_ENTERTAINMENT
                      </option>
                    </>
                  )}
                </Select>
              </label>
            </div>
            <div className="select-box">
              <label>
                <div className="sub-title">해시태그</div>
                <TagInput
                  tags={tags}
                  handleAddTag={handleAddTag}
                  handleDeleteTag={handleDeleteTag}
                />
              </label>
            </div>
            <div className="select-box">
              <label>
                <div className="sub-title">관련 Spot</div>

                <SpotSearch
                  selectedSpot={selectedSpot}
                  setSelectedSpot={setSelectedSpot}
                />
              </label>
            </div>
            <ModalActions>
              <Button onClick={() => setIsEditModalOpen(false)}>취소</Button>
              <Button onClick={handleEditCategory}>수정</Button>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
};

export default CategoryManagement;
