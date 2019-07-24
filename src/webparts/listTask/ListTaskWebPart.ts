import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
    IPropertyPaneConfiguration,
    PropertyPaneTextField,
    PropertyPaneDropdown,
    IPropertyPaneDropdownOption
} from '@microsoft/sp-property-pane';

import * as strings from 'ListTaskWebPartStrings';
import ListTask from './components/ListTask';
import { IListTaskProps } from './components/IListTaskProps';
import styles from "./components/ListTask.module.scss";

export interface IListTaskWebPartProps {
    listName: string;
}

export default class ListTaskWebPart extends BaseClientSideWebPart<IListTaskWebPartProps> {

    // private lists: IPropertyPaneDropdownOption[];
    // private listsDropdownDisabled: boolean = true;


  public render(): void {
    const element: React.ReactElement<IListTaskProps > = React.createElement(
      ListTask,
      {
          listName: this.properties.listName,
          spHttpClient: this.context.spHttpClient
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
                  PropertyPaneTextField('listName', {
                  label: strings.ListNameFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
