import styles from "../css/card.module.css";
import SocialIcon from "./SocialIcon";

function Card({
  image,
  name,
  description,
  instaIcon,
  instaLink,
  youtubeIcon,
  youtubeLink,
  twitterIcon,
  twitterLink,
}) {
  return (
    <div className={styles.container}>
      <img src={image} alt='' className={styles.img} />
      <p className={styles.name}> {name} </p>
      <p className={styles.description}> {description} </p>
      <div className={styles.iconContainer}>
        <SocialIcon icon={instaIcon} link={instaLink} />
        <SocialIcon icon={youtubeIcon} link={youtubeLink} />
        <SocialIcon icon={twitterIcon} link={twitterLink} />
      </div>
    </div>
  );
}

export default Card;
