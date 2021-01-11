import React, {Component} from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from "axios";

let endpoint="http://127.0.0.1:4000";

class UpdateBook extends Component{

    constructor(props) {
        super(props);
        this.state={
            bookName:this.props.selected_book.bookName,
            author:this.props.selected_book.author,
            publisher:this.props.selected_book.publisher,
            category:this.props.selected_book.category,
            image:this.props.selected_book.img,
            readOnly:true
        };
        this.getBookDetails = this.getBookDetails.bind(this);
        this.fileInput = React.createRef();
        // console.log("props data=============",this.props.bookName)
    }

    // componentDidMount() {
    //     this.getFormData()
    // }
    //
    // getFormData=()=>{
    //     const location = useLocation();
    //     const data=location.query;
    //     console.log("location data================",data)
    // };


    getBookDetails=(event)=>{
        event.preventDefault();
        let file;
        console.log("state image---------------",typeof (this.fileInput.current.files))

        if(this.fileInput.current.files.length>0){
            // alert(
            //     `Selected file - ${
            //         this.fileInput.current.files[0].name
            //         }`
            // );
             file=this.fileInput.current.files[0].name;
        }else {
            file=this.state.image;
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
        console.log("payload================",this.props.selected_book)
        axios.post(endpoint + "/api/updateBook",payload,config).then(res => {
            console.log("res.data-------------",res.data);
            if (res.data.result=== "Updated"){
                alert("Updated successfully");
                window.history.back();
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
        console.log("props;...........this.props.selected_book.img...............",this.props.selected_book.img);
        // this.getFormData()

        return(
            <div>
                <form onSubmit={this.getBookDetails}>
                    <h1>Update Book</h1>
                    <p>Enter book name:</p>
                    <input
                        type="text" name="bookName" value={this.state.bookName} onChange={this.handleOnChange} readOnly={this.state.readOnly}
                    />
                    <p>Enter author name:</p>
                    <input
                        type="text" name="author" value={this.state.author} onChange={this.handleOnChange}
                    />
                    <p>Enter publisher name:</p>
                    <input
                        type="text" name="publisher" value={this.state.publisher} onChange={this.handleOnChange}
                    />

                    <p>Enter book category:</p>
                    <input
                        type="text" name="category" value={this.state.category} onChange={this.handleOnChange}
                    /><br/>
                    <p htmlFor="image">Upload Image:</p>
                    <input type="file"
                           name="image" ref={this.fileInput} onChange={this.handleOnChange}/><br/>
                    <button  type="submit" value="Submit">Submit</button>
                </form>
            </div>
        )
    }

}

const EditBook=()=>{
    const location = useLocation();
    const data=location.query;
    return(
        <div>
            <UpdateBook selected_book={data} />
        </div>
    )

};

export default EditBook