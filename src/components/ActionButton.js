import React from 'react';
import './styles/actionButton.css';

export default function ActionButton({ text, callback }) {
    return (
        <div className="action-button" onClick={callback}>
            {text}
        </div>
    )
}
