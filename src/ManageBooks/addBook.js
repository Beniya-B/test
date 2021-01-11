import React, {Component} from 'react';
import axios from "axios";

let endpoint="http://127.0.0.1:4000";

export default class AddBook extends Component{

    constructor(props) {
        super(props);
        this.state={
            bookName:null,
            author:null,
            publisher:null,
            category:null,
            image:null
        };
        this.getBookDetails = this.getBookDetails.bind(this);
        this.fileInput = React.createRef();
    }


    getBookDetails=(event)=>{
        event.preventDefault();
        // let file=this.state.image;
        let file;
        console.log("this.fileInput.current.files",this.fileInput.current.files)
        if(this.fileInput.current.files.length>0){
            // alert(
            //     `Selected file - ${
            //         this.fileInput.current.files[0].name
            //         }`
            // );
            file=this.fileInput.current.files[0].name;
        }
        let payload = new FormData();
        let config = {
            headers : {
                'Content-Type' : 'multipart/form-data'
            }
        };
        payload.append('bookname',this.state.bookName);
        payload.append('author',this.state.author);
        payload.append('publisher',this.state.publisher);
        payload.append('category',this.state.category);
        payload.append('bookCover',file);
        axios.post(endpoint + "/api/addBook",payload,config).then(res => {
            console.log("res.datq-------------",res.data);
            if (res.data.result=== "Book added successfully"){
                alert("Book added successfully");
                window.location.reload();
            }

        },(error) => {
            console.log(error);
        });
    };
    handleOnChange=(event)=>{
        const { name, value } = event.target;
        console.log("name,value--------------",name,value);
        this.setState({[event.target.name]:event.target.value})
    };
    render() {
        console.log("this.state=------------",this.state);
        return(
            <div>
                <form onSubmit={this.getBookDetails}>
                    <h1>Add Book</h1>
                    <p>Enter book name:</p>
                    <input
                        type="text" name="bookName" onChange={this.handleOnChange}
                    />
                    <p>Enter author name:</p>
                    <input
                        type="text" name="author" onChange={this.handleOnChange}
                    />
                    <p>Enter publisher name:</p>
                    <input
                        type="text" name="publisher" onChange={this.handleOnChange}
                    />

                    <p>Enter book category:</p>
                    <input
                        type="text" name="category" onChange={this.handleOnChange}
                    /><br/>
                    <p htmlFor="image">Upload Image:</p>
                    <input type="file"
                           name="image" ref={this.fileInput} onChange={this.handleOnChange} required/><br/>
                    <button  type="submit" value="Submit">Submit</button>
                </form>
            </div>
        )
    }

}