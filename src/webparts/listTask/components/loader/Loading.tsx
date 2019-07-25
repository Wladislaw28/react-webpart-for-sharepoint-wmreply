import * as React from 'react';
import {LoadingComponentProps } from 'react-loadable';
import Loader from 'react-loader-spinner';

export default class Loading extends React.Component<LoadingComponentProps, {}> {
    public render() {
        return(
            <Loader
                type="Puff"
                color="#00BFFF"
                height="100"
                width="100"
            />
        );
    }
}
