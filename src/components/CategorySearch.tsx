import React, { useState, ChangeEvent, useEffect } from "react";
import { styled } from "styled-components";
import { defaultImg } from "../constants/default";
import { SpotData } from "./SpotSearch";
import { MajorType, SubType } from "../pages/CategoryManagement";
import axios from "axios";
import { gray20, gray40, gray60 } from "../style/color";

export interface Category {
  categoryId: number;
  name: string;
  imageFilePath: string | null;
  myBookmarkId: number | null;
  hashtags: string[];
  spotList: SpotData[];
  totalPages: number;
  majorType: MajorType;
  subType: SubType;
}
interface Props {
  selectedCategory: Category[];
  setSelectedCategory: React.Dispatch<React.SetStateAction<Category[]>>;
}
const CategorySearch = ({ selectedCategory, setSelectedCategory }: Props) => {
  const [searchWord, setSearchWord] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  // 검색어 변경 시 카테고리 검색
  useEffect(() => {
    if (searchWord) {
      const fetchCategories = async () => {
        const response = await axios.get(
          `https://dittotrip.site/category/list/search/typeless?query=${searchWord}`
        );
        setCategories(response.data.categoryDataList);
      };

      fetchCategories();
    } else {
      setCategories([]);
    }
  }, [searchWord]);

  // 입력값 처리
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchWord(event.target.value);
  };

  // 카테고리 선택 처리
  const handleCategorySelect = (category: Category) => {
    if (
      !selectedCategory.some(
        (selected) => selected.categoryId === category.categoryId
      )
    ) {
      const newSelectedCategory = [...selectedCategory, category];
      setSelectedCategory(newSelectedCategory);

      setSearchWord("");
      setCategories([]);
    } else {
      alert("이미 등록된 카테고리입니다.");
      setSearchWord("");
      setCategories([]);
    }
  };
  // 선택된 카테고리 삭제 처리
  const handleRemoveCategory = (categoryId: number) => {
    const newSelectedCategory = selectedCategory.filter(
      (category) => category.categoryId !== categoryId
    );
    setSelectedCategory(newSelectedCategory);
  };

  return (
    <CategorySearchContainer>
      <input
        type="text"
        value={searchWord}
        onChange={handleInputChange}
        placeholder="스팟과 관련된 카테고리를 검색해 주세요"
        className="search-input"
      />
      {categories.length > 0 && (
        <div className="category-list">
          {categories.map((category) => (
            <div
              key={category.categoryId}
              className="category-item"
              onClick={() => handleCategorySelect(category)}
            >
              <img
                className="category-img"
                src={category.imageFilePath ?? defaultImg}
              />
              {category.name}
            </div>
          ))}
        </div>
      )}
      {selectedCategory.length > 0 && (
        <div className="selected-category-list">
          {selectedCategory.map((category) => (
            <div key={category.categoryId} className="selected-category-item">
              {category.name}
              <button
                className="remove-button"
                onClick={() => handleRemoveCategory(category.categoryId)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </CategorySearchContainer>
  );
};

// 스타일 정의
const CategorySearchContainer = styled.div`
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
    font-size: 14px;

    box-sizing: border-box;
  }

  .category-list {
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;

    border: 1px solid ${gray40};
    border-radius: 12px;
    z-index: 10;
    max-height: 200px;
    overflow-y: auto;
    margin-top: 2px;
  }

  .category-item {
    display: flex;
    gap: 20px;
    padding: 12px 20px;
    align-items: center;

    background-color: ${gray20};
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;

    .category-img {
      width: 40px;
      height: 40px;
      border-radius: 12px;
    }

    &:hover {
      background-color: ${gray40};
    }
  }

  .selected-category-list {
    margin: 20px 0;
    border: 1px solid ${gray40};
    border-radius: 12px;
    padding: 8px;
    font-size: 14px;
  }

  .selected-category-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    padding: 8px;
    margin-bottom: 4px;
    border-radius: 4px;
    font-size: 14px;

    &:hover {
      background-color: ${gray40};
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

export default CategorySearch;
