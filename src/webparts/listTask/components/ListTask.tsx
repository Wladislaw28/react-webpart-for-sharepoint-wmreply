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
import {IListTaskState,ISPList,ISPLists } from './interface';
import Loadable from 'react-loadable';
import Loading from './loader/Loading';
import styles from './ListTask.module.scss';

const LoadableRenderLists = Loadable({
    loader: () => import(/* webpackChunkName: "renderlists" */'./RenderILists/RenderLists'),
    loading: Loading,
    timeout: 1000,
    delay: 200
});

const LoadableRenderItems = Loadable({
    loader: () => import(/* webpackChunkName: "renderitemss" */'./RenderItems/RenderItems'),
    loading: Loading,
    timeout: 1000,
    delay: 200
});

export default class ListTask extends React.Component<IListTaskProps, IListTaskState> {

    public state = {
        listData: [],
        listItemsData: [],
        listName: '',
        isOpenCreateList: false,
        newListName: ''
    };

    private onOpenForm(e) : void {
       e.preventDefault();
       this.setState({
           isOpenCreateList: !this.state.isOpenCreateList
       });
    }

    private onChnageInput({ target: { value } }): void {
        this.setState({
            newListName: value
        });
    }

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

    private _getFilterListAndItems(items: ISPList[]): Promise<ISPLists> {
        const idProps:string = this.props.dropdownProperty;
        const dataI: ISPList[] = items.filter((item) => item.Id === idProps);
       this.setState({
           listData: dataI,
           listName: dataI["0"].Title
       });
        return (this.props.filterItems === "" ? this.props.spHttpClient.get(
            `${this.props.listURL}/sites/Dev1/_api/web/lists/getbytitle('${this.state.listName}')/items?$top=${this.props.sliderNumber}`,
            SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) =>   {
                return response.json();
            }) :
            this.props.spHttpClient.get(
            `${this.props.listURL}/sites/Dev1/_api/web/lists/getbytitle('${this.state.listName}')/items?$top=${this.props.sliderNumber}?$filter=${this.props.filterItems}`,
            SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) =>   {
                return response.json();
            })) ;
    }

    private _renderAllList(items: ISPList[]): void {
        this.setState({
            listData: items
        });
    }

    private _renderList(items: ISPList[]) : void{
        this.setState({
            listItemsData: items
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
            this._getFilterListAndItems(response.value).then((responseItems) => {
                this._renderList(responseItems.value);
            });
        });
    }

    private _createList(newListName: string): void{
        const body: string = JSON.stringify({
            'Title': newListName,
            'BaseTemplate': 100,
            '__metadata': { 'type': 'SP.List' }
        });
        this.props.spHttpClient.post(`${this.props.listURL}/sites/Dev1/_api/web/lists`, SPHttpClient.configurations.v1, {
            headers: {
                "accept": "application/json;odata=verbose",
                "content-type": "application/json;odata=verbose",
                "odata-version": ""
            },
            body: body
        });
        alert(`${this.state.newListName} list is creating`);
        this.setState({
           isOpenCreateList: false,
           newListName: ''
        });
    }

  public render(): React.ReactElement<IListTaskProps> {
        const {listData, listName, listItemsData,isOpenCreateList,newListName} = this.state;
    // @ts-ignore
      return (
        <div className={styles.listTask}>
            <div className={styles.container}>
                <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}`}>
                    <div className="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">
                        <span className={styles.welcome_text}>Welcome to task by SharePoint!</span> <br/>
                        <p className="ms-font-l ms-fontColor-white">{escape(this.props.listURL)}</p>
                        {listData.length === 0 ?
                            <div>
                                 <h1>You have not selected a list</h1>
                                <button className={styles.button} onClick={(e)=>this.onOpenForm(e)}>
                                    {isOpenCreateList === true ? 'Close Form' : 'Create List'}</button>

                                {isOpenCreateList === true ?
                                    <div>
                                        <input type="text" onChange={(target) => this.onChnageInput(target)}/>
                                        <button className={styles.button} onClick={()=>this._createList(newListName)}>Create</button>
                                    </div>
                                    : null}
                             </div>
                            : null}
                        <button className={styles.button} onClick={()=>this._renderAllListAsync()}>View All List</button>
                        <button className={styles.button} onClick={()=>this._renderListAsync()}>View List</button>
                    </div>
                </div>
                <div>
                    {listData.length > 1 ? <LoadableRenderLists listData={listData} /> : null}
                </div>
                <div>
                    {listItemsData.length > 0 && listData.length <= 1 ?
                        <LoadableRenderItems listName={listName} listItemsData={listItemsData} /> : null }
                </div>
            </div>
        </div>
    );
  }
}
