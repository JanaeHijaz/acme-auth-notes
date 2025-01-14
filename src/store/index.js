import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import axios from 'axios';

const notes = (state = [], action)=> {
  if(action.type === 'GET_NOTES'){
    return action.notes;
  }
  if(action.type === 'DELETE_NOTE'){
    return state.filter(note => note.id !== action.note.id);
    // OJO: filter returns a new array. 
    // we are saying "we want you if your id doesn't match the id of what was clicked"
  }
  if(action.type === 'CREATE_NOTE'){
    return [...state, action.note];
  }
  return state;
};

const auth = (state = {}, action)=> {
  if(action.type === 'SET_AUTH'){
    return action.auth;
  }
  return state;
};

const logout = ()=> {
  window.localStorage.removeItem('token');
  return {
    type: 'SET_AUTH',
    auth: {}
  };
};

/* 
delete process is returning an error at first, then the thunk is working on the second time -_-
Uncaught Error: Actions must be plain objects. Instead, the actual type was: 'Promise'.
You may need to add middleware to your store setup to handle dispatching other values, 
such as 'redux-thunk' to handle dispatching functions.
*/
const deleteNote = (note) => {
  //console.log('NOTE HERE!!!!!!!!', note)
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    if(token){
      await axios.delete(`/api/notes/${note.id}`, {
        headers: {
          authorization: token
        }
      });
    }
    dispatch({ type: 'DELETE_NOTE', note });
  }
};

const getNotes = () => {
  return async(dispatch) => {
    // have to authorize user before getting the notes
    const token = window.localStorage.getItem('token');
    if(token){
      const response = await axios.get('/api/notes', {
        headers: {
          authorization: token
        }
      });
      dispatch({ type: 'GET_NOTES', notes: response.data });
    }
  }
};

const createNote = (txt) => {
  return async(dispatch) => {
    const token = window.localStorage.getItem('token');
    if(token){
      const response = await axios.post('/api/notes', { txt }, {
        headers: {
          authorization: token 
        }
      });
      dispatch({ type: 'CREATE_NOTE', note: response.data });
    } 
  }
};

const signIn = (credentials)=> {
  return async(dispatch)=> {
    let response = await axios.post('/api/auth', credentials);
    const { token } = response.data;
    window.localStorage.setItem('token', token);
    return dispatch(attemptLogin());
  }
};

const attemptLogin = ()=> {
  return async(dispatch)=> {
    const token = window.localStorage.getItem('token');
    if(token){
      const response = await axios.get('/api/auth', {
        headers: {
          authorization: token
        }
      });
      dispatch({ type: 'SET_AUTH', auth: response.data });
    }
  }
}

const store = createStore(
  combineReducers({
    auth,
    notes
  }),
  applyMiddleware(thunk, logger)
);

export { attemptLogin, signIn, logout, getNotes, createNote, deleteNote };

export default store;
