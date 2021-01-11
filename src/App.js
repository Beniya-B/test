import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import EditBook from './ManageBooks/updateBook'
import NonAdmin from './ManageBooks/othersHome'
import AddBook from './ManageBooks/addBook'
import Home from './ManageBooks/home'
import Login from './ManageBooks/login'

import './App.css';

function App() {
  return (

  <BrowserRouter>
    <Switch>
      <Route exact path="/homepage" component={NonAdmin} />
      <Route exact path="/update" component={EditBook} />
      <Route exact path="/home" component={Home} />
      <Route exact path="/add_book" component={AddBook} />
      <Route exact path="/" component={Login} />
    </Switch>
  </BrowserRouter>
  );
}

export default App;
