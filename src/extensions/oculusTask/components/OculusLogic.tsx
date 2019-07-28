import * as React from 'react';
import { SPHttpClient, HttpClientResponse,
    ISPHttpClientOptions, SPHttpClientResponse } from "@microsoft/sp-http";
import {
    ActionButton,
    IButtonProps
} from 'office-ui-fabric-react/lib/Button';

import styles from './StyleLinks.module.scss';
import { Guid } from "@microsoft/sp-core-library";

import {IOculusLogicProps, IOculusLogicState,
    ISPLists, ISPList} from './IOculusLogic';


export default class OculusLogic extends React.Component<IOculusLogicProps,IOculusLogicState>{

    public state ={
        counter: 1,
        listData: []
    };

    public componentDidMount() : void{
        this.getStartOculus();
    }

    private _getList() : Promise<ISPLists> {
        return this.props.spHttpClient.get(
            `${this.props.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('ListCount')/items`,
            SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
                return response.json();
            });
    }

    private _checkList(itemsOculusList: ISPList[]): void {
        if (itemsOculusList.length === 0){
            this._createItem(this.props.urlContext);
        } else{
            this.setState({
                listData: itemsOculusList
            }, () => {
                this.checkUrl(this.state.listData, this.props.urlContext);
            });
        }
    }

    private checkUrl(dataItems: ISPList[], urlContext: string): void {
        const itemData: ISPList[] = dataItems.filter(x => x.Url === urlContext );
        if (itemData.length !== 0) {
            const idItem: number = itemData['0'].Id;
            const countItem: number = itemData['0'].view;
            console.log(countItem);
            this.setState({
                counter: countItem
            },() => {
                this._updateItem(idItem, urlContext);
            });
        } else {
            this._createItem(urlContext);
        }
    }

    private _updateItem(id: number, url: string): void {
        const body: string = JSON.stringify({
            'view': this.state.counter + 1,
            'Url': url
        });
        this.props.spHttpClient.post(`${this.props.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('ListCount')/items(${id})`, SPHttpClient.configurations.v1, {
            headers: {
                'Accept': "application/json;odata=nometadata",
                'Content-type': "application/json;odata=nometadata",
                'odata-version': '',
                'IF-MATCH': '*',
                'X-HTTP-Method': 'MERGE'
            },
            body: body
        });
        const countAfterUpdate = this.state.counter + 1;
        this.setState({
            counter: countAfterUpdate
        });
    }

    private _createItem(url: string) : void {
        const body: string = JSON.stringify({
            'view': this.state.counter,
            'Url': url
        });
        this.props.spHttpClient.post(`${this.props.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('ListCount')/items`, SPHttpClient.configurations.v1, {
            body: body
        });
    }

    private getStartOculus(): void{
        this._getList().then((response) => {
            this._checkList(response.value);
        });
    }

    public render(): React.ReactElement<IOculusLogicProps>{
        return(
            <div className={styles.usefulLinks}>
                <div className={styles.itemsContainer}>
                    <ActionButton
                        iconProps={{ iconName: 'Glasses' }}
                        href={this.props.urlContext} >
                        {this.state.counter}
                     </ActionButton>
                </div>
            </div>
        );
    }
}
