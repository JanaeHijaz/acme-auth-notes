import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createNote } from './store/index'

class CreateNote extends Component {
    constructor() {
        super();
        this.state = {
            txt: '',
            error: '' // error message part of demo @ ~54:00
        }
        //this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    async onSubmit(ev) {
        ev.preventDefault();
        try{
           //console.log(this.state) 
           await this.props.create(this.state.txt);
           this.setState({ txt: '', error: '' }) // this empties the form input field after submitting! 
        }
        catch(ex){
            console.log(ex.response.data);
            this.setState({ error: ex.response.data.error}) // error message part of demo @ ~54:00
        }
    }
    // onChange(ev) {
    //     const change = {};
    //     change[ev.target.name] = ev.target.value;
    //     this.setState(change);
    // } 
    // "name" not included in input form, so the above doesnt need to be there. 
    

    render() {
        const { txt } = this.state; // values that you want to update (from the state) => this.state
        const { onChange, onSubmit } = this; // functions/methods that you want to invoke => this
        return (
            <form onSubmit={ onSubmit }>
                <input value={ txt } onChange={ ev => this.setState({txt: ev.target.value}) }/> 
                <button> + </button>
            </form>
        );
    }
}

const mapDispatch = (dispatch) => {
    return {
        create: (txt) => {
            return dispatch(createNote(txt))
        }
    };
};

export default connect(null, mapDispatch)(CreateNote);