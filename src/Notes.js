import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteNote } from './store';


const Notes = ({ notes, auth, deleteNote })=> {
console.log('auth:', auth, 'notes:', notes)
  return (
    <div>
      <Link to='/home'>Home</Link>
      <div>
        <h4> {auth.username}'s notes:</h4>
        <ul>
          { notes.map( note => {
          return(
            <li key={note.id}> 
            {note.txt} 
            <button onClick={ () => deleteNote(note) }> x </button>
            </li>
          )
        })}
        </ul>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteNote: (note) => dispatch(deleteNote(note))
  }
}

export default connect(state => state, mapDispatchToProps)(Notes);
