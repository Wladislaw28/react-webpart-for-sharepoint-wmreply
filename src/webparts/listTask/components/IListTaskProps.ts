import {SPHttpClient} from '@microsoft/sp-http';

import {
    IPropertyPaneDropdownOption,
} from '@microsoft/sp-property-pane';

export interface IListTaskProps {
    listURL: string;
    spHttpClient: SPHttpClient;
    sliderNumber: number;
    filterItems: string;
    dropdownProperty: any;
}
