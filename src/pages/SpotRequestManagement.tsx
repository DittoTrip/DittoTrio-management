import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import axios from "axios";
import styled from "styled-components";
import { gray20, gray40, gray60 } from "../style/color";

interface SpotRequest {
  spotApplyId: number;
  name: string;
  address: string;
  createdDateTime: string;
  spotApplyStatus: string;
  pointX: number;
  pointY: number;
  imagePaths: string[];
  categoryDataList: { categoryId: number; name: string }[];
  hashtags: string[];
}

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
  width: 500px;
  max-width: 100%;
`;

const SpotRequestManagement: React.FC = () => {
  const [spotRequests, setSpotRequests] = useState<SpotRequest[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [selectedSpot, setSelectedSpot] = useState<SpotRequest | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSpotRequests(currentPage);
  }, [currentPage]);

  const fetchSpotRequests = async (page: number) => {
    const response = await axios.get(
      `https://dittotrip.site/spot/apply/list?page=${page}`
    );
    console.log(response);
    setSpotRequests(response.data.spotApplyDataList);
    setTotalPages(response.data.totalPages);
  };

  const handleRemoveApply = async (spotApplyId: number) => {
    const response = await axios.delete(
      `https://dittotrip.site/spot/apply/${spotApplyId}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    console.log(response);

    fetchSpotRequests(currentPage);
  };

  const handleApproveSpot = async (spotApplyId: number) => {
    handleRemoveApply(spotApplyId);

    const response = await axios.post(
      `https://dittotrip.site/spot/apply/${spotApplyId}/handle?isApproval=true`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    if (response.status == 200) {
      alert("승인되었습니다.");
      handleRemoveApply(spotApplyId);
    }
  };

  const handleRejectSpot = async (spotApplyId: number) => {
    const response = await axios.post(
      `https://dittotrip.site/spot/apply/${spotApplyId}/handle?isApproval=false`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    if (response.status == 200) {
      alert("거절되었습니다.");
      handleRemoveApply(spotApplyId);
    }
  };

  const handleOpenModal = (spotRequest: SpotRequest) => {
    setSelectedSpot(spotRequest);
  };

  const handleCloseModal = () => {
    setSelectedSpot(null);
  };

  return (
    <div>
      <h2>스팟 신청 관리</h2>
      <Table>
        <Thead>
          <tr>
            <Th>신청자</Th>
            <Th>날짜</Th>
            <Th>이름</Th>
            <Th>주소</Th>
            <Th>관리</Th>
          </tr>
        </Thead>
        <tbody>
          {spotRequests.map((spot) => (
            <tr key={spot.spotApplyId}>
              <Td>{spot.spotApplyId}</Td>
              <Td>{new Date(spot.createdDateTime).toLocaleDateString()}</Td>
              <Td>{spot.name}</Td>
              <Td>{spot.address}</Td>
              <Td>
                <Button
                  color="#28a745"
                  onClick={() => handleApproveSpot(spot.spotApplyId)}
                >
                  승인
                </Button>
                <Button
                  color="#dc3545"
                  onClick={() => handleRejectSpot(spot.spotApplyId)}
                >
                  거절
                </Button>
                <Button color="#007bff" onClick={() => handleOpenModal(spot)}>
                  자세히 보기
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

      {selectedSpot && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h2>{selectedSpot.name}</h2>
            <p>
              <strong>주소:</strong> {selectedSpot.address}
            </p>
            <p>
              <strong>카테고리:</strong>
            </p>
            <ul>
              {selectedSpot.categoryDataList.map((category) => (
                <li key={category.categoryId}>{category.name}</li>
              ))}
            </ul>
            <p>
              <strong>해시태그:</strong> {selectedSpot.hashtags.join(", ")}
            </p>
            <p>
              <strong>좌표:</strong> X: {selectedSpot.pointX}, Y:{" "}
              {selectedSpot.pointY}
            </p>
            {selectedSpot.imagePaths.length > 0 && (
              <div>
                <strong>이미지:</strong>
                {selectedSpot.imagePaths.map((imagePath, index) => (
                  <img
                    key={index}
                    src={imagePath}
                    alt="Spot"
                    style={{ width: "100px", marginRight: "10px" }}
                  />
                ))}
              </div>
            )}
            <Button onClick={handleCloseModal}>닫기</Button>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
};

export default SpotRequestManagement;
