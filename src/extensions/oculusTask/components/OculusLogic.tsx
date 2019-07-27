import * as React from 'react';

import { SPHttpClient, HttpClientResponse, ISPHttpClientOptions, SPHttpClientResponse } from "@microsoft/sp-http";


import {IOculusLogicProps} from './IOculusLogic';

export default class OculusLogic extends React.Component<IOculusLogicProps, {}>{
    public render(): React.ReactElement<IOculusLogicProps>{
        return(
            <div>
                <h1>Hello, {this.props.urlContext}</h1>
            </div>
        );
    }
}
