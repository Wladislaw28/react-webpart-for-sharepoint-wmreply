import * as React from 'react';

import { DetailsList, DetailsListLayoutMode, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import pnp, { Web } from 'sp-pnp-js';
import { IListTaskProps } from './IListTaskProps';
import { escape } from '@microsoft/sp-lodash-subset';
import {IListTaskState } from './interface';

import * as strings from 'ListTaskWebPartStrings';
import styles from './ListTask.module.scss';

export default class ListTask extends React.Component<IListTaskProps, IListTaskState> {

    public state = {
        listData: [],
        listItemsData: [],
        listName: '',
        yesOrNotList: false,
        columns: []
    };

    public componentDidMount() : void {
        this._checkList();
    }

    public componentWillReceiveProps(): void {
        this._checkList();
    }

    private _checkList(): void {
        if (this.props.dropdownProperty === undefined) {
            this.setState({
                yesOrNotList: true
            });
        } else {
            this.setState({
                yesOrNotList: false
            }, () => {
                this._getData();
            });
        }
    }

    private _getData(): void {
        let web = new Web(this.props.listURL);
        if (this.props.filterItems !== '') {
            web.lists.getById(this.props.dropdownProperty).items.top(this.props.sliderNumber).filter(this.props.filterItems).select(...this.props.selectItems.split(';')).get().then((response) => {
                this.setState({
                   listData: response,
                    columns: this._columsCreate(this.props.selectItems.split(';'))
                });
            });
        } else {
            web.lists.getById(this.props.dropdownProperty).items.top(this.props.sliderNumber).select(...this.props.selectItems.split(';')).get().then((response) => {
                this.setState({
                    listData: response,
                    columns: this._columsCreate(this.props.selectItems.split(';'))
                });
            });
        }
    }

    private _columsCreate(arraySelect: Array<any>): Array<IColumn> {
        const columns: IColumn[] = [];
        arraySelect.forEach((el, index) => {
            columns.push({
                key: `column${index}`,
                name: el,
                fieldName: el,
                minWidth: 70,
                maxWidth: 90,
                isResizable: true,
            });
        });
        return columns;
    }

  public render(): React.ReactElement<IListTaskProps> {
        const {listData, yesOrNotList, columns} = this.state;

    // @ts-ignore
      return (
        <div className={styles.listTask}>
            <div className={styles.container}>
                <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}`}>
                    <div className="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">
                        <span className={styles.welcome_text}>{this.props.nameWebPart}</span> <br/> <br/>
                        <span className={styles.welcome_text}>{strings.WelcomeTitle}</span> <br/>
                        <p className="ms-font-l ms-fontColor-white">{escape(this.props.listURL)}</p>
                        {yesOrNotList === true ? <h1 className={styles.headline}>{strings.ChoiceTheList}</h1> : null}
                    </div>
                </div>
                <div>
                    {listData.length > 1 ?
                        <DetailsList items={this.state.listData}
                                     columns={columns}
                                     setKey="set"
                                     layoutMode={DetailsListLayoutMode.justified}
                                     isHeaderVisible={true}
                                     selectionPreservedOnEmptyClick={true}
                                     enterModalSelectionOnTouch={true}
                                     ariaLabelForSelectionColumn="Toggle selection"
                                     ariaLabelForSelectAllCheckbox="Toggle selection for all items" /> : null}
                </div>
            </div>
        </div>
    );
  }
}
