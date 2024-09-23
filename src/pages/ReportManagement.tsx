// pages/ReportManagement.tsx
import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import axios from "axios";
import styled from "styled-components";
import { gray20, gray40, gray60 } from "../style/color";
import formatDate from "../utils/formatDate";

// 신고 사유 타입과 한글 설명 매핑
const reportReasonMap: { [key in ReportReasonType]: string } = {
  BLAME: "욕설 및 비하",
  ILLEGAL_INFORMATION: "불법 정보",
  BUSINESS: "홍보 및 영리 목적",
  PERSONAL_INFORMATION_EXPOSURE: "개인정보노출",
  SENSATIONAL_CONTENTS: "음란물 및 선정적인 컨텐츠",
  ILLEGAL_NICKNAME: "부적절한 닉네임",
  ETC: "기타",
};

export type ReportReasonType =
  | "BLAME"
  | "ILLEGAL_INFORMATION"
  | "BUSINESS"
  | "PERSONAL_INFORMATION_EXPOSURE"
  | "SENSATIONAL_CONTENTS"
  | "ILLEGAL_NICKNAME"
  | "ETC";

export type ReportTargetType =
  | "REVIEW"
  | "REVIEW_COMMENT"
  | "DITTO"
  | "DITTO_COMMENT"
  | "USER";

export interface ReportDataResponse {
  reportDataList: ReportData[];
  totalPage: number;
}

export interface ReportData {
  reportId: number;
  reportReasonType: ReportReasonType;
  reportTargetType: ReportTargetType; // Adjust other target types if needed
  isHandled: boolean;
  createdDateTime: Date;
  userData: UserData;
  targetId: number;
  contentPath: string;
}

export interface UserData {
  userId: number;
  nickname: string;
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
  createdDateTime: string;
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

const ReportManagement: React.FC = () => {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [shouldDeleteContent, setShouldDeleteContent] =
    useState<boolean>(false);
  const [shouldPermanentlyBan, setShouldPermanentlyBan] =
    useState<boolean>(false);
  const [suspensionDays, setSuspensionDays] = useState<number>(0);

  useEffect(() => {
    fetchReports(currentPage);
  }, [currentPage]);

  const fetchReports = async (page: number) => {
    const response = await axios.get(
      `https://dittotrip.site/report/list?page=${page}&query=&size=10`
    );
    setReports(response.data.reportDataList);
    setTotalPages(response.data.totalPage);
  };

  const handleSuspendClick = (memberId: number) => {
    setSelectedReportId(memberId);
    setIsModalOpen(true);
  };
  console.log(selectedReportId);
  const handleSubmit = async () => {
    if (selectedReportId !== null) {
      const data = {
        shouldDeleteContent,
        shouldPermanentlyBan,
        suspensionDays: shouldPermanentlyBan ? 0 : suspensionDays,
      };
      const res = await axios.post(
        `https://dittotrip.site/report/${selectedReportId}`,
        data
      );
      if (res.status == 200) {
        alert("적용되었습니다.");
      } else {
        alert("문제가 발생했습니다.");
      }
      setIsModalOpen(false);
      fetchReports(currentPage);
    }
  };

  const dittoURL = "httpss://dittotrip.site"; // 배포 url

  return (
    <div>
      <h2>신고 관리</h2>
      <Table>
        <Thead>
          <tr>
            <Th>신고 ID</Th>
            <Th>닉네임</Th>
            <Th>분류</Th>
            <Th>신고 일자</Th>
            <Th>사유</Th>
            <Th>신고 주소</Th>
            <Th>비고</Th>
          </tr>
        </Thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.reportId}>
              <Td>{report.reportId}</Td>
              <Td>{report.userData.nickname}</Td>
              <Td>{report.reportTargetType}</Td>
              <Td>{formatDate(report.createdDateTime)}</Td>
              <Td>{reportReasonMap[report.reportReasonType]}</Td>
              <Td>
                <a
                  href={`${dittoURL}${report.contentPath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  link
                </a>
              </Td>
              <Td>
                {report.userData.userId !== 200 && (
                  <Button
                    onClick={() => handleSuspendClick(report.userData.userId)}
                  >
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
        onPageChange={(page) => setCurrentPage(page)}
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

export default ReportManagement;
