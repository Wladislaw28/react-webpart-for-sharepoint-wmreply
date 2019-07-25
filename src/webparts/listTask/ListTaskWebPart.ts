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
    } from '@microsoft/sp-property-pane';

import { IODataList } from '@microsoft/sp-odata-types';
import { SPHttpClient, SPHttpClientConfiguration, SPHttpClientResponse,
    ODataVersion, ISPHttpClientConfiguration } from '@microsoft/sp-http';

import { escape } from '@microsoft/sp-lodash-subset';
import * as strings from 'ListTaskWebPartStrings';
import ListTask from './components/ListTask';
import { IListTaskProps } from './components/IListTaskProps';
import {IListTaskWebPartProps} from './components/interface';

export default class ListTaskWebPart extends BaseClientSideWebPart<IListTaskWebPartProps> {

    private dropdownOptions: IPropertyPaneDropdownOption[];
    private listsFetched: boolean;

    private fetchOptions(): Promise<IPropertyPaneDropdownOption[]> {
        let url = this.properties.listURL + `/_api/web/lists?$filter=Hidden eq false`;

        return this.fetchLists(url).then((response) => {
            let options: Array<IPropertyPaneDropdownOption> = new Array<IPropertyPaneDropdownOption>();
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

    private validateUrl(value: string): Promise<string>{
        return new Promise<string>((resolve: (validationErrorMessage: string) => void, reject: (error: any) => void): void => {
            this.context.spHttpClient.get(`${escape(value)}`, SPHttpClient.configurations.v1)
                .then((response: SPHttpClientResponse): void => {
                    if (response.ok) {
                        resolve('');
                        return;
                    }
                    else if (response.status === 404) {
                        resolve(`Site '${escape(value)}' doesn't exist`);
                        return;
                    }
                    else {
                        resolve(`Error: ${response.statusText}. Please try again`);
                        return;
                    }
                })
                .catch((error: any): void => {
                    resolve(error);
                });
        });
    }

  public render(): void {
    const element: React.ReactElement<IListTaskProps > = React.createElement(
      ListTask,
      {
          listURL: this.properties.listURL || this.context.pageContext.web.absoluteUrl,
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
              this.listsFetched = !this.listsFetched;
              this.context.propertyPane.refresh();
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
                      placeholder: "Input url's list",
                      onGetErrorMessage: this.validateUrl.bind(this),
                      deferredValidationTime: 500
                }),
                  PropertyPaneDropdown('dropdownProperty', {
                      label: 'List choice',
                      options: this.dropdownOptions
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
                  })

              ]
            }
          ]
        }
      ]
    };
  }
}
