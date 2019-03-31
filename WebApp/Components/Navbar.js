import React from 'react';
import logoURL from '../logo.svg';

const propTypes = {

};

export default class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return ( <
            nav className = "navbar navbar-fixed-top" >
            <
            div className = "container" >
            <
            div className = "navbar-header" >
            <
            a className = "navbar-brand" >
            <
            img className = "img-responsive"
            src = {
                logoURL
            }
            alt = "" / >
            <
            /a> <
            /div> <
            /div> <
            /nav>
        );
    }
}

Navbar.propTypes = propTypes;
