import React, {Component} from 'react';
import '../style/tablestyle.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit,faTrash } from "@fortawesome/free-solid-svg-icons";
import {Link} from 'react-router-dom';
import AddBook from './addBook';
import UpdateBook from './updateBook';
import {BrowserRouter, Redirect, Route, Switch,useHistory} from "react-router-dom";



import axios from "axios";

let endpoint="http://127.0.0.1:4000";

export default class Home extends Component{

    constructor(props) {
        super(props);

        this.state = {
            list: [],
            editDetails:{},
            renderPage:null
        };
        this.deleteBook = this.deleteBook.bind(this);
    }

    componentDidMount() {
        this.getAllBooks();
    }

    deleteBook (item) {
        console.log("bookname delet----------", item);
        let data={
            bookname:item.bookName
        };

        if (window.confirm("Do you want to delete this book?")) {
            axios.post(endpoint + "/api/deleteBook",data).then(res => {
                // console.log("response inside the api", res.data);
                window.location.reload(true);
            }).catch(err => {
                console.warn(err.warn);
            });
        }
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
    handleOnclick=(data)=>{
        console.log("data>>>>>>>>>>>>>>>>>>>",data)
        return (<div>
            <UpdateBook >Hello {data}</UpdateBook>
        </div>)
    };

    onClickGoto=(event)=>{
        console.log("event$$$$$$$$$$$$$$$$$",event.target.value)
        let e=event.target.value;
        this.setState({
            renderPage:e
        })
        // if(e==="addBook"){
        //     return ( <div>
        //             {/*<Route exact path="/home">*/}
        //                 {/*<Redirect to="/add_book" /> : <AddBook />*/}
        //             {/*</Route>*/}
        //             <AddBook/>
        //         </div>
        //     )
        // }


    };

    render() {
        switch (this.state.renderPage) {
            case "addBook":
                return <AddBook />;
            // case 2:
            //     return <View2 />;
            // default:
            //     return <Main clickBtn={this.clickBtn} />;
        }
        let queryTableRows=
            this.state.list.map((items,index) =>{
                // console.log("items==========",items._id)
                // const {_id,queryname,author,query,descrip"bookName:" + obj.bookNametion,lastmodified}=items;
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
                            <Link to={{pathname:'/update',query:items
                            }}><FontAwesomeIcon style={{color:"white"}} icon={faEdit} /></Link>
                            {/*<button value="updateBook" onClick={()=>this.handleOnclick(items)}><FontAwesomeIcon icon={faEdit} /></button>*/}

                            <button onClick={this.deleteBook.bind(this,items)}><FontAwesomeIcon icon={faTrash} /></button>
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
                        <th>Book cover</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    { tableRows}
                    </tbody>
                </table>

                <button style={{float:"left",fontSize:"19px"}} value='addBook' onClick={this.onClickGoto}>Add Books</button>
            </div>
        );
    }

}