import styles from "../css/input.module.css";

function Textarea({ placeholder, value, setValue }) {
  return (
    <textarea
      className={styles.textarea}
      name=''
      id=''
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    ></textarea>
  );
}

export default Textarea;
