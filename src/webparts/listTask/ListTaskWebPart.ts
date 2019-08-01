import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
    IPropertyPaneConfiguration,
    PropertyPaneTextField,
    PropertyPaneSlider,
    } from '@microsoft/sp-property-pane';

import { IODataList } from '@microsoft/sp-odata-types';
import { SPHttpClient, SPHttpClientResponse} from '@microsoft/sp-http';

import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';
import pnp, { Web } from 'sp-pnp-js';
import { escape } from '@microsoft/sp-lodash-subset';
import * as strings from 'ListTaskWebPartStrings';
import ListTask from './components/ListTask';
import { IListTaskProps } from './components/IListTaskProps';
import {IListTaskWebPartProps} from './components/interface';
import {sp} from "@pnp/sp";

export default class ListTaskWebPart extends BaseClientSideWebPart<IListTaskWebPartProps> {

    // private dropdownOptions: IPropertyPaneDropdownOption[];
    // private listsFetched: boolean;

    private listDropdownDisabled: boolean = false;

    public onInit(): Promise<void> {
        return super.onInit().then(_ => {
            sp.setup({
                spfxContext: this.context.pageContext.web.absoluteUrl
            });
        });
    }

       // private fetchOptions(): Promise<IPropertyPaneDropdownOption[]> {
    //     let url = this.properties.listURL;
    //
    //     return this.fetchLists(url).then((response) => {
    //         let options: Array<IPropertyPaneDropdownOption> = new Array <IPropertyPaneDropdownOption>();
    //         response.map((list: IODataList) => {
    //             options.push( { key: list.Id, text: list.Title });
    //         });
    //         return options;
    //     });
    // }

//     private fetchLists(url: string) : Promise<any> {
//         let web = new Web(url);
//
//         return web.lists.filter('Hidden eq false').get().then((response) => {
//             if (response !== null) {
//                 return response;
//             } else {
//                 console.log("WARNING - failed to hit URL " + url + ". Error = " + response.statusText);
//                 return null;
//             }
// });
// }

    private validateUrl(value: string): Promise<string>{
        return new Promise<string>((resolve: (validationErrorMessage: any) => void, reject: (error: any) => void): void => {
            let web = new Web(value);

            web.get().then((response): void =>
            {
                    if (response !== null || response !== undefined) {
                        resolve('');
                        // this.listDropdownDisabled = false;
                        return;
                    }
                })
                .catch((): void => {
                    resolve(`Site '${escape(value)}' ${strings.ErrorMessage}`);
                    // this.listDropdownDisabled = true;
                });
        });
    }

  public render(): void {
    const element: React.ReactElement<IListTaskProps > = React.createElement(
      ListTask,
      {
          nameWebPart: this.properties.nameWebPart,
          listURL: this.properties.listURL || this.context.pageContext.web.absoluteUrl,
          sliderNumber: this.properties.sliderNumber,
          filterItems: this.properties.filterItems,
          selectItems: this.properties.selectItems,
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

      // if (!this.listsFetched) {
      //     this.fetchOptions().then((response) => {
      //         this.dropdownOptions = response;
      //         this.listsFetched = !this.listsFetched;
      //         this.context.propertyPane.refresh();
      //     });
      // }

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
                  PropertyPaneTextField('nameWebPart', {
                      label: strings.NameWebPartLabel,
                      placeholder: strings.PlacegolderNameWebPart
                  }),
                  PropertyPaneTextField('listURL', {
                  label: strings.ListURLFieldLabel,
                      placeholder: strings.PlacegolderListUrl,
                      onGetErrorMessage: this.validateUrl.bind(this),
                      deferredValidationTime: 500
                }),
                  PropertyFieldListPicker('dropdownProperty', {
                      label: strings.SelectListDropdawn,
                      includeHidden: false,
                      orderBy: PropertyFieldListPickerOrderBy.Title,
                      disabled: this.listDropdownDisabled,
                      onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                      properties: this.properties,
                      context: this.context,
                      onGetErrorMessage: null,
                      deferredValidationTime: 600,
                      key: 'listPickerFieldId',
                      webAbsoluteUrl: this.properties.listURL
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
                      placeholder: strings.PlacegolderFilterItems
                  }),
                  PropertyPaneTextField ('selectItems', {
                      label: strings.SelectFieldLabel,
                      placeholder: strings.PlacegolderSelectItems
                  })
              ]
            }
          ]
        }
      ]
    };
  }
}
