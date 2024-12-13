import React from 'react';
import '../IndividualDataDisplay.css';

const MilkTable = ({ data, data_second }) => {
    // Проверка наличия данных
    const getValueOrDefault = (value) => (value !== undefined && value !== null ? value.toFixed(2) : '-');

    return (
        <div className="table-container">
            <h2 style={{ textAlign: 'center' }}>Племенная ценность признаков молочной продуктивности</h2>
            <table>
                <thead>
                    <tr>
                        <th>Показатель</th>
                        <th>Количество</th>
                        <th>Среднее</th>
                        <th>Минимум</th>
                        <th>Максимум</th>
                        <th>Сигма</th>
                        <th>Медиана</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>EBV Молоко</td>
                        <td>{data.count_ebv_milk || '-'}</td>
                        <td>{getValueOrDefault(data.avg_ebv_milk)}</td>
                        <td>{getValueOrDefault(data.min_ebv_milk)}</td>
                        <td>{getValueOrDefault(data.max_ebv_milk)}</td>
                        <td>{getValueOrDefault(data.stddev_ebv_milk)}</td>
                        <td>{getValueOrDefault(data_second.median_ebv_milk)}</td>
                    </tr>
                    <tr>
                        <td>EBV Жир кг</td>
                        <td>{data.count_ebv_fkg || '-'}</td>
                        <td>{getValueOrDefault(data.avg_ebv_fkg)}</td>
                        <td>{getValueOrDefault(data.min_ebv_fkg)}</td>
                        <td>{getValueOrDefault(data.max_ebv_fkg)}</td>
                        <td>{getValueOrDefault(data.stddev_ebv_fkg)}</td>
                        <td>{getValueOrDefault(data_second.median_ebv_fkg)}</td>
                    </tr>
                    <tr>
                        <td>EBV Жир %</td>
                        <td>{data.count_ebv_fprc || '-'}</td>
                        <td>{getValueOrDefault(data.avg_ebv_fprc)}</td>
                        <td>{getValueOrDefault(data.min_ebv_fprc)}</td>
                        <td>{getValueOrDefault(data.max_ebv_fprc)}</td>
                        <td>{getValueOrDefault(data.stddev_ebv_fprc)}</td>
                        <td>{getValueOrDefault(data_second.median_ebv_fprc)}</td>
                    </tr>
                    <tr>
                        <td>EBV Белок кг</td>
                        <td>{data.count_ebv_pkg || '-'}</td>
                        <td>{getValueOrDefault(data.avg_ebv_pkg)}</td>
                        <td>{getValueOrDefault(data.min_ebv_pkg)}</td>
                        <td>{getValueOrDefault(data.max_ebv_pkg)}</td>
                        <td>{getValueOrDefault(data.stddev_ebv_pkg)}</td>
                        <td>{getValueOrDefault(data_second.median_ebv_pkg)}</td>
                    </tr>
                    <tr>
                        <td>EBV Белок %</td>
                        <td>{data.count_ebv_pprc || '-'}</td>
                        <td>{getValueOrDefault(data.avg_ebv_pprc)}</td>
                        <td>{getValueOrDefault(data.min_ebv_pprc)}</td>
                        <td>{getValueOrDefault(data.max_ebv_pprc)}</td>
                        <td>{getValueOrDefault(data.stddev_ebv_pprc)}</td>
                        <td>{getValueOrDefault(data_second.median_ebv_pprc)}</td>
                    </tr>
                    <tr>
                        <td>RBV Молоко</td>
                        <td>{data.count_rbv_milk || '-'}</td>
                        <td>{getValueOrDefault(data.avg_rbv_milk)}</td>
                        <td>{getValueOrDefault(data.min_rbv_milk)}</td>
                        <td>{getValueOrDefault(data.max_rbv_milk)}</td>
                        <td>{getValueOrDefault(data.stddev_rbv_milk)}</td>
                        <td>{getValueOrDefault(data_second.median_rbv_milk)}</td>
                    </tr>
                    <tr>
                        <td>RBV Жир %</td>
                        <td>{data.count_rbv_fprc || '-'}</td>
                        <td>{getValueOrDefault(data.avg_rbv_fprc)}</td>
                        <td>{getValueOrDefault(data.min_rbv_fprc)}</td>
                        <td>{getValueOrDefault(data.max_rbv_fprc)}</td>
                        <td>{getValueOrDefault(data.stddev_rbv_fprc)}</td>
                        <td>{getValueOrDefault(data_second.median_rbv_fprc)}</td>
                    </tr>
                    <tr>
                        <td>RBV Белок %</td>
                        <td>{data.count_rbv_pprc || '-'}</td>
                        <td>{getValueOrDefault(data.avg_rbv_pprc)}</td>
                        <td>{getValueOrDefault(data.min_rbv_pprc)}</td>
                        <td>{getValueOrDefault(data.max_rbv_pprc)}</td>
                        <td>{getValueOrDefault(data.stddev_rbv_pprc)}</td>
                        <td>{getValueOrDefault(data_second.median_rbv_pprc)}</td>
                    </tr>
                    <tr>
                        <td>RM</td>
                        <td>{data.count_rm || '-'}</td>
                        <td>{getValueOrDefault(data.avg_rm)}</td>
                        <td>{getValueOrDefault(data.min_rm)}</td>
                        <td>{getValueOrDefault(data.max_rm)}</td>
                        <td>{getValueOrDefault(data.stddev_rm)}</td>
                        <td>{getValueOrDefault(data_second.median_rm)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default MilkTable;