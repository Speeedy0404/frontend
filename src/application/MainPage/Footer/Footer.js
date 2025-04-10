import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';

const links = [
    { name: 'CDN', path: 'https://www.cdn.ca/query/individual.php' },
    { name: 'VIT', path: 'https://bulli.vit.de/home' },
    { name: 'Viking', path: 'https://www.vikinggenetics.biz/poisk-byka' },
    { name: 'ABS', path: 'https://absbullsearch.absglobal.com/' },
    { name: 'ГИВЦ', path: 'http://plem.givc.by/glbdb.php?Pmn=2&Pms=0&Msg=0' },
];

const Footer = () => {
    return (
        <footer className="footer-custom">
            <Container>
                <Row>
                    <Col md={4} className="footer-col">
                        <h5>Контакты</h5>
                        <p>Адрес:  г. Минск, ул. Казинца, д. 88</p>
                        <p>Телефон: +375 (17) 374-63-74</p>
                        <p>Email: info@belplem.by</p>
                    </Col>
                    <Col md={4} className="footer-col">
                        <h5>Полезные ссылки</h5>
                        <div className="links-grid">
                            {links.map((link, index) => (
                                <a key={index} href={link.path} target="_blank" rel="noopener noreferrer" className="link-item">
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </Col>
                    <Col md={4} className="footer-col">
                        <h5>О нас</h5>
                        <p>Мы занимаемся оценкой сельскохозяйственных животных для улучшения племенных качеств и продуктивности.</p>
                    </Col>
                </Row>
                <Row>
                    <Col className="text-center">
                        <p>© 2024 - {new Date().getFullYear()} Белплемживобъединение. Все права защищены.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
