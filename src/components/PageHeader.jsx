import React from 'react'
import styles from "../css/pageheader.module.css"

function PageHeader({heading, text}) {
  return (
    <div className={styles.container}>
        <h1 className={styles.heading}> {heading} </h1>
        <p className={styles.text}> {text} </p>
    </div>
  )
}

export default PageHeader