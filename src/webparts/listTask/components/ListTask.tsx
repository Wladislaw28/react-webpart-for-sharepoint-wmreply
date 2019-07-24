import * as React from 'react';
import {
    Environment,
    EnvironmentType
} from '@microsoft/sp-core-library';

import MockHttpClient from '../MockHttpClient';
import {
    SPHttpClient,
    SPHttpClientResponse
} from '@microsoft/sp-http';
import { IListTaskProps } from './IListTaskProps';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './ListTask.module.scss';

export interface ISPLists {
    value: ISPList[];
}

export interface ISPList {
    Title: string;
    Id: string;
}

export interface IListTaskState {
    listData: ISPList[];
}

export default class ListTask extends React.Component<IListTaskProps, IListTaskState> {

    public state = {
        listData: []
    };

    private _getMockListData(): Promise<ISPLists> {
        return MockHttpClient.get()
            .then((data: ISPList[]) => {
                var listDataMock: ISPLists = { value: data };
                console.log(listDataMock.value);
                return listDataMock;
            }) as Promise<ISPLists>;
    }

    private _getListData(): Promise<ISPLists> {
        return this.props.spHttpClient.get(
            `https://mihasev28wmreply.sharepoint.com/sites/Dev1/_api/web/lists?$filter=Hidden eq false`,
            SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
                return response.json();
            });
    }

    private _renderList(items: ISPList[]): void {
       this.setState({
           listData: items
       });
    }

    private _renderListAsync(): void {
        // Local environment
        if (Environment.type === EnvironmentType.Local) {
            this._getMockListData().then((response) => {
                this._renderList(response.value);
                console.log(response.value);
            });
        }
        else if (Environment.type == EnvironmentType.SharePoint ||
            Environment.type == EnvironmentType.ClassicSharePoint) {
            this._getListData()
                .then((response) => {
                    this._renderList(response.value);
                    console.log(response.value);
                });
        }
    }

  public render(): React.ReactElement<IListTaskProps> {
        const {listData} = this.state;
    // @ts-ignore
      return (
        <div className={styles.listTask}>
            <div className={styles.container}>
                <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}`}>
                    <div className="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">
                        <span className="ms-font-xl ms-fontColor-white">Welcome to SharePoint!</span>
                        <p className="ms-font-l ms-fontColor-white">Customize SharePoint experiences using web parts.</p>
                        <p className="ms-font-l ms-fontColor-white">{escape(this.props.listName)}</p>
                        <a href="https://aka.ms/spfx" className={styles.button}>
                            <span className={styles.label}>Learn more</span>
                        </a>
                        <button className={styles.button} onClick={()=>this._renderListAsync()}>View List</button>
                    </div>
                </div>
                <div id="spListContainer">
                    {listData.map((item) => (
                            <div key={item.Id}>{item.Title}</div>
                        ))}
                </div>
            </div>
        </div>
    );
  }
}
