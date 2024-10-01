import { useForm } from "react-hook-form";
import axios from "axios";
import BadgeAndItemList from "../components/BadgeAndItem";

const QuestManagement = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.post("https://dittotrip.site/quest", data);
      console.log("Quest registered:", response.data);
    } catch (error) {
      console.error("Error registering quest:", error);
    }
  };

  return (
    <>
      <div
        style={{
          padding: "20px",
          maxWidth: "600px",
          margin: "0 auto",
          border: "1px solid #ddd",
          borderRadius: "10px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Quest Registration</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <div>
            <label htmlFor="title" style={{ fontWeight: "bold" }}>
              Title:
            </label>
            <input
              id="title"
              {...register("title", { required: "Title is required" })}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            {errors.title && <p style={{ color: "red" }}>필수</p>}
          </div>

          <div>
            <label htmlFor="body" style={{ fontWeight: "bold" }}>
              Description:
            </label>
            <textarea
              id="body"
              {...register("body", { required: "Description is required" })}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            {errors.body && <p style={{ color: "red" }}>필수</p>}
          </div>

          <div>
            <label htmlFor="conditionCount" style={{ fontWeight: "bold" }}>
              Condition Count:
            </label>
            <input
              id="conditionCount"
              type="number"
              {...register("conditionCount", {
                required: "Condition Count is required",
                min: 0,
              })}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            {errors.conditionCount && <p style={{ color: "red" }}>필수</p>}
          </div>

          <div>
            <label htmlFor="questActionType" style={{ fontWeight: "bold" }}>
              Quest Action Type:
            </label>
            <select
              id="questActionType"
              {...register("questActionType", {
                required: "Quest Action Type is required",
              })}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            >
              <option value="VISIT">Visit</option>
              <option value="REVIEW">Review</option>
              <option value="DITTO">Ditto</option>
              <option value="FOLLOWING">Following</option>
              {/* Add more options as needed */}
            </select>
            {errors.questActionType && <p style={{ color: "red" }}>필수</p>}
          </div>

          <div>
            <label htmlFor="rewardExp" style={{ fontWeight: "bold" }}>
              Reward Experience:
            </label>
            <input
              id="rewardExp"
              type="number"
              {...register("rewardExp", {
                required: "Reward Experience is required",
                min: 0,
              })}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            {errors.rewardExp && <p style={{ color: "red" }}>필수</p>}
          </div>

          <div>
            <label htmlFor="rewardId" style={{ fontWeight: "bold" }}>
              Reward ID:
            </label>
            <input
              id="rewardId"
              type="number"
              {...register("rewardId", { required: "Reward ID is required" })}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            {errors.rewardId && <p style={{ color: "red" }}>필수</p>}
          </div>

          <button
            type="submit"
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#4CAF50",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Register Quest
          </button>
        </form>
      </div>
      <BadgeAndItemList />
    </>
  );
};

export default QuestManagement;
