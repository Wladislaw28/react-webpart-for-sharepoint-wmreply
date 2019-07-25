import {SPHttpClient} from '@microsoft/sp-http';

export interface IListTaskProps {
    listURL: string;
    spHttpClient: SPHttpClient;
    sliderNumber: number;
    filterItems: string;
    dropdownProperty: any;
}
