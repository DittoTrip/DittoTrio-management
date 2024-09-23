// pages/MemberManagement.tsx
import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import axios from "axios";
import styled from "styled-components";
import { gray20, gray40, gray60 } from "../style/color";
import formatDate from "../utils/formatDate";
import { Link } from "react-router-dom";

export interface UserAdminData {
  userDataForAdminList: UserData[];
  totalPages: number;
}

export interface UserData {
  userId: number;
  userStatus: "NORMAL" | "BANNED" | "INACTIVE"; // Adjust other possible statuses if needed
  nickname: string;
  email: string;
  createdDateTime: Date;
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
  itemType: "SKIN" | "EYES" | "MOUSE" | "HAIR" | "ACCESSORY";
  createdDateTime: string;
}

export interface BadgeData {
  rewardId: number;
  name: string;
  body: string;
  conditionBody: string;
  imagePath: string;
  createdDateTime: Date;
  userBadgeId: number;
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
  const [selectedMember, setSelectedMember] = useState<UserData | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMembers(currentPage);
  }, [currentPage]);

  const fetchMembers = async (page: number) => {
    const response = await axios.get(
      `https://dittotrip.site/user/list/search/admin?query=&page=${page}&size=10`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    setMembers(response.data.userDataForAdminList);
    setTotalPages(response.data.totalPages);
  };

  const handleDeleteMember = async (member: UserData) => {
    const response = await axios.put(
      `https://dittotrip.site/user/${member.userId}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    if (response.status === 200) {
      alert("영구 정지 처리되었습니다.");
    } else {
      alert("문제가 발생했습니다.");
    }

    setIsDeleteModalOpen(false);
    fetchMembers(currentPage);
  };

  const handleSuspendClick = (member: UserData) => {
    setSelectedMember(member);
    setIsDeleteModalOpen(true);
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
            <Th>경험치</Th>
            <Th>리뷰/디토</Th>
            <Th>비고</Th>
          </tr>
        </Thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.userId}>
              <Td>{member.nickname}</Td>
              <Td>{member.email}</Td>
              <Td>{formatDate(member.createdDateTime)}</Td>
              <Td>{member.progressionBar}</Td>
              <Td>
                {member.reviewCount} / {member.dittoCount}
              </Td>
              <Td>
                {member.userId !== 200 && (
                  <Button onClick={() => handleSuspendClick(member)}>
                    탈퇴
                  </Button>
                )}
                <Button>
                  <Link to={`/member/detail/${member.userId}`}>회원 정보</Link>
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

      {/* 삭제 확인 모달 */}
      {isDeleteModalOpen && selectedMember && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>영구정지</ModalTitle>
            <p>
              정말로 "{selectedMember?.userId}번" 유저를 영구 정지 하시겠습니까?
            </p>
            <ModalActions>
              <Button onClick={() => setIsDeleteModalOpen(false)}>취소</Button>
              <Button onClick={() => handleDeleteMember(selectedMember)}>
                영구 정지
              </Button>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
};

export default MemberManagement;
