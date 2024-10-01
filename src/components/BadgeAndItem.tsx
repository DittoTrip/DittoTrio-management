import { useEffect, useState } from "react";
import axios from "axios";

interface Item {
  rewardId: number; // Unique identifier for the item
  imagePath: string; // Path to the item's image
  name: string; // Name of the item
  itemType: string; // Type of the item (e.g., 'SKIN', 'EYES', etc.)
}

export interface Badge {
  rewardId: number;
  name: string;
  body: string;
  conditionBody: string;
  imagePath: string;
  createdDateTime: Date;
  userBadgeId: number;
}

export interface UserBadgeResponse {
  badgeDataList: Badge[];
  isMine: boolean;
}

const BadgeAndItemList = () => {
  const [badgeData, setBadgeData] = useState<Badge[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  const fetchBadgeData = async () => {
    try {
      const response = await axios.get(
        "https://dittotrip.site/user/1/badge/list"
      );
      setBadgeData(response.data.badgeDataList);
    } catch (error) {
      console.error("Error fetching badge data:", error);
    }
  };

  const fetchItemData = async () => {
    try {
      const response = await axios.get(
        "https://dittotrip.site/item/list/admin"
      );
      setItems(response.data.itemDataList);
    } catch (error) {
      console.error("Error fetching item data:", error);
    }
  };

  useEffect(() => {
    fetchBadgeData();
    fetchItemData();
  }, []);

  return (
    <div>
      <h2 style={{ borderBottom: "2px solid #ccc", paddingBottom: "10px" }}>
        Badge List
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        {badgeData &&
          badgeData.map((badge) => (
            <div
              key={badge.userBadgeId}
              style={{
                textAlign: "center",
                border: "1px solid #ddd",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <p>ID: {badge.rewardId}</p>
              <p>Name: {badge.name}</p>
              <p>Description: {badge.body}</p>
              <img
                src={badge.imagePath}
                alt={badge.name}
                style={{ width: "100px", height: "100px", objectFit: "cover" }} // Adjust size as needed
              />
            </div>
          ))}
      </div>

      <div style={{ borderBottom: "2px solid #ccc", marginBottom: "20px" }} />

      <h2 style={{ borderBottom: "2px solid #ccc", paddingBottom: "10px" }}>
        Item List
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "16px",
        }}
      >
        {items &&
          items.map((item) => (
            <div
              key={item.rewardId}
              style={{
                textAlign: "center",
                border: "1px solid #ddd",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <p>rewardId: {item.rewardId}</p>
              <p>Name: {item.name}</p>
              <p>Item Type: {item.itemType}</p>
              <img
                src={item.imagePath}
                alt={item.name}
                style={{ width: "100px", height: "100px", objectFit: "cover" }} // Adjust size as needed
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default BadgeAndItemList;
