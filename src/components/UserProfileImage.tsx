import React from "react";
import styled from "styled-components";

const ProfileImageWrapper = styled.div`
  position: relative;
  width: 100px; /* Adjust as needed */
  height: 100px; /* Adjust as needed */
`;

const ProfileItem = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

interface UserProfileImageProps {
  skin: string;
  hair: string;
  eyes: string;
  mouse: string;
  accessory: string;
}

const UserProfileImage: React.FC<UserProfileImageProps> = ({
  skin,
  hair,
  eyes,
  mouse,
  accessory,
}) => {
  return (
    <ProfileImageWrapper>
      <ProfileItem src={skin} alt="Skin" />
      <ProfileItem src={hair} alt="Hair" />
      <ProfileItem src={eyes} alt="Eyes" />
      <ProfileItem src={mouse} alt="Mouse" />
      <ProfileItem src={accessory} alt="Accessory" />
    </ProfileImageWrapper>
  );
};

export default UserProfileImage;
