export interface IListTaskWebPartProps {
    listURL: string;
    sliderNumber: number;
    filterItems: string;
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
