import styles from "../css/button.module.css";

function Button({ text, onClick, outline, disabled = false, type = "button" }) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={outline ? styles.btnOutline : styles.btnFilled}
    >
      {text}
    </button>
  );
}

export default Button;
