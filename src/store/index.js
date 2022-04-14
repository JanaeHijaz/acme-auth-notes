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

const deleteNote = async(note) => {
  console.log('NOTE HERE!!!!!!!!', note)
  //return async function(dispatch) {
    await axios.delete(`/api/notes/${note.id}`);
    store.dispatch({ type: 'DELETE_NOTE', note });
  //}
};

const getNotes = () => {
  return async(dispatch) => {
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

export { attemptLogin, signIn, logout, getNotes, deleteNote };

export default store;
