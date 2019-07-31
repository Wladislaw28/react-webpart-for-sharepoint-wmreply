import {SPHttpClient} from '@microsoft/sp-http';

export interface IListTaskProps {
    nameWebPart: string;
    listURL: string;
    // spHttpClient: SPHttpClient;
    sliderNumber: number;
    filterItems: string;
    selectItems: string;
    dropdownProperty: any;
}
