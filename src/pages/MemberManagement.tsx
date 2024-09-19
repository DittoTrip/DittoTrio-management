// pages/MemberManagement.tsx
import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import axios from "axios";
import styled from "styled-components";
import { gray20, gray40, gray60 } from "../style/color";

export interface UserAdminData {
  userDataForAdminList: UserData[];
  totalPages: number;
}

export interface UserData {
  userId: number;
  userStatus: "NORMAL" | "BANNED" | "INACTIVE"; // Adjust other possible statuses if needed
  nickname: string;
  email: string;
  createdDateTime: string;
  progressionBar: number;
  reviewCount: number;
  dittoCount: number;
  userProfileData: UserProfileData;
}

export interface UserProfileData {
  progressionBar: number;
  itemSkin: UserRewardItem;
  itemEyes: UserRewardItem;
  itemMouse: UserRewardItem;
  itemHair: UserRewardItem;
  itemAccessory: UserRewardItem;
  badgeData: BadgeData;
}

export interface UserRewardItem {
  userRewardId: number;
  name: string;
  imagePath: string;
  itemType: "SKIN" | "EYES" | "MOUSE" | "HAIR" | "ACCESSORY"; // Adjust item types if needed
  createdDateTime: string;
}

export interface BadgeData {
  rewardId: number;
  name: string;
  body: string;
  conditionBody: string;
  imagePath: string;
  createdDateTime: string;
  userBadgeId: number;
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

const MemberManagement: React.FC = () => {
  const [members, setMembers] = useState<UserData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [shouldDeleteContent, setShouldDeleteContent] =
    useState<boolean>(false);
  const [shouldPermanentlyBan, setShouldPermanentlyBan] =
    useState<boolean>(false);
  const [suspensionDays, setSuspensionDays] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMembers(currentPage);
  }, [currentPage]);

  const fetchMembers = async (page: number) => {
    const response = await axios.get(
      `http://dittotrip.site/user/list/search/admin?query=&page=${page}&size=10`,
      {
        headers: {
          Authorization: `${token}`, // Add the Authorization header
        },
      }
    );
    setMembers(response.data.userDataForAdminList);
    setTotalPages(response.data.totalPages);
  };

  const handleSuspendClick = (memberId: number) => {
    setSelectedMemberId(memberId);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (selectedMemberId !== null) {
      const data = {
        shouldDeleteContent,
        shouldPermanentlyBan,
        suspensionDays: shouldPermanentlyBan ? 0 : suspensionDays,
      };
      await axios.post(`/api/members/${selectedMemberId}/suspend`, data);
      setIsModalOpen(false);
      fetchMembers(currentPage);
    }
  };

  return (
    <div>
      <h2>회원 관리</h2>
      <Table>
        <Thead>
          <tr>
            <Th>닉네임</Th>
            <Th>계정</Th>
            <Th>가입일자</Th>
            <Th>등급</Th>
            <Th>경험치</Th>
            <Th>비고</Th>
          </tr>
        </Thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.userId}>
              <Td>{member.nickname}</Td>
              <Td>{member.email}</Td>
              <Td>{member.createdDateTime}</Td>
              <Td>{member.progressionBar}</Td>
              <Td>{member.reviewCount / member.dittoCount}</Td>
              <Td>
                {member.userId !== 200 && (
                  <Button onClick={() => handleSuspendClick(member.userId)}>
                    정지
                  </Button>
                )}
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

      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>회원 정지 옵션</ModalTitle>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={shouldDeleteContent}
                  onChange={() => setShouldDeleteContent(!shouldDeleteContent)}
                />
                타겟 컨텐츠 삭제
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={shouldPermanentlyBan}
                  onChange={() =>
                    setShouldPermanentlyBan(!shouldPermanentlyBan)
                  }
                />
                영구 정지
              </label>
            </div>
            {!shouldPermanentlyBan && (
              <div>
                <label>
                  일시 정지 기간(일):{" "}
                  <input
                    type="number"
                    value={suspensionDays}
                    onChange={(e) =>
                      setSuspensionDays(parseInt(e.target.value))
                    }
                    min={0}
                  />
                </label>
              </div>
            )}
            <ModalActions>
              <Button onClick={() => setIsModalOpen(false)}>취소</Button>
              <Button onClick={handleSubmit}>적용</Button>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
};

export default MemberManagement;
