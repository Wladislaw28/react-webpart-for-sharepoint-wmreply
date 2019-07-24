import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
    IPropertyPaneConfiguration,
    PropertyPaneTextField,
    PropertyPaneDropdown,
    IPropertyPaneDropdownOption,
    PropertyPaneSlider,
    PropertyPaneLink
    } from '@microsoft/sp-property-pane';

import { IODataList } from '@microsoft/sp-odata-types';
import { SPHttpClient, SPHttpClientConfiguration, SPHttpClientResponse,
    ODataVersion, ISPHttpClientConfiguration } from '@microsoft/sp-http';

import * as strings from 'ListTaskWebPartStrings';
import ListTask from './components/ListTask';
import { IListTaskProps } from './components/IListTaskProps';
import styles from "./components/ListTask.module.scss";
import {number} from "prop-types";

export interface IListTaskWebPartProps {
    listURL: string;
    sliderNumber: number;
    filterItems: string;
    dropdownProperty: any;
}

export default class ListTaskWebPart extends BaseClientSideWebPart<IListTaskWebPartProps> {

    private dropdownOptions: IPropertyPaneDropdownOption[];
    private listsFetched: boolean;

    private fetchOptions(): Promise<IPropertyPaneDropdownOption[]> {
        var url = this.context.pageContext.web.absoluteUrl + `/sites/Dev1/_api/web/lists?$filter=Hidden eq false`;

        return this.fetchLists(url).then((response) => {
            var options: Array<IPropertyPaneDropdownOption> = new Array<IPropertyPaneDropdownOption>();
            response.value.map((list: IODataList) => {
                options.push( { key: list.Id, text: list.Title });
            });
            return options;
        });
    }

    private fetchLists(url: string) : Promise<any> {
        return this.context.spHttpClient.get(url, SPHttpClient.configurations.v1).then((response: SPHttpClientResponse) => {
            if (response.ok) {
                return response.json();
            } else {
                console.log("WARNING - failed to hit URL " + url + ". Error = " + response.statusText);
                return null;
            }
        });
    }

  public render(): void {
    const element: React.ReactElement<IListTaskProps > = React.createElement(
      ListTask,
      {
          listURL: this.context.pageContext.web.absoluteUrl || this.properties.listURL,
          spHttpClient: this.context.spHttpClient,
          sliderNumber: this.properties.sliderNumber,
          filterItems: this.properties.filterItems,
          dropdownProperty: this.properties.dropdownProperty
      }
    );
    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {

      if (!this.listsFetched) {
          this.fetchOptions().then((response) => {
              this.dropdownOptions = response;
              this.listsFetched = true;
          });
      }

    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                  PropertyPaneTextField('listURL', {
                  label: strings.ListURLFieldLabel,
                      placeholder: "Input url's list"
                }),
                  PropertyPaneSlider('sliderNumber', {
                      label: 'Items',
                      min:1,
                      max:20,
                      value: strings.SliderItems,
                      showValue:true,
                      step:1
                  }),
                  PropertyPaneTextField ('filterItems', {
                      label: strings.FilterFieldLabel,
                      placeholder: "Input filter for rendering items"
                  }),
                  PropertyPaneDropdown('dropdownProperty', {
                      label: 'List choice',
                      options: this.dropdownOptions
                  })
              ]
            }
          ]
        }
      ]
    };
  }
}
