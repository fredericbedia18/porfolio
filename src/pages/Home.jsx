import { FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import NavBar from "../components/NavBar";
import SocialIcon from "../components/SocialIcon";
import styles from "../css/home.module.css";
import img from "../images/frederic.png";

function Home() {
  const navigate = useNavigate();
  const handleGoToAbout = () => {
    navigate("/team");
  };

  const handleGoToContact = () => {
    navigate("/contact");
  };


  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.subContainer}>
        <div>
          <h2 className={styles.subHeading}>Hey I'm Frederic Bedia </h2>
          <h2 className={styles.heading}>
            <span className={styles.purple}> Software Engineer Learning </span>
          </h2>
          <p className={styles.infoText}>
            {`I'm a freelance web developer specializing in JavaScript, React, and node.js
I build modern, high-performance web applications tailored to your needs from responsive user interfaces to real-time features and serverless backends.`}
          </p>

          <div className={styles.btnContainer}>
            <Button text='About Us' onClick={handleGoToAbout} />
            <Button
              text='Contact'
              onClick={handleGoToContact}
              outline={true}
            />
          </div>
          <div className={styles.iconContainer}>
            <SocialIcon
              icon={<FaInstagram />}
              link='https://www.instagram.com/'
            />
            <SocialIcon icon={<FaXTwitter />} link='https://x.com/' />
            <SocialIcon icon={<FaYoutube />} link='www.youtube.com' />
          </div>
        </div>
        <div>
          <img src={img} alt='image of portfolio' />
        </div>
      </div>
    </div>
  );
}

export default Home;
