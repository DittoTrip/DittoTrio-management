import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

interface RewardData {
  rewardId: number;
  name: string;
  imagePath: string;
}

interface Quest {
  questId: number;
  title: string;
  body: string;
  conditionCount: number;
  questActionType: string;
  createdDateTime: string;
  rewardExp: number;
  rewardData: RewardData;
}

interface QuestListResponse {
  questDataList: Quest[];
  totalCount: number;
}
export const QuestContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const QuestList = styled.ul`
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5 items per row */
  gap: 20px;
  list-style-type: none;
  padding: 0;
`;

export const QuestItem = styled.li`
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #f0f0f0;
  }
`;

export const QuestTitle = styled.h3`
  margin: 0;
  font-size: 20px;
  color: #333;
`;

export const QuestBody = styled.p`
  font-size: 16px;
  color: #555;
  margin-top: 8px;
`;

export const QuestDetails = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: #777;
`;

export const QuestImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  margin-top: 10px;
`;

export const Loading = styled.div`
  text-align: center;
  font-size: 18px;
  color: #555;
`;

export const Error = styled.div`
  color: red;
  text-align: center;
  font-size: 18px;
  margin-top: 20px;
`;

const QuestListPage: React.FC = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const response = await axios.get<QuestListResponse>(
          "https://dittotrip.site/quest/list/admin"
        );
        setQuests(response.data.questDataList);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch quests.");
        setLoading(false);
      }
    };

    fetchQuests();
  }, []);

  if (loading) {
    return <Loading>Loading quests...</Loading>;
  }

  if (error) {
    return <Error>{error}</Error>;
  }

  return (
    <QuestContainer>
      <h1>Quest List</h1>
      <QuestList>
        {quests.map((quest) => (
          <QuestItem key={quest.questId}>
            <QuestTitle>{quest.title}</QuestTitle>
            <QuestBody>{quest.body}</QuestBody>
            <QuestDetails>
              <p>Condition Count: {quest.conditionCount}</p>
              <p>Action Type: {quest.questActionType}</p>
              <p>Reward Exp: {quest.rewardExp}</p>
              <p>Reward Name: {quest.rewardData.name}</p>
            </QuestDetails>
            <QuestImage
              src={quest.rewardData.imagePath}
              alt={quest.rewardData.name}
            />
          </QuestItem>
        ))}
      </QuestList>
    </QuestContainer>
  );
};

export default QuestListPage;
