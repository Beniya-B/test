import React, {Component} from 'react';
import axios from "axios";
// import AddBook from './addBook'
import Home from './home'
import NonAdmin from './othersHome'

// import Admin from './admin';
import {BrowserRouter, Redirect, Route, Switch,useHistory} from "react-router-dom";

let endpoint="http://127.0.0.1:4000";

export default class Login extends Component{
    constructor(props) {
        super(props);
        this.state={
            email:null,
            password:null,
            role:null,
            validUser:false

        };
        this.handleevent = this.handleevent.bind(this);

    }

    authenticateUser=(formValue)=>{
        formValue.preventDefault();
        let data={
            email:this.state.email,
            password:this.state.password
        };
        axios.post(endpoint + "/api/login",data).then(res => {
            console.log("res.datq-------------",res.data)
            if(res.data.message==="user exist"){
                this.setState({
                    role:res.data.response.role,
                    validUser:true
                });
                // alert("Logged in successfully")
            }else if(res.data.message==="User Not Exist"){
                alert("Invalid Username and Please Enter Valid Username");
            }

        },(error) => {
            console.log(error);
        });

    };
    handleevent=(event)=>{
        const { name, value } = event.target;
        console.log("name,value--------------",name,value);
        this.setState({[event.target.name]:event.target.value})
    };
    render() {
        console.log("valid user------------",this.state.validUser,this.state.role);
        if(this.state.validUser===true && this.state.role==="admin"){
            // return (<AddBook />)
           return ( <div>
                <Route exact path="/">
                    <Redirect to="/home" /> : <Home />
                </Route>
            </div>
           )
        }else  if(this.state.validUser===true && this.state.role===""){
            // return (<AddBook />)
            return ( <div>
                    <Route exact path="/">
                        <Redirect to="/homepage" /> : <NonAdmin />
                    </Route>
                </div>
            )
        }
        return(
            <div>
                <form onSubmit={this.authenticateUser}>
                    <h1>Login</h1>
                    <p>username:</p>
                    <input
                        type="text" name="email" onChange={this.handleevent}
                    />
                    <p>password:</p>
                    <input
                        type="password" name="password" onChange={this.handleevent}
                    /><br/>
                    <button  type="submit" value="Submit">Submit</button>
                </form>
            </div>
        )
    }
}