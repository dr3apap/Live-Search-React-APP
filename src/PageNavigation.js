import React from "react";
import styles from "./style.module.css"

export const PageNavigation = props =>{

const {showPrevPage, showNextPage, handlePrevPage, handleNextPage,isLoading} = props

return (

<div className={styles.parent}>
    <a href="#" className={`styles['page-link'] ${showPrevPage?styles['show']:styles['hide']} ${isLoading? styles['greyed-out']: "" }`} onClick={handlePrevPage}>Prev

    </a>

    <a href="#" className={`page-link${showNextPage? styles['show']:styles['hide']} ${isLoading? styles['greyed-out']:"" }`} onClick={handleNextPage}>Next</a>
</div>



);




}