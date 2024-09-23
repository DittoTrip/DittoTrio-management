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

const subTypeKoreanMap: { [key in SubType]: string } = {
  PERSON_ACTOR: "배우",
  PERSON_SINGER: "가수",
  PERSON_COMEDIAN: "코미디언",
  CONTENT_MOVIE: "영화",
  CONTENT_DRAMA: "드라마",
  CONTENT_ENTERTAINMENT: "예능",
};
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

const AddButton = styled.button`
  padding: 5px 10px;
  background-color: ${gray40};
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 4px;
  margin-bottom: 10px;

  &:hover {
    background-color: ${gray60};
  }

  &:disabled {
    background-color: ${gray60};
    cursor: not-allowed;
  }
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

  // 카테고리 추가 핸들러
  const handleAddCategory = async () => {
    const formData = new FormData();

    formData.append(
      "saveReq",
      new Blob(
        [
          JSON.stringify({
            name: categoryModifyReq.name,
            categoryMajorType: categoryModifyReq.categoryMajorType,
            categorySubType: categoryModifyReq.categorySubType,
            hashtagNames: tags,
            spotIds: selectedSpot.map((spot) => spot.spotId),
          }),
        ],
        { type: "application/json" }
      )
    );

    if (categoryImage) {
      formData.append("image", categoryImage);
    }

    try {
      await axios.post("https://dittotrip.site/category", formData, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setTags([]);
      setSelectedSpot([]);
      setCategoryImage(null);
      setIsAddModalOpen(false);
      fetchCategories(currentPage);
      alert("카테고리가 추가되었습니다.");
    } catch (error) {
      console.error("카테고리 추가 실패", error);
    }
  };

  // 이미지 업로드 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCategoryImage(e.target.files[0]);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    const res = await axios.delete(
      `https://dittotrip.site/category/${categoryId}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    if (res.status == 200) {
      alert("삭제되었습니다.");
    }
    setIsDeleteModalOpen(false);
    fetchCategories(currentPage);
  };

  const handleEditCategory = async () => {
    if (selectedCategory) {
      const formData = new FormData();

      formData.append(
        "categoryModifyReq",
        new Blob(
          [
            JSON.stringify({
              name: categoryModifyReq.name,
              categoryMajorType: categoryModifyReq.categoryMajorType,
              categorySubType: categoryModifyReq.categorySubType,
              hashtagNames: tags,
              spotIds: selectedSpot.map((spot) => spot.spotId),
            }),
          ],
          { type: "application/json" }
        )
      );

      if (categoryImage) {
        formData.append("image", categoryImage);
      }

      await axios.put(
        `/api/categories/${selectedCategory.categoryId}`,
        formData,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setIsEditModalOpen(false);
      fetchCategories(currentPage);
    }
  };

  const openEditModal = (category: Category) => {
    // setSelectedCategory(category);
    // setCategoryModifyReq({
    //   name: category.name,
    //   categoryMajorType: category.majorType,
    //   categorySubType: category.subType,
    //   hashtagNames: category.hashtags,
    //   spotIds: category.spotList.map((spot) => spot.spotId),
    // });
    // setTags(category.hashtags);
    // setSelectedSpot(category.spotList);
    // setIsEditModalOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const getKoreanSubType = (subType: SubType) => {
    return subTypeKoreanMap[subType] || subType; // 매핑된 값이 없으면 원래 값 반환
  };

  return (
    <div style={{ width: "100%" }}>
      <h2>카테고리 관리</h2>

      <AddButton onClick={() => setIsAddModalOpen(true)}>추가</AddButton>

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
              <Td>{getKoreanSubType(category.subType)}</Td>
              <Td>{formatDate(category.createdDateTime)}</Td>
              <Td>{category.categorySpotCount}</Td>
              <Td>
                <Button onClick={() => openEditModal(category)}>수정</Button>
                <Button onClick={() => handleDeleteClick(category)}>
                  삭제
                </Button>
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

      {isDeleteModalOpen && selectedCategory && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>영구정지</ModalTitle>
            <p>
              정말로 "{selectedCategory?.name} "카테고리를 삭제하시겠습니까?
            </p>
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

      {isAddModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>카테고리 추가</ModalTitle>
            <div className="select-box">
              <label>
                <div className="sub-title">이름</div>
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
                <div className="sub-title">주요 분류</div>
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
            <div className="select-box">
              <label>
                <div className="sub-title">이미지 업로드</div>
                <Input type="file" onChange={handleFileChange} />
              </label>
            </div>
            <ModalActions>
              <Button onClick={() => handleAddCategory()}>추가</Button>
              <Button onClick={() => setIsAddModalOpen(false)}>취소</Button>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}

      {isEditModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>카테고리 수정</ModalTitle>
            <div className="select-box">
              <label>
                <div className="sub-title">이름</div>
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
                <div className="sub-title">주요 분류</div>
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
            <div className="select-box">
              <label>
                <div className="sub-title">이미지 업로드</div>
                <Input type="file" onChange={handleFileChange} />
              </label>
            </div>
            <ModalActions>
              <Button onClick={handleEditCategory}>수정</Button>
              <Button onClick={() => setIsEditModalOpen(false)}>취소</Button>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
};

export default CategoryManagement;
