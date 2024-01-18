import "./Avatar.scss";

type AvatarProps = {
  photo: string;
  username: string;
  className: string;
};

const Avatar: React.FC<AvatarProps> = ({ photo, username, className }) => {
  return photo.length ? (
    <img src={`${photo}`} alt="post" className={className} />
  ) : (
    <div className={className}>{username.length ? username[0].toUpperCase() : username}</div>
  );
};

export default Avatar;
