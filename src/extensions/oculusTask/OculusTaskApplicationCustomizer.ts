import * as React from "react";
import * as ReactDom from 'react-dom';
import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
    PlaceholderContent,
    PlaceholderName
} from '@microsoft/sp-application-base';
// @ts-ignore
import { Dialog } from '@microsoft/sp-dialog';
import { escape } from '@microsoft/sp-lodash-subset';
import styles from './AppCustomizer.module.scss';
import * as strings from 'OculusTaskApplicationCustomizerStrings';
import OculusLogic from './components/OculusLogic';
import {IOculusLogicProps} from './components/IOculusLogic';

const LOG_SOURCE: string = 'OculusTaskApplicationCustomizer';

export interface IOculusTaskApplicationCustomizerProperties {
    urlContext: string;
}

export default class OculusTaskApplicationCustomizer extends BaseApplicationCustomizer<IOculusTaskApplicationCustomizerProperties> {

    private _headerPlaceholder: PlaceholderContent;

    @override
     public onInit(): Promise<void> {
        console.log(`${LOG_SOURCE} Initialized ${strings.Title}. Property value: ${this.properties.urlContext}`);

        this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);
        this._renderPlaceHolders();
        return Promise.resolve();
    }

    private _renderPlaceHolders(): void {
        if (this._headerPlaceholderAvailableAndNotCreatedYet()) {
            this._headerPlaceholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Top, {
                onDispose: this._onDispose
            });

            if (!this._headerPlaceholder) {
                console.error(`${LOG_SOURCE} The expected placeholder (PageHeader) was not found.`);
                return;
            }

            if (this._headerPlaceholder.domElement) {
                const element: React.ReactElement<IOculusLogicProps> = React.createElement(
                    OculusLogic,
                    {
                        context: this.context,
                        urlContext: window.top.location.href
                    }
                );
                ReactDom.render(element, this._headerPlaceholder.domElement);
            }
        }
    }

    private _headerPlaceholderAvailableAndNotCreatedYet(): boolean {
        return !this._headerPlaceholder
            && this.context.placeholderProvider.placeholderNames.indexOf(PlaceholderName.Top) !== -1;
    }

    private _onDispose(): void {
        console.log(`${LOG_SOURCE} Dispossed`);
    }
}




// private _topPlaceholder: PlaceholderContent | undefined;
// private _bottomPlaceholder: PlaceholderContent | undefined;
//
// private _renderPlaceHolders(): void {
//     console.log("HelloWorldApplicationCustomizer._renderPlaceHolders()");
//     console.log(
//         "Available placeholders: ",
//         this.context.placeholderProvider.placeholderNames
//             .map(name => PlaceholderName[name])
//             .join(", ")
//     );
//
//     if (!this._topPlaceholder) {
//         this._topPlaceholder = this.context.placeholderProvider.tryCreateContent( //доступ к placeholder
//             PlaceholderName.Top,
//             { onDispose: this._onDispose }
//         );
//
//         if (!this._topPlaceholder) {
//             console.error("The expected placeholder (Top) was not found.");
//             return;
//         }
//
//         if (this.properties) {
//             let topString: string = this.properties.Top;
//             if (!topString) {
//                 topString = "(Top property was not defined.)";
//             }
//
//             if (this._topPlaceholder.domElement) {
//                 this._topPlaceholder.domElement.innerHTML = `
// 				<div class="${styles.app}">
// 					<div class="${styles.top}">
// 						<i class="ms-Icon ms-Icon--Info" aria-hidden="true"></i> ${escape(
//                     topString
//                 )}
// 					</div>
// 				</div>`;
//             }
//         }
//     }
//
//     if (!this._bottomPlaceholder) {
//         this._bottomPlaceholder = this.context.placeholderProvider.tryCreateContent(
//             PlaceholderName.Bottom,
//             { onDispose: this._onDispose }
//         );
//
//         // The extension should not assume that the expected placeholder is available.
//         if (!this._bottomPlaceholder) {
//             console.error("The expected placeholder (Bottom) was not found.");
//             return;
//         }
//
//         if (this.properties) {
//             let bottomString: string = this.properties.Bottom;
//             if (!bottomString) {
//                 bottomString = "(Bottom property was not defined.)";
//             }
//
//             if (this._bottomPlaceholder.domElement) {
//                 this._bottomPlaceholder.domElement.innerHTML = `
// 				<div class="${styles.app}">
// 					<div class="${styles.bottom}">
// 						<i class="ms-Icon ms-Icon--Info" aria-hidden="true"></i> ${escape(
//                     bottomString
//                 )}
// 					</div>
// 				</div>`;
//             }
//         }
//     }
// }
//
// private _onDispose(): void {
//     console.log('[HelloWorldApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
// }
