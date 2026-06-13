import styles from "../css/input.module.css"


function Input({ type, placeholder, value, setValue }) {
  return (
    <input className={styles.input}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export default Input;
                                                                                                                                                  