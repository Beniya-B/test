import React, {Component} from 'react';
import '../style/tablestyle.css'
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";

let endpoint="http://127.0.0.1:4000";

export default class NonAdmin extends Component{

    constructor(props) {
        super(props);

        this.state = {
            list: [],
            editDetails:{},
            renderPage:null
        };
        this.updateStock = this.updateStock.bind(this);
    }

    componentDidMount() {
        this.getAllBooks();
    }

    updateStock (item) {
        console.log("bookname delet----------", item);
        let data={
            bookname:item.bookName
        };

        // if (window.confirm("Do you want to delete this book?")) {
            axios.post(endpoint + "/api/purchaseBook",data).then(res => {
                console.log("response inside the api", res.data);
                // alert(item.bookName+" book ordered successfully");
                // window.location.reload(true);
            }).catch(err => {
                console.warn(err.warn);
            });
        axios.post(endpoint + "/api/deleteBook",data).then(res => {
            // console.log("response inside the api", res.data);
            alert(item.bookName+" book ordered successfully");
            window.location.reload(true);
        }).catch(err => {
            console.warn(err.warn);
        });
        // }
    }

    getAllBooks=()=>{
        axios.get(endpoint + "/api/allBooks").then(res => {
            if(res.data){
                this.setState({list:res.data.result})
            }
            console.log("re data-------------",res.data)
        },(error) => {
            console.log(error);
        });
    };
    render() {
        let queryTableRows=
            this.state.list.map((items,index) =>{

                const {bookName,author,publisher,category,img}=items;
                return(
                    <tr key={index}>
                        <td>
                            {bookName}
                        </td>
                        <td>
                            {author}
                        </td>
                        <td>
                            {publisher}
                        </td>
                        <td>
                            {category}
                        </td>
                        <td>
                            {img}
                        </td>
                        <td>
                            <button onClick={this.updateStock.bind(this,items)}>Buy now</button>
                        </td>
                    </tr>
                )
            });
        let tableRows;
        if ( queryTableRows.length > 0 ) {
            tableRows=queryTableRows;
        }else {
            tableRows=<tr ><td colSpan={4}>
                <p>No Query available. Try creating one.</p></td>
            </tr>
        }
        return(
            <div className='App'>
                <h2>Welcome to Library</h2>
                <table className='query_list'>
                    <thead>
                    <tr>
                        <th>Book</th>
                        <th>Author</th>
                        <th>Publisher</th>
                        <th>Category</th>
                        <th>Image</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    { tableRows}
                    </tbody>
                </table>
                <Link style={{float:"left",fontSize:"19px",marginLeft:"1%"}} to={{pathname:'/'}}>Logout</Link>
            </div>
        );
    }

}