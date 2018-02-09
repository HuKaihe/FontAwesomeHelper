import React from 'react';
import iconClassList from '../iconClass.json';

export default function () {
    return (
        <ul>
            {
                iconClassList.slice(0, 100).map(item => (
                    <li key={item}>
                        <i className={`fa ${item}`} />
                        {item}
                    </li>
                ))
            }
        </ul>
    );
}

