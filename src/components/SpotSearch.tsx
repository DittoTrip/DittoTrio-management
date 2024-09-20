import axios from "axios";
import React, { useState, ChangeEvent, useEffect } from "react";
import { styled } from "styled-components";
import { gray20, gray40, gray60 } from "../style/color";

export interface SpotData {
  spotId: number;
  name: string;
  address: string;
  pointX: number;
  pointY: number;
  imagePath: string;
  rating: number;
  hashtags: string[];
  myBookmarkId: number;
}

export interface SpotSearchListResponse {
  spotDataList: SpotData[];
  spotCount: number;
}

interface Props {
  selectedSpot: SpotData[];
  setSelectedSpot: React.Dispatch<React.SetStateAction<SpotData[]>>;
}
const SpotSearch = ({ selectedSpot, setSelectedSpot }: Props) => {
  const [searchWord, setSearchWord] = useState("");
  const [spotList, setSpotList] = useState<SpotData[]>([]);

  console.log(spotList);

  useEffect(() => {
    if (searchWord) {
      const fetchSpots = async () => {
        try {
          const result = await axios.get(
            `https://dittotrip.site/spot/list/search?query=${searchWord}`
          );
          console.log(result);
          setSpotList(result.data.spotDataList);
        } catch (error) {
          console.error("카테고리 검색 실패", error);
        }
      };
      fetchSpots();
    } else {
      setSpotList([]);
    }
  }, [searchWord]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchWord(event.target.value);
  };

  const handlespotSelect = (spot: SpotData) => {
    if (!selectedSpot.some((selected) => selected.spotId === spot.spotId)) {
      const newSelectedspot = [...selectedSpot, spot];
      setSelectedSpot(newSelectedspot);

      setSearchWord("");
      setSpotList([]);
    } else {
      alert("이미 등록된 카테고리입니다.");
      setSearchWord("");
      setSpotList([]);
    }
  };
  const handleRemovespot = (spotId: number) => {
    const newSelectedspot = selectedSpot.filter(
      (spot) => spot.spotId !== spotId
    );
    setSelectedSpot(newSelectedspot);
  };

  return (
    <SpotSearchContainer>
      <input
        type="text"
        value={searchWord}
        onChange={handleInputChange}
        placeholder="스팟과 관련된 카테고리를 검색해 주세요"
        className="search-input"
      />
      {spotList.length > 0 && (
        <div className="spot-list">
          {spotList.map((spot) => (
            <div
              key={spot.spotId}
              className="spot-item"
              onClick={() => handlespotSelect(spot)}
            >
              {spot.name}
            </div>
          ))}
        </div>
      )}
      {selectedSpot.length > 0 && (
        <div className="selected-spot-list">
          {selectedSpot.map((spot) => (
            <div key={spot.spotId} className="selected-spot-item">
              {spot.name}
              <button
                className="remove-button"
                onClick={() => handleRemovespot(spot.spotId)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </SpotSearchContainer>
  );
};

// 스타일 정의
const SpotSearchContainer = styled.div`
  position: relative;

  .search-input {
    width: 100%;
    height: 42px;

    padding: 8px;
    margin-top: 8px;

    border: 1px solid ${gray40};
    outline: none;
    border-radius: 12px;
    background-color: ${gray20};

    box-sizing: border-box;
  }

  .spot-list {
    position: absolute;
    top: 47px;
    left: 0;
    right: 0;

    border: 1px solid ${gray40};
    border-radius: 12px;
    z-index: 10;
    max-height: 200px;
    overflow-y: auto;
    margin-top: 2px;
  }

  .spot-item {
    display: flex;
    gap: 20px;
    padding: 12px 20px;
    align-items: center;

    background-color: ${gray20};
    cursor: pointer;

    &:hover {
      background-color: ${gray40};
    }
  }

  .selected-spot-list {
    margin: 20px 0;
    border: 1px solid ${gray40};
    border-radius: 12px;
    padding: 8px;
  }

  .selected-spot-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    padding: 8px;
    margin-bottom: 4px;
    border-radius: 4px;
    font-size: 14px;

    &:hover {
      background-color: ${gray20};
    }
  }

  .remove-button {
    background: none;
    border: none;
    color: ${gray60};
    font-size: 16px;
    cursor: pointer;
    padding: 0;
  }
`;

export default SpotSearch;
