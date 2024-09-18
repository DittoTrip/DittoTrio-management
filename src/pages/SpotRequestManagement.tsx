// pages/SpotRequestManagement.tsx
import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import axios from "axios";
import styled from "styled-components";

interface SpotRequest {
  id: number;
  name: string;
  location: string;
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

  return (
    <div>
      <h1>스팟 신청 관리</h1>
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
    </div>
  );
};

export default SpotRequestManagement;
