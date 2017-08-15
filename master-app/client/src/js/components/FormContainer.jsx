import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';

class FormContainer extends Component {
    render() {
        const styles = {
            paper: {
                padding: '20px',
                borderRadius: '6px'
            }
        }

        return (
            <div className="formContainer">
                <div className="formContainer__form">
                    <Paper zDepth={2} style={styles.paper}>
                        <span className="formContainer__heading">{this.props.heading}</span>
                        <form className="form">
                            {this.props.children}
                        </form>
                    </Paper>
                </div>
            </div>
        );
    }
}

FormContainer.propTypes = {
    heading: PropTypes.string
}

export default FormContainer;
