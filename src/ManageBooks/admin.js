import React, {Component} from 'react'
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
// import Welldashlayout from '../layouts/Welldashlayout';
import '../../../../well/scss/styles.scss';

export default class Admin extends Component {
    constructor(props) {
        super(props);
        const token = localStorage.getItem("token");
        let validUser = true;
        if (token == null) {
            validUser = false
        }
        this.state = {
            validUser
        };
    }

    render() {
        if (this.state.validUser === false) {
            return <Redirect to="/"/>
        }
        return (
            <div>
                <BrowserRouter>
                    <Switch>
                        <Route component={Welldashlayout}/>
                    </Switch>
                </BrowserRouter>

            </div>
        )

    }
}