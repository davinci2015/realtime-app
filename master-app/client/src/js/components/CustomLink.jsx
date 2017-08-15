import React from 'react';
import { Link } from 'react-router-dom';

function CustomLink({to, text, style}) {
    const styles = {
        haveAccText: style || {
            display: 'block',
            marginTop: 10,
            textDecoration: 'none',
            fontSize: 12,
            color: 'grey'
        }
    };

    return (
        <Link to={to} style={styles.haveAccText}>
            <span>{text}</span>
        </Link>
    )
}

export default CustomLink;
