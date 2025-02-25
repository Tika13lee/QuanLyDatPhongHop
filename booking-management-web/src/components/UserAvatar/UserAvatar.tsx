type UserAvatarProps = {
  imgUrl: string;
  size?: number;
  borderColor?: string;
};

function UserAvatar({
  imgUrl,
  size = 40,
  borderColor = "#C5C7CA",
}: UserAvatarProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        border: `1px solid ${borderColor}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      <img
        src={imgUrl}
        alt="User avatar"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
}

export default UserAvatar;
