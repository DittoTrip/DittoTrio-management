import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import axios from "axios";
import styled from "styled-components";
import { gray20, gray40, gray60 } from "../style/color";

interface Spot {
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

const SpotManagement: React.FC = () => {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(2);

  useEffect(() => {
    fetchSpots(currentPage);
  }, [currentPage]);

  const fetchSpots = async (page: number) => {
    console.log(page);
    const response = await axios.get(
      `http://dittotrip.site/spot/list/search?page=${page}&query=&size=10`
    );
    console.log(response.data.spotDataList);
    setSpots(response.data.spotDataList);
    setTotalPages(response.data.totalPages);
  };

  const handleDeleteSpot = async (spotId: number) => {
    await axios.delete(`/api/spots/${spotId}`);
    fetchSpots(currentPage);
  };

  return (
    <div>
      <h2>스팟 관리</h2>
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
                <Button onClick={() => handleDeleteSpot(spot.spotId)}>
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
    </div>
  );
};

export default SpotManagement;
