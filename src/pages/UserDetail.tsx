import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../components/Pagination";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import UserProfileImage from "../components/UserProfileImage";

interface UserProfile {
  userId: number;
  userStatus: string;
  nickname: string;
  email: string;
  createdDateTime: string;
  progressionBar: number;
  reviewCount: number;
  dittoCount: number;
  userProfileData: {
    itemSkin: { imagePath: string };
    itemHair: { imagePath: string };
    itemEyes: { imagePath: string };
    itemMouse: { imagePath: string };
    itemAccessory: { imagePath: string };
  };
}

interface Review {
  id: number;
  title: string;
  body: string;
}

interface Ditto {
  id: number;
  title: string;
  body: string;
}

const Container = styled.div``;

const Section = styled.div`
  width: 70vw;
  margin-bottom: 40px;
`;

const UserInfoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const LeftColumn = styled.div`
  width: 48%;
`;

const RightColumn = styled.div`
  width: 48%;
`;

const InfoTable = styled.table`
  width: 40vw;

  border-collapse: separate;
  border-spacing: 0;
  margin-bottom: 20px;
`;

const Table = styled.table`
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
const UserDetail: React.FC = () => {
  const { id } = useParams();

  const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [dittos, setDittos] = useState<Ditto[]>([]);
  const [currentReviewPage, setCurrentReviewPage] = useState<number>(0);
  const [totalReviewPages, setTotalReviewPages] = useState<number>(1);
  const [currentDittoPage, setCurrentDittoPage] = useState<number>(0);
  const [totalDittoPages, setTotalDittoPages] = useState<number>(1);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    fetchReviews(currentReviewPage);
  }, [currentReviewPage]);

  useEffect(() => {
    fetchDittos(currentDittoPage);
  }, [currentDittoPage]);

  const fetchUserInfo = async () => {
    const response = await axios.get(`http://dittotrip.site/user/${id}`);
    setUserInfo(response.data.userDataForAdmin);
  };

  const fetchReviews = async (page: number) => {
    const response = await axios.get(
      `http://dittotrip.site/user/${id}/review/list?page=${page}&size=3`
    );
    setReviews(response.data.contentDataList);
    setTotalReviewPages(response.data.totalPages);
  };

  const fetchDittos = async (page: number) => {
    const response = await axios.get(
      `http://dittotrip.site/user/${id}/ditto/list?page=${page}&size=`
    );

    setDittos(response.data.contentDataList);
    setTotalDittoPages(response.data.totalPages);
  };

  return (
    <Container>
      <Section>
        <h2>회원 정보</h2>
        {userInfo && userInfo.userProfileData && (
          <UserProfileImage
            skin={userInfo.userProfileData.itemSkin.imagePath}
            hair={userInfo.userProfileData.itemHair.imagePath}
            eyes={userInfo.userProfileData.itemEyes.imagePath}
            mouse={userInfo.userProfileData.itemMouse.imagePath}
            accessory={userInfo.userProfileData.itemAccessory.imagePath}
          />
        )}
        {userInfo && (
          <UserInfoWrapper>
            <LeftColumn>
              <InfoTable>
                <tbody>
                  <tr>
                    <Th>닉네임</Th>
                    <Td>{userInfo.nickname}</Td>
                  </tr>
                  <tr>
                    <Th>가입일</Th>
                    <Td>
                      {new Date(userInfo.createdDateTime).toLocaleDateString()}
                    </Td>
                  </tr>
                  <tr>
                    <Th>경험치</Th>
                    <Td>{userInfo.progressionBar}</Td>
                  </tr>
                  <tr>
                    <Th>ID</Th>
                    <Td>{userInfo.userId}</Td>
                  </tr>
                </tbody>
              </InfoTable>
            </LeftColumn>

            <RightColumn>
              <InfoTable>
                <tbody>
                  <tr>
                    <Th>계정</Th>
                    <Td>{userInfo.email}</Td>
                  </tr>
                  <tr>
                    <Th>등급</Th>
                    <Td>{userInfo.userStatus}</Td>
                  </tr>
                  <tr>
                    <Th>리뷰 수</Th>
                    <Td>{userInfo.reviewCount}</Td>
                  </tr>
                  <tr>
                    <Th>디토 수</Th>
                    <Td>{userInfo.dittoCount}</Td>
                  </tr>
                </tbody>
              </InfoTable>
            </RightColumn>
          </UserInfoWrapper>
        )}
      </Section>

      <Section>
        <h2>작성한 디토</h2>
        <Table>
          <Thead>
            <tr>
              <Th>ID</Th>
              <Th>제목</Th>
              <Th>내용</Th>
            </tr>
          </Thead>
          <tbody>
            {dittos.map((ditto) => (
              <tr key={ditto.id}>
                <Td>{ditto.id}</Td>
                <Td>{ditto.title}</Td>
                <Td>{ditto.body}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Pagination
          currentPage={currentDittoPage}
          totalPages={totalDittoPages}
          onPageChange={setCurrentDittoPage}
        />
      </Section>

      {/* 리뷰 정보 섹션 */}
      <Section>
        <h2>작성한 리뷰</h2>
        <Table>
          <Thead>
            <tr>
              <Th>ID</Th>
              <Th>제목</Th>
              <Th>내용</Th>
            </tr>
          </Thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id}>
                <Td>{review.id}</Td>
                <Td>{review.title}</Td>
                <Td>{review.body}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Pagination
          currentPage={currentReviewPage}
          totalPages={totalReviewPages}
          onPageChange={setCurrentReviewPage}
        />
      </Section>
    </Container>
  );
};

export default UserDetail;
