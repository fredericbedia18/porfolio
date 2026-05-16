import { Link } from "react-router-dom";
import styles from "../css/icon.module.css";

function SocialIcon({ icon, link }) {
  return (
    <Link to={link} className={styles.icon} target='_blank'>
      {icon}
    </Link>
  );
}

export default SocialIcon;
