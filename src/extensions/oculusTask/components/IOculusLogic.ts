import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";
import {SPHttpClient} from '@microsoft/sp-http';

export interface IOculusLogicProps {
    context: ApplicationCustomizerContext;
    urlContext: string;
    spHttpClient: SPHttpClient;
}

export interface IOculusLogicState{
    counter: number;
    listData: ISPList[];
}

export interface ISPLists {
    value: ISPList[];
}

export interface ISPList {
    Url: string;
    view: number;
}


