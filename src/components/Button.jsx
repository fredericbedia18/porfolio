import React from 'react'
import  styles from "../css/button.module.css"


function Button({text, onClick, outline}) {
  return (
    <button onClick={onClick} className={ outline?styles.btnOutline : styles.btnFilled}> {text}</button>
  )
}

export default Button