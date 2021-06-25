import React from 'react';
import './styles/generalDisplay.css';

export default function GeneralDisplay({ text, value }) {
    return (
        <div className="generalDisplay">
            {text}
            {value}
        </div>
    )
}
