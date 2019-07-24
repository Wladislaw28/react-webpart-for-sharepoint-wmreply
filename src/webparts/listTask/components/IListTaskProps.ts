import {SPHttpClient} from '@microsoft/sp-http';

export interface IListTaskProps {
    listName: string;
    spHttpClient: SPHttpClient;
}
