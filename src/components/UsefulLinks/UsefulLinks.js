import React from 'react';
import { ListGroup } from 'react-bootstrap';
import './UsefulLinks.css';

const UsefulLinks = () => {
    const links = [
        { name: 'CDN', path: 'https://www.cdn.ca/query/individual.php' },
        { name: 'VIT', path: 'https://bulli.vit.de/home' },
        { name: 'Viking', path: 'https://www.vikinggenetics.biz/poisk-byka' },
        { name: 'ABS', path: 'https://absbullsearch.absglobal.com/' },
        { name: 'ГИВЦ', path: 'http://plem.givc.by/glbdb.php?Pmn=2&Pms=0&Msg=0' },
    ];

    return (
        <div className="useful-links">
            <h5>Полезные ссылки</h5>
            <ListGroup variant="flush">
                {links.map((link, index) => (
                    <ListGroup.Item key={index} className="useful-link-item">
                        <a href={link.path}>{link.name}</a>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export default UsefulLinks;
