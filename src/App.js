import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { attemptLogin, logout, getNotes } from './store';
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from './Home';
import Notes from './Notes';
import SignIn from './SignIn';


class App extends React.Component{
  componentDidMount(){
    this.props.attemptLogin();
  }
  // Notice that the message will be logged when you sign in, and when you refresh the page. 
  componentDidUpdate(prevProps){
    if(!prevProps.auth.id && this.props.auth.id){
      console.log("I logged in.")
      this.props.getNotes();
    }
  }
  render(){
    const { auth } = this.props;
    //console.log(auth);

    if(!auth.id){
      return (
        <Switch>
          <Route path='/signin' component={ SignIn } />
          <Route path='/' component={ SignIn }/>
        </Switch>
      );
    }
    else {
      return (
        <Switch>
          <Route path='/home' component={ Home } />
          <Route path='/notes' component={ Notes } />
          <Redirect to='/home' />
        </Switch>
      );
    }
  }
}

const mapState = state => state;
const mapDispatch = (dispatch)=> {
  return {
    getNotes: () => { // sending getNotes in as props.
      return dispatch(getNotes()) // don't necessarily need a return here like with attemptLogin. but should use it generally. 
    },
    attemptLogin: ()=> {
      return dispatch(attemptLogin());
    }
  }
}

export default connect(mapState, mapDispatch)(App);
