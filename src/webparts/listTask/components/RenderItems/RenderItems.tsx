import * as React from 'react';
import {RenderItemsProps, RenderItemsList} from '../interface';
import styles from '../ListTask.module.scss';

const RenderItems = ({listName, listItemsData}: RenderItemsProps) => {
    return (
        <table className={styles.table_dark}>
            <h1 className={styles.headline}>{listName}</h1>
        	<tr>
        		<th>ID</th>
        		<th>Title</th>
        		<th>Modified</th>
        	</tr>
            <div className={styles.spListContainerItem}>
                {listItemsData.map((itemList) => (
        			<tr key={itemList.ID}>
                        <td>
                        {itemList.ID}
                        </td>
                        <td>
                            {itemList.Title}
                        </td>
                        <td>
                            {itemList.Modified}
                        </td>
                    </tr>
                ))}
            </div>
        </table>
    );
};

export default RenderItems;
