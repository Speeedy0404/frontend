// HomePage с улучшенной адаптивной каруселью и стильными слайдами

import React, { useEffect, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { FaUser, FaHeadset, FaInfoCircle, FaChartBar, FaShieldAlt, FaSun, FaMoon, FaComments, FaArrowUp } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './HomePage.css';

const HomePage = () => {
    const [showScroll, setShowScroll] = useState(false);
    useEffect(() => {
        const onScroll = () => setShowScroll(window.scrollY > 300);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const fadeIn = {
        initial: { opacity: 0, y: 50 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
        viewport: { once: true }
    };

    return (
        <div className="home-page">

            {showScroll && (
                <button className="scroll-top" onClick={scrollToTop}>
                    <FaArrowUp />
                </button>
            )}

            <div className="hero-section">
                <h1>Умный подход к племенному учёту</h1>
                <p>Оптимизация, автоматизация и точность для вашего хозяйства</p>
            </div>


            <div className="carousel-wrapper">
                <Carousel className="home-carousel" fade>
                    {[{ name: 'АДОНИ САНДОР', id: '100900' }, { name: 'Маффи', id: '100877' }, { name: 'HEROS', id: '101425' }, { name: 'Нестер', id: '100441' }].map((bull, i) => (
                        <Carousel.Item key={i}>
                            <img
                                className="carousel-img"
                                src={`${process.env.REACT_APP_API_URL}/image/main/${i + 1}.jpg/`}
                                alt={`Слайд ${i + 1}`}
                            />
                            <Carousel.Caption className="custom-caption">
                                <h3>{bull.name}</h3>
                                <p>{bull.id}</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div>

            <div className="stats-section">
                <div className="stat"><h3>11.000+</h3><p>Зарегистрированных быков</p></div>
                <div className="stat"><h3>1.400.000+</h3><p>Зарегистрированных коров</p></div>
                <div className="stat"><h3>2600+</h3><p>Активных хозяйств</p></div>
                <div className="stat"><h3>99.9%</h3><p>Точность подбора</p></div>
            </div>

            <motion.div {...fadeIn}>
                <div className="about-section">
                    <h2><FaInfoCircle /> О нас</h2>
                    <p>
                        В современном сельском хозяйстве ведение племенного учёта и управление поголовьем скота играют ключевую роль в повышении продуктивности и эффективности животноводческих хозяйств. Мы разработали решение, которое помогает упростить эти процессы и сделать их более эффективными.
                    </p>
                    <p>
                        Наше интернет-приложение предназначено для оценки сельскохозяйственных животных и подбора производителей. Это важный инструмент для автоматизации племенного учёта, который предоставляет хозяйствам доступ к полным данным о состоянии и характеристиках их поголовья.
                    </p>
                    <p>
                        После авторизации пользователи могут:
                    </p>
                    <ul>
                        <li>Получать подробную информацию о своих животных — коровах и быках.</li>
                        <li>Анализировать статистику и показатели работы хозяйства.</li>
                        <li>Использовать удобный инструмент для подбора производителей с учётом генетических данных.</li>
                    </ul>
                    <h3>Ключевые функции приложения</h3>
                    <ol>
                        <li>
                            <strong>Закрепление быков за коровами</strong> с учётом генетических данных. Приложение позволяет применять различные фильтры для подбора подходящих животных, просматривать их характеристики и оценивать возможность закрепления.
                        </li>
                        <li>
                            <strong>Механизм проверки на инбридинг</strong>, который исключает возможность близкородственного скрещивания. Это способствует сохранению генетического разнообразия и повышению качества поголовья.
                        </li>
                        <li>
                            <strong>Автоматизация процессов</strong>, снижение ошибок и повышение эффективности. Приложение оптимизирует работу хозяйства, автоматизируя рутинные задачи и используя современные цифровые технологии.
                        </li>
                    </ol>
                    <h3>Цель проекта</h3>
                    <p>
                        Наша цель — обеспечить хозяйствам удобный доступ к данным о животных, ускорить процесс принятия решений при закреплении быков за коровами и минимизировать риск инбридинга с помощью встроенной системы проверки.
                    </p>
                    <p>
                        Мы стремимся упростить работу хозяйств, повысить точность анализа поголовья и оптимизировать племенную деятельность, внедряя современные цифровые решения для агробизнеса.
                    </p>
                </div>
            </motion.div>

            <motion.div {...fadeIn}>
                <div className="services-section">
                    <h2>Наши Услуги</h2>
                    <div className="services-grid">
                        <div className="service"><h3><FaUser /> Личный кабинет</h3><p>Управляй своим поголовьем и закреплениями.</p></div>
                        <div className="service"><h3><FaHeadset /> Поддержка</h3><p>Помощь на каждом этапе работы.</p></div>
                        <div className="service"><h3><FaInfoCircle /> Информация о быках</h3><p>Актуальные данные и фильтры.</p></div>
                        <div className="service"><h3><FaChartBar /> Аналитика</h3><p>Отчёты и визуализация показателей.</p></div>
                        <div className="service"><h3><FaShieldAlt /> Безопасность</h3><p>Надёжная защита информации.</p></div>
                    </div>
                </div>
            </motion.div>

            <motion.div {...fadeIn}>
                <div className="news-section">
                    <h2>Последние обновления</h2>
                    <div className="news-grid">
                        <div className="news-item"><div className="news-date">03.03.2025</div><h3>Обновление интерфейса</h3><p>Теперь поддержка всех устройств.</p></div>
                        <div className="news-item"><div className="news-date">02.03.2025</div><h3>Личные кабинеты</h3><p>Новая возможность для хозяйств.</p></div>
                        <div className="news-item"><div className="news-date">01.03.2025</div><h3>Новый проект</h3><p>Аналитика и визуализация в животноводстве.</p></div>
                    </div>
                </div>
            </motion.div>

            <motion.div {...fadeIn}>
                <div className="media-section">
                    <div className="video-section">
                        <h2>Видео экскурс (14:40-20:18)</h2>
                        <iframe
                            src="https://www.youtube.com/embed/Wxu_foE1By0?si=Yp3uAkq3_g_JoOFN&amp;start=880"
                            title="YouTube video"
                            frameBorder="0"
                            allowFullScreen
                            className="video-iframe"
                        ></iframe>
                    </div>

                    <div className="map-section">
                        <h2>Наше местоположение</h2>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2353.711000046265!2d27.503053597513386!3d53.848003901375556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dbd0f5f87e693f%3A0x91fff18e15bb06f!2z0YPQu9C40YbQsCDQmtCw0LfQuNC90YbQsCA4OCwg0JzQuNC90YHQuiwg0JzQuNC90YHQutCw0Y8g0L7QsdC70LDRgdGC0Yw!5e0!3m2!1sru!2sby!4v1740990739062!5m2!1sru!2sby"
                            allowFullScreen
                            loading="lazy"
                            className="map-iframe"
                        ></iframe>
                    </div>
                </div>
            </motion.div>

        </div>
    );
};

export default HomePage;
