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
    listName: string;
}

export default class ListTask extends React.Component<IListTaskProps, IListTaskState> {

    public state = {
        listData: [],
        listName: ''
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
            `${this.props.listURL}/sites/Dev1/_api/web/lists?$filter=Hidden eq false`,
            SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
                return response.json();
            });
    }

    // private _getItemsData(listName: string): Promise<ISPLists> {
    //     return this.props.spHttpClient.get(
    //         `${this.props.listURL}/sites/Dev1/_api/web/lists/getbytitle('${listName}')/items?$filter=Hidden eq false`,
    //         SPHttpClient.configurations.v1)
    //         .then((response: SPHttpClientResponse) => {
    //             console.log(response.json());
    //             return response.json();
    //         });
    // }

    private _renderList(items: ISPList[]): void {
        const idProps:string = this.props.dropdownProperty;
        const dataI: ISPList[] = items.filter((item) => item.Id === idProps);
       this.setState({
           listData: dataI,
           listName: dataI["0"].Title
       });
    }

    private _renderAllList(items: ISPList[]): void {
        this.setState({
            listData: items
        });
    }

    private _renderAllListAsync(): void {
        // Local environment
        if (Environment.type === EnvironmentType.Local) {
            this._getMockListData().then((response) => {
                this._renderAllList(response.value);
            });
        }
        else if (Environment.type == EnvironmentType.SharePoint ||
            Environment.type == EnvironmentType.ClassicSharePoint) {
            this._getListData().then((response) => {
                    this._renderAllList(response.value);
                });
        }
    }

    private _renderListAsync(): void {
        this._getListData().then((response) => {
            this._renderList(response.value);
        });
    }

  public render(): React.ReactElement<IListTaskProps> {
        const {listData, listName} = this.state;
    // @ts-ignore
      return (
        <div className={styles.listTask}>
            <div className={styles.container}>
                <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}`}>
                    <div className="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">
                        <span className="ms-font-xl ms-fontColor-white">Welcome to task by SharePoint!</span>
                        <p className="ms-font-l ms-fontColor-white">{escape(this.props.listURL)}</p>
                        <h1>{this.props.sliderNumber}</h1>
                        <button className={styles.button} onClick={()=>this._renderAllListAsync()}>View All List</button>
                        <button className={styles.button} onClick={()=>this._renderListAsync()}>View List</button>
                    </div>
                </div>
                <div className="spListContainer">
                    {listData.map((item) => (
                            <div className="spListContainerItem" key={item.Id}>{item.Title}</div>
                        ))}
                </div>
            </div>
        </div>
    );
  }
}
