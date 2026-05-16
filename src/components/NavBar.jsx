import { NavLink } from "react-router-dom";
import { FaPenToSquare } from "react-icons/fa6";
import styles from "../css/navbar.module.css";

function NavBar() {
  return (
    <nav className={styles.container} aria-label="Main navigation">
      <div className={styles.inner}>
        <NavLink to="/" className={styles.logo} aria-label="Go to home">
          <FaPenToSquare className={styles.logoIcon} />
          <span className={styles.logoText}>Portfolio</span>
        </NavLink>

        <div className={styles.navContainer}>
          <NavLink
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.activeLink}` : styles.link
            }
            to="/"
          >
            Home
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.activeLink}` : styles.link
            }
            to="/team"
          >
            Team
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.activeLink}` : styles.link
            }
            to="/contact"
          >
            Contact
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
