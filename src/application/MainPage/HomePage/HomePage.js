import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="home-page">
            <Carousel className="home-carousel">
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://avatars.dzeninfra.ru/get-zen_doc/3385297/pub_5fef0708d1a90641ca1142b0_5fef076abb14d54ffbb08ff2/scale_1200"
                        alt="First slide"
                    />
                    <Carousel.Caption>
                        <h3>Бычок</h3>
                        <p>Красивый бычок</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://expo.vdnh.ru/upload/iblock/d46/01.jpg"
                        alt="Second slide"
                    />
                    <Carousel.Caption>
                        <h3>Бычок</h3>
                        <p>Красивый бычок</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://expo.vdnh.ru/upload/iblock/a6a/02.jpg"
                        alt="Third slide"
                    />
                    <Carousel.Caption>
                        <h3>Бычок</h3>
                        <p>Красивый бычок</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>

            <div className="about-section">
                <h2>О нас</h2>
                <p>
                    В современном сельском хозяйстве ведение племенного учёта и управление поголовьем скота играет ключевую роль в повышении продуктивности и эффективности животноводческих хозяйств.
                </p>
                <p>
                    Для автоматизации и упрощения этих процессов мы разработали интернет-приложение, предназначенное для оценки сельскохозяйственных животных и подбора производителей. Данное приложение является важным инструментом для животноводческих хозяйств, предоставляя пользователям доступ к данным о состоянии и характеристиках их поголовья.
                </p>
                <p>
                    После авторизации пользователи могут:
                </p>
                <ul>
                    <li>Просматривать информацию о своих коровах и быках.</li>
                    <li>Анализировать статистику хозяйства.</li>
                    <li>Использовать инструмент для подбора производителей.</li>
                </ul>
                <h3>Ключевые функции приложения</h3>
                <ol>
                    <li>
                        Закрепление быков за коровами с учётом генетических данных. Пользователь может применять различные фильтры для выбора подходящих животных, просматривать их характеристики и оценивать возможность закрепления.
                    </li>
                    <li>
                        Встроенный механизм проверки на инбридинг**, который исключает вероятность близкородственного скрещивания, способствуя сохранению генетического разнообразия и повышению качества поголовья.
                    </li>
                    <li>
                        Автоматизация рутинных процессов, снижение риска ошибок при подборе пар и повышение эффективности животноводства за счёт использования современных цифровых технологий.
                    </li>
                </ol>
                <h3>Цель проекта</h3>
                <p>
                    Приложение обеспечивает удобный доступ к данным о животных, улучшает процесс принятия решений при закреплении быков за коровами, а также минимизирует риск инбридинга за счёт встроенной системы проверки.
                </p>
                <p>
                    Наш инструмент предназначен для упрощения работы хозяйств, повышения точности анализа поголовья и оптимизации племенной деятельности посредством использования современных цифровых решений.
                </p>
            </div>


            <div className="services-section">
                <h2>Наши Услуги</h2>
                <div className="services-grid">
                    <div className="service">
                        <h3>Личный кабинет</h3>
                        <p>
                            Получите доступ к персональному <strong>личному кабинету</strong>, позволяющему самостоятельно производить закрепления животных, управлять данными о поголовье и отслеживать статистику в режиме реального времени.
                        </p>
                    </div>
                    <div className="service">
                        <h3>Сопровождение и поддержка</h3>
                        <p>
                            Наша команда экспертов готова предоставить <strong>консультации</strong> и техническую поддержку на каждом этапе работы. Мы поможем вам максимально эффективно использовать все возможности приложения.
                        </p>
                    </div>
                    <div className="service">
                        <h3>Информация о быках и семени</h3>
                        <p>
                            Получите доступ к актуальной и подробной <strong>информации о производителях</strong> и наличии семени. Используйте расширенные фильтры для подбора оптимальных быков с учётом генетических характеристик.
                        </p>
                    </div>
                    <div className="service">
                        <h3>Аналитика и отчёты</h3>
                        <p>
                            Используйте встроенные инструменты для <strong>анализа данных</strong>. Формируйте отчёты о продуктивности, отслеживайте динамику показателей и принимайте обоснованные решения на основе актуальной информации.
                        </p>
                    </div>
                    <div className="service">
                        <h3>Безопасность данных</h3>
                        <p>
                            Мы обеспечиваем высокий уровень <strong>защиты вашей информации</strong>. Все данные хранятся безопасно, а доступ к системе осуществляется по защищённым каналам связи.
                        </p>
                    </div>
                </div>
            </div>


            <div className="news-section">
                <h2>Последние обновления</h2>
                <div className="news-grid">
                    <div className="news-item">
                        <div className="news-date">03.03.2025</div>
                        <h3>Обновление интерфейса</h3>
                        <p>Обновлен интерфейс приложения. Теперь он корректно отображается на большинстве устройств.</p>
                    </div>
                    <div className="news-item">
                        <div className="news-date">02.03.2025</div>
                        <h3>В разработке: Личные кабинеты</h3>
                        <p>Мы активно работаем над созданием личных кабинетов для хозяйств по договорам.</p>
                    </div>
                    <div className="news-item">
                        <div className="news-date">01.03.2025</div>
                        <h3>Запуск нового проекта</h3>
                        <p>Представляем новый проект по анализу данных в животноводстве.</p>
                    </div>
                </div>
            </div>


            <div className="media-section">
                <div className="video-section">
                    <h2>Видео экскурс (14:40-20:18)</h2>
                    <iframe
                        src="https://www.youtube.com/embed/Wxu_foE1By0?si=Yp3uAkq3_g_JoOFN&amp;start=880"
                        title="YouTube video"
                        frameBorder="0"
                        allowFullScreen
                    ></iframe>
                </div>

                <div className="map-section">
                    <h2>Наше местоположение</h2>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2353.711000046265!2d27.503053597513386!3d53.848003901375556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dbd0f5f87e693f%3A0x91fff18e15bb06f!2z0YPQu9C40YbQsCDQmtCw0LfQuNC90YbQsCA4OCwg0JzQuNC90YHQuiwg0JzQuNC90YHQutCw0Y8g0L7QsdC70LDRgdGC0Yw!5e0!3m2!1sru!2sby!4v1740990739062!5m2!1sru!2sby"
                        allowFullScreen
                        loading="lazy"
                    ></iframe>
                </div>
            </div>

        </div>
    );
};

export default HomePage;
