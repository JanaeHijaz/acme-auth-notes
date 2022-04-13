import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';


const Notes = ({ notes, auth })=> {
console.log('auth:', auth, 'notes:', notes)
  return (
    <div>
      <Link to='/home'>Home</Link>
      <div>
        <h4> {auth.username}'s notes:</h4>
        <ul>
          { notes.map( note => {
          return(
            <li key={note.id}> {note.txt} </li>
          )
        })}
        </ul>
      </div>
    </div>
  );
};



export default connect(state => state)(Notes);
