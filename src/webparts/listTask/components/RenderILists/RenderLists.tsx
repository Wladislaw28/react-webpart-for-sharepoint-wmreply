import * as React from 'react';
import {RenderListsProps,RenderListsList } from '../interface';
import styles from '../ListTask.module.scss';

const RenderLists = ({listData}: RenderListsProps ) => {
    return(
        <div className={styles.spListContainer}>
            {listData.map((item) => (
             <div className={styles.spListContainerItem} key={item.Id}>{item.Title}</div>
             ))}
         </div>
    );
};

export default RenderLists;
