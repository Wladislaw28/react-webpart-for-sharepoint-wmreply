import { IColumn } from 'office-ui-fabric-react/lib/DetailsList';

export interface IListTaskWebPartProps {
    nameWebPart: string;
    listURL: string;
    sliderNumber: number;
    filterItems: string;
    selectItems: string;
    dropdownProperty: any;
}

export interface ISPLists {
    value: ISPList[];
}

export interface ISPList {
    Title: string;
    Id: string;
}

export interface IListTaskState {
    listData: ISPList[];
    listItemsData: any;
    listName: string;
    yesOrNotList: boolean;
    columns: Array<IColumn>;
}

export interface RenderItemsList {
    ID: string;
    Title: string;
    Modified: string;
}

export interface RenderItemsProps {
    listItemsData: RenderItemsList[];
    listName: string;
}

export interface RenderListsList {
    Id: string;
    Title: string;
}

export interface RenderListsProps {
    listData: RenderListsList[];
}
