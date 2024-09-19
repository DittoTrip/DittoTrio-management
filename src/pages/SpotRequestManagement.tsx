import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import axios from "axios";
import styled from "styled-components";

interface SpotRequest {
  id: number;
  name: string;
  location: string;
}

interface CategoryRequest {
  name: string;
  categoryMajorType: string;
  categorySubType: string;
  hashtagNames: string[];
  spotIds: number[];
  image: File | null;
}

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;

  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
  }

  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }
`;

const Button = styled.button`
  padding: 5px 10px;
  background-color: ${(props) => props.color || "#007bff"};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 5px;
`;

const SpotRequestManagement: React.FC = () => {
  const [spotRequests, setSpotRequests] = useState<SpotRequest[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [categoryData, setCategoryData] = useState<CategoryRequest>({
    name: "",
    categoryMajorType: "PERSON",
    categorySubType: "PERSON_SINGER",
    hashtagNames: [],
    spotIds: [],
    image: null,
  });

  useEffect(() => {
    fetchSpotRequests(currentPage);
  }, [currentPage]);

  const fetchSpotRequests = async (page: number) => {
    const response = await axios.get(`/api/spot-requests?page=${page}`);
    setSpotRequests(response.data.spotRequests);
    setTotalPages(response.data.totalPages);
  };

  const handleApproveSpot = async (spotRequestId: number) => {
    await axios.post(`/api/spot-requests/${spotRequestId}/approve`);
    fetchSpotRequests(currentPage);
  };

  const handleRejectSpot = async (spotRequestId: number) => {
    await axios.post(`/api/spot-requests/${spotRequestId}/reject`);
    fetchSpotRequests(currentPage);
  };

  const handleAddCategory = async () => {
    const formData = new FormData();
    formData.append(
      "categorySaveReq",
      new Blob([JSON.stringify(categoryData)], {
        type: "application/json",
      })
    );

    if (categoryData.image) {
      formData.append("image", categoryData.image);
    }

    try {
      await axios.post("/category", formData);
      // Handle success: refresh category list or display a success message
    } catch (error) {
      console.error("카테고리 추가 실패", error);
    }
  };

  const handleEditCategory = async (categoryId: number) => {
    const formData = new FormData();
    formData.append(
      "categoryModifyReq",
      new Blob([JSON.stringify(categoryData)], {
        type: "application/json",
      })
    );

    if (categoryData.image) {
      formData.append("image", categoryData.image);
    }

    try {
      await axios.put(`/category/${categoryId}`, formData);
      // Handle success: refresh category list or display a success message
    } catch (error) {
      console.error("카테고리 수정 실패", error);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      await axios.delete(`/category/${categoryId}`);
      // Handle success: refresh category list or display a success message
    } catch (error) {
      console.error("카테고리 삭제 실패", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCategoryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCategoryData((prev) => ({
        ...prev,
        image: e.target.files![0],
      }));
    }
  };

  return (
    <div>
      <h2>스팟 신청 관리</h2>
      <Table>
        <thead>
          <tr>
            <th>신청 ID</th>
            <th>이름</th>
            <th>위치</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {spotRequests.map((spot) => (
            <tr key={spot.id}>
              <td>{spot.id}</td>
              <td>{spot.name}</td>
              <td>{spot.location}</td>
              <td>
                <Button
                  color="#28a745"
                  onClick={() => handleApproveSpot(spot.id)}
                >
                  승인
                </Button>
                <Button
                  color="#dc3545"
                  onClick={() => handleRejectSpot(spot.id)}
                >
                  거절
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Add/Edit Category Form */}
      <div>
        <h3>{categoryData ? "카테고리 수정" : "카테고리 추가"}</h3>
        <input
          type="text"
          name="name"
          value={categoryData.name}
          placeholder="카테고리 이름"
          onChange={handleInputChange}
        />
        <select
          name="categoryMajorType"
          value={categoryData.categoryMajorType}
          onChange={handleInputChange}
        >
          <option value="PERSON">PERSON</option>
          <option value="PLACE">PLACE</option>
        </select>
        <input type="file" name="image" onChange={handleFileChange} />
        <Button
          onClick={() =>
            categoryData
              ? handleEditCategory(1 /* Replace with actual categoryId */)
              : handleAddCategory()
          }
        >
          {categoryData ? "카테고리 수정" : "카테고리 추가"}
        </Button>
        <Button
          color="#dc3545"
          onClick={() =>
            handleDeleteCategory(1 /* Replace with actual categoryId */)
          }
        >
          카테고리 삭제
        </Button>
      </div>
    </div>
  );
};

export default SpotRequestManagement;
