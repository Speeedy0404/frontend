import React from 'react';
import '../DataDisplay.css';


const RelativeBreedingValueTable = ({ data }) => {
    // Проверка наличия данных
    const getValueOrDefault = (value) => (value !== undefined && value !== null ? value.toFixed(2) : '-');

    return (
        <div className="table-container">
            <h2 style={{ textAlign: 'center' }} >Относительная племенная ценность признаков молочной продуктивности</h2>
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
                        <td>RBVT</td>
                        <td>{data.conf.count_rbvt || '-'}</td>
                        <td>{getValueOrDefault(data.conf.avg_rbvt)}</td>
                        <td>{getValueOrDefault(data.conf.min_rbvt)}</td>
                        <td>{getValueOrDefault(data.conf.max_rbvt)}</td>
                        <td>{getValueOrDefault(data.conf.stddev_rbvt)}</td>
                        <td>{getValueOrDefault(data.median_conf.median_rbvt)}</td>
                    </tr>
                    <tr>
                        <td>RBVF</td>
                        <td>{data.conf.count_rbvf || '-'}</td>
                        <td>{getValueOrDefault(data.conf.avg_rbvf)}</td>
                        <td>{getValueOrDefault(data.conf.min_rbvf)}</td>
                        <td>{getValueOrDefault(data.conf.max_rbvf)}</td>
                        <td>{getValueOrDefault(data.conf.stddev_rbvf)}</td>
                        <td>{getValueOrDefault(data.median_conf.median_rbvf)}</td>
                    </tr>
                    <tr>
                        <td>RBVU</td>
                        <td>{data.conf.count_rbvu || '-'}</td>
                        <td>{getValueOrDefault(data.conf.avg_rbvu)}</td>
                        <td>{getValueOrDefault(data.conf.min_rbvu)}</td>
                        <td>{getValueOrDefault(data.conf.max_rbvu)}</td>
                        <td>{getValueOrDefault(data.conf.stddev_rbvu)}</td>
                        <td>{getValueOrDefault(data.median_conf.median_rbvu)}</td>
                    </tr>
                    <tr>
                        <td>RC</td>
                        <td>{data.conf.count_rc || '-'}</td>
                        <td>{getValueOrDefault(data.conf.avg_rc)}</td>
                        <td>{getValueOrDefault(data.conf.min_rc)}</td>
                        <td>{getValueOrDefault(data.conf.max_rc)}</td>
                        <td>{getValueOrDefault(data.conf.stddev_rc)}</td>
                        <td>{getValueOrDefault(data.median_conf.median_rc)}</td>
                    </tr>
                    <tr>
                        <td>RCHr</td>
                        <td>{data.reprod.count_rbv_crh || '-'}</td>
                        <td>{getValueOrDefault(data.reprod.avg_rbv_crh)}</td>
                        <td>{getValueOrDefault(data.reprod.min_rbv_crh)}</td>
                        <td>{getValueOrDefault(data.reprod.max_rbv_crh)}</td>
                        <td>{getValueOrDefault(data.reprod.stddev_rbv_crh)}</td>
                        <td>{getValueOrDefault(data.reprod_median.median_rbv_crh)}</td>
                    </tr>
                    <tr>
                        <td>RCTF</td>
                        <td>{data.reprod.count_rbv_ctfi || '-'}</td>
                        <td>{getValueOrDefault(data.reprod.avg_rbv_ctfi)}</td>
                        <td>{getValueOrDefault(data.reprod.min_rbv_ctfi)}</td>
                        <td>{getValueOrDefault(data.reprod.max_rbv_ctfi)}</td>
                        <td>{getValueOrDefault(data.reprod.stddev_rbv_ctfi)}</td>
                        <td>{getValueOrDefault(data.reprod_median.median_rbv_ctfi)}</td>
                    </tr>
                    <tr>
                        <td>RDO</td>
                        <td>{data.reprod.count_rbv_do || '-'}</td>
                        <td>{getValueOrDefault(data.reprod.avg_rbv_do)}</td>
                        <td>{getValueOrDefault(data.reprod.min_rbv_do)}</td>
                        <td>{getValueOrDefault(data.reprod.max_rbv_do)}</td>
                        <td>{getValueOrDefault(data.reprod.stddev_rbv_do)}</td>
                        <td>{getValueOrDefault(data.reprod_median.median_rbv_do)}</td>
                    </tr>
                    <tr>
                        <td>RF</td>
                        <td>{data.reprod.count_rf || '-'}</td>
                        <td>{getValueOrDefault(data.reprod.avg_rf)}</td>
                        <td>{getValueOrDefault(data.reprod.min_rf)}</td>
                        <td>{getValueOrDefault(data.reprod.max_rf)}</td>
                        <td>{getValueOrDefault(data.reprod.stddev_rf)}</td>
                        <td>{getValueOrDefault(data.reprod_median.median_rf)}</td>
                    </tr>
                    <tr>
                        <td>Rscs</td>
                        <td>{data.scs.count_scs || '-'}</td>
                        <td>{getValueOrDefault(data.scs.avg_scs)}</td>
                        <td>{getValueOrDefault(data.scs.min_scs)}</td>
                        <td>{getValueOrDefault(data.scs.max_scs)}</td>
                        <td>{getValueOrDefault(data.scs.stddev_scs)}</td>
                        <td>{getValueOrDefault(data.median_scs.median_scs)}</td>
                    </tr>
                    <tr>
                        <td>PI</td>
                        <td>{data.com.count_pi || '-'}</td>
                        <td>{getValueOrDefault(data.com.avg_pi)}</td>
                        <td>{getValueOrDefault(data.com.min_pi)}</td>
                        <td>{getValueOrDefault(data.com.max_pi)}</td>
                        <td>{getValueOrDefault(data.com.stddev_pi)}</td>
                        <td>{getValueOrDefault(data.median_com.median_pi)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default RelativeBreedingValueTable;