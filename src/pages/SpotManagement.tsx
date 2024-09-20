// pages/SpotManagement.tsx
import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import axios from "axios";
import styled from "styled-components";
import { gray20, gray40, gray60 } from "../style/color";
import TagInput from "../components/TagInput"; // 해시태그 컴포넌트
import CategorySearch, { Category } from "../components/CategorySearch";

interface Spot {
  spotApplyId: number;
  spotId: number;
  name: string;
  address: string;
}

const Table = styled.table`
  flex: 1;
  width: 1000px;
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

const Input = styled.input`
  padding: 8px;
  margin-bottom: 10px;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const SpotManagement: React.FC = () => {
  const token = localStorage.getItem("token");

  const [spots, setSpots] = useState<Spot[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(2);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [tags, setTags] = useState<string[]>([]);
  const [spotInfo, setSpotInfo] = useState({
    name: "",
    address: "",
    pointX: 0,
    pointY: 0,
    image: null as File | null,
    images: [] as File[],
  });

  useEffect(() => {
    fetchSpots(currentPage);
  }, [currentPage]);

  const fetchSpots = async (page: number) => {
    const response = await axios.get(
      `https://dittotrip.site/spot/list/search?page=${page}&query=&size=10`
    );
    setSpots(response.data.spotDataList);
    setTotalPages(response.data.totalPages);
  };

  const handleDeleteSpot = async (spotId: number) => {
    const response = await axios.delete(`/${spotId}`);
    if (response.status == 200) {
      alert("삭제되었습니다.");
    }
    fetchSpots(currentPage);
  };

  const handleAddTag = (newTag: string) => {
    setTags([...tags, newTag]);
  };

  const handleDeleteTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleAddSpot = async () => {
    const formData = new FormData();

    const selectedCategoryIds = categories.map(
      (category) => category.categoryId
    );

    formData.append(
      "saveReq",
      new Blob(
        [
          JSON.stringify({
            name: spotInfo.name,
            address: spotInfo.address,
            pointX: spotInfo.pointX,
            pointY: spotInfo.pointY,
            categoryIds: selectedCategoryIds,
            hashtagNames: tags,
          }),
        ],
        { type: "application/json" }
      )
    );

    // 대표 이미지 및 스틸컷 이미지 추가
    if (spotInfo.image) formData.append("image", spotInfo.image);
    spotInfo.images.forEach((img) => formData.append("images", img));

    try {
      await axios.post("https://dittotrip.site/spot/apply", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${token}`,
        },
      });
      setIsAddModalOpen(false);
      fetchSpots(currentPage);
    } catch (error) {
      console.error("스팟 추가 실패", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSpotInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (e.target.name === "image") {
        // 대표 이미지
        setSpotInfo((prev) => ({ ...prev, image: files[0] }));
      } else {
        // 스틸컷 이미지들
        setSpotInfo((prev) => ({ ...prev, images: files }));
      }
    }
  };

  return (
    <div>
      <h2>스팟 관리</h2>
      <Button onClick={() => setIsAddModalOpen(true)}>추가</Button>
      <Table>
        <Thead>
          <tr>
            <Th>ID</Th>
            <Th>이름</Th>
            <Th>위치</Th>
            <Th>관리</Th>
          </tr>
        </Thead>
        <tbody>
          {spots.map((spot) => (
            <tr key={spot.spotId}>
              <Td>{spot.spotId}</Td>
              <Td>{spot.name}</Td>
              <Td>{spot.address}</Td>
              <Td>
                <Button onClick={() => handleDeleteSpot(spot.spotApplyId)}>
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

      {isAddModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <h2>스팟 추가</h2>
            <Input
              type="text"
              name="name"
              placeholder="이름"
              value={spotInfo.name}
              onChange={handleInputChange}
            />
            <Input
              type="text"
              name="address"
              placeholder="주소"
              value={spotInfo.address}
              onChange={handleInputChange}
            />
            <Input
              type="number"
              name="pointX"
              placeholder="X 좌표"
              value={spotInfo.pointX}
              onChange={handleInputChange}
            />
            <Input
              type="number"
              name="pointY"
              placeholder="Y 좌표"
              value={spotInfo.pointY}
              onChange={handleInputChange}
            />

            <CategorySearch
              selectedCategory={categories}
              setSelectedCategory={setCategories}
            />
            <TagInput
              tags={tags}
              handleAddTag={handleAddTag}
              handleDeleteTag={handleDeleteTag}
            />

            <label>대표 이미지</label>
            <Input type="file" name="image" onChange={handleFileChange} />

            <label>스틸컷 이미지</label>
            <Input
              type="file"
              name="images"
              multiple
              onChange={handleFileChange}
            />

            <Button onClick={handleAddSpot}>추가</Button>
            <Button onClick={() => setIsAddModalOpen(false)}>취소</Button>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
};

export default SpotManagement;
