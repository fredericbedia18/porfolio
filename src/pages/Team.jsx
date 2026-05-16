import { FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Card from "../components/Card";
import NavBar from "../components/NavBar";
import PageHeader from "../components/PageHeader";
import { teamMembers } from "../data/teamData";
import styles from "../css/team.module.css";

function Team() {
  return (
    <div className={styles.page}>
      <NavBar />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <PageHeader
            heading="Meet the team"
            text="A dedicated group of designers, developers, and strategists shaping powerful digital experiences."
          />
          <p className={styles.heroText}>
            We build beautiful products with clarity, creativity, and technical excellence.
            Every member brings unique skills to deliver modern solutions for ambitious projects.
          </p>
        </div>
      </section>

      <section className={styles.container}>
        <div className={styles.cardContainer}>
          {teamMembers.map((member) => (
            <Card
              key={member.id}
              image={member.image}
              name={member.name}
              description={member.role}
              instaIcon={<FaInstagram />}
              instaLink={member.socialLinks.instagram}
              youtubeIcon={<FaYoutube />}
              youtubeLink={member.socialLinks.youtube}
              twitterIcon={<FaXTwitter />}
              twitterLink={member.socialLinks.twitter}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Team;
