import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
    IPropertyPaneConfiguration,
    PropertyPaneTextField,
    PropertyPaneSlider,
    } from '@microsoft/sp-property-pane';
import {sp} from "@pnp/sp";
import { PropertyFieldListPicker,
    PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';
import { escape } from '@microsoft/sp-lodash-subset';

import ListTask from './components/ListTask';
import { IListTaskProps } from './components/IListTaskProps';
import {IListTaskWebPartProps} from './components/interface';

import * as strings from 'ListTaskWebPartStrings';


export default class ListTaskWebPart extends BaseClientSideWebPart<IListTaskWebPartProps> {

    private listDropdownDisabled: boolean = false;

    public onInit(): Promise<void> {
        return super.onInit().then(_ => {
            sp.setup({
                spfxContext: this.context.pageContext.web.absoluteUrl
            });
        });
    }

    public onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
        if (propertyPath === 'listURL') {
            this.validateUrl(this.properties.listURL);
        }
    }

    private validateUrl(value: string): Promise<string>{
        // @ts-ignore
        return new Promise<string>(async (resolve: (validationErrorMessage: any) => void, reject: (error: any) => void): void => {
            const Web1 = (await import(/*webpackChunkName: '@pnp_sp' */ "@pnp/sp")).Web;
            let web = new Web1(value);

            web.get().then((response): void => {
                if (response !== null || response !== undefined) {
                    this.listDropdownDisabled = false;
                    this.context.propertyPane.refresh();
                    return;
                }
            })
                .catch((): void => {
                    alert(`Site '${escape(value)}' ${strings.ErrorMessage}`);
                    this.listDropdownDisabled = true;
                    this.context.propertyPane.refresh();
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
