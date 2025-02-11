import React, { useEffect } from 'react';
import '../IndividualDataDisplay.css';

const ParameterForecastingTable = ({ data, forecasting }) => {
    // Проверка наличия данных
    const getValueOrDefault = (value) => (value !== undefined && value !== null ? value.toFixed(3) : '-');

    // Форматирование значения с цветом в зависимости от знака
    const formatValueWithColor = (value) => {
        if (value === '-') {
            return value;
        }
        if (value === 0) {
            return value.toFixed(3);
        }
        const formattedValue = value >= 0 ? `+${value.toFixed(3)}` : value.toFixed(3);
        const colorClass = value >= 0 ? 'positive-value' : 'negative-value';
        return <span className={colorClass}>{formattedValue}</span>;
    };

    useEffect(() => {
    }, [data, forecasting]);

    return (
        <div className="table-container">
            <h2 style={{ textAlign: 'center' }}>Прогнозирование результатов закрепления</h2>
            <table>
                <thead>
                    <tr>
                        <th>Показатель</th>
                        <th>Среднее</th>
                        <th>Прогноз</th>
                        <th >Показатель</th>
                        <th>Среднее</th>
                        <th>Прогноз</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>EBV Молоко</td>
                        <td>{getValueOrDefault(data.milk.avg_ebv_milk)}</td>
                        <td>{formatValueWithColor(forecasting.milk)}</td>
                        <td >EBV CRH</td>
                        <td>{getValueOrDefault(data.reprod.avg_ebv_crh)}</td>
                        <td>{formatValueWithColor(forecasting.crh)}</td>
                    </tr>
                    <tr>
                        <td>EBV Жир %</td>
                        <td>{getValueOrDefault(data.milk.avg_ebv_fprc)}</td>
                        <td>{formatValueWithColor(forecasting.fprc)}</td>
                        <td >EBV CTFI</td>
                        <td>{getValueOrDefault(data.reprod.avg_ebv_ctfi)}</td>
                        <td>{formatValueWithColor(forecasting.ctfi)}</td>
                    </tr>
                    <tr>
                        <td>EBV Белок %</td>
                        <td>{getValueOrDefault(data.milk.avg_ebv_pprc)}</td>
                        <td>{formatValueWithColor(forecasting.pprc)}</td>
                        <td >EBV DO</td>
                        <td>{getValueOrDefault(data.reprod.avg_ebv_do)}</td>
                        <td>{formatValueWithColor(forecasting.do)}</td>
                    </tr>
                    <tr>
                        <td>EBV Жир кг</td>
                        <td>{getValueOrDefault(data.milk.avg_ebv_fkg)}</td>
                        <td>{formatValueWithColor(forecasting.fkg)}</td>
                        <td >EBV SCS</td>
                        <td>{getValueOrDefault(data.scs.avg_ebv_scs)}</td>
                        <td>{formatValueWithColor(forecasting.scs)}</td>
                    </tr>
                    <tr>
                        <td>EBV Белок кг</td>
                        <td>{getValueOrDefault(data.milk.avg_ebv_pkg)}</td>
                        <td>{formatValueWithColor(forecasting.pkg)}</td>
                    </tr>
                    <tr>
                        <td> </td>
                        <td> </td>
                        <td> </td>
                        <td> </td>
                        <td> </td>
                        <td> </td>
                    </tr>
                    <tr>
                        <td> </td>
                        <td> </td>
                        <td> </td>
                        <td> </td>
                        <td> </td>
                        <td> </td>
                    </tr>
                    <tr>
                        <td>Тип</td>
                        <td>{getValueOrDefault(data.conf.avg_ebv_tip)}</td>
                        <td>{formatValueWithColor(forecasting.tip)}</td>
                        <td >Постановка задних копыт</td>
                        <td>{getValueOrDefault(data.conf.avg_ebv_pzkop)}</td>
                        <td>{formatValueWithColor(forecasting.pzkop)}</td>
                    </tr>
                    <tr>
                        <td >Крепость телосложения</td>
                        <td>{getValueOrDefault(data.conf.avg_ebv_kt)}</td>
                        <td>{formatValueWithColor(forecasting.kt)}</td>
                        <td>Глубина вымени</td>
                        <td>{getValueOrDefault(data.conf.avg_ebv_gv)}</td>
                        <td>{formatValueWithColor(forecasting.gv)}</td>

                    </tr>
                    <tr>
                        <td>Рост</td>
                        <td>{getValueOrDefault(data.conf.avg_ebv_rost)}</td>
                        <td>{formatValueWithColor(forecasting.rost)}</td>
                        <td >Прикрепление передней долей вымени</td>
                        <td>{getValueOrDefault(data.conf.avg_ebv_pdv)}</td>
                        <td>{formatValueWithColor(forecasting.pdv)}</td>

                    </tr>
                    <tr>
                        <td >Глубина туловища</td>
                        <td>{getValueOrDefault(data.conf.avg_ebv_gt)}</td>
                        <td>{formatValueWithColor(forecasting.gt)}</td>
                        <td>Высота задней части вымени</td>
                        <td>{getValueOrDefault(data.conf.avg_ebv_vzcv)}</td>
                        <td>{formatValueWithColor(forecasting.vzcv)}</td>

                    </tr>
                    <tr>
                        <td>Положение зада</td>
                        <td>{getValueOrDefault(data.conf.avg_ebv_pz)}</td>
                        <td>{formatValueWithColor(forecasting.pz)}</td>
                        <td >Ширина задней части вымени</td>
                        <td>{getValueOrDefault(data.conf.avg_ebv_szcv)}</td>
                        <td>{formatValueWithColor(forecasting.szcv)}</td>
                    </tr>
                    <tr>
                        <td >Ширина зада</td>
                        <td>{getValueOrDefault(data.conf.avg_ebv_shz)}</td>
                        <td>{formatValueWithColor(forecasting.shz)}</td>
                        <td>Центральная связка (глубина доли)</td>
                        <td>{getValueOrDefault(data.conf.avg_ebv_csv)}</td>
                        <td>{formatValueWithColor(forecasting.csv)}</td>

                    </tr>
                    <tr>
                        <td>Постановка задних конечностей (сбоку)</td>
                        <td>{getValueOrDefault(data.conf.avg_ebv_pzkb)}</td>
                        <td>{formatValueWithColor(forecasting.pzkb)}</td>
                        <td >Расположение передних сосков</td>
                        <td>{getValueOrDefault(data.conf.avg_ebv_rps)}</td>
                        <td>{formatValueWithColor(forecasting.rps)}</td>

                    </tr>
                    <tr>
                        <td >Постановка задних конечностей (сзади)</td>
                        <td>{getValueOrDefault(data.conf.avg_ebv_pzkz)}</td>
                        <td>{formatValueWithColor(forecasting.pzkz)}</td>
                        <td>Расположение задних сосков</td>
                        <td>{getValueOrDefault(data.conf.avg_ebv_rzs)}</td>
                        <td>{formatValueWithColor(forecasting.rzs)}</td>

                    </tr>
                    <tr>
                        <td>Выраженность скакательного сустава</td>
                        <td>{getValueOrDefault(data.conf.avg_ebv_sust)}</td>
                        <td>{formatValueWithColor(forecasting.sust)}</td>
                        <td >Длина сосков (передних)</td>
                        <td>{getValueOrDefault(data.conf.avg_ebv_ds)}</td>
                        <td>{formatValueWithColor(forecasting.ds)}</td>
                    </tr>
                </tbody>
            </table>
        </div >
    );
};

export default ParameterForecastingTable;
