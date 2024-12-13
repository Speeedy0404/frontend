import React from 'react';
import '../DataDisplay.css';

const LakTable = ({ data }) => {
    const getValueOrDefault = (value) => (value !== undefined && value !== null ? value.toFixed(2) : '-');
    const getValue_OrDefault = (value) => (value !== undefined && value !== null ? value.toFixed(0) : '-');
    return (
        <div className="table-container">
            <h2 style={{ textAlign: 'center' }}>Молочная продуктивность</h2>
            <table>
                <thead>
                    <tr>
                        <th>Лактация</th>
                        <th>Количество</th>
                        <th>Удой кг</th>
                        <th>Жир кг</th>
                        <th>Жир %</th>
                        <th>Белок кг</th>
                        <th>Белок %</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>{getValue_OrDefault(data.lak_one.count_u305)}</td>
                        <td>{getValueOrDefault(data.lak_one.avg_u305)}</td>
                        <td>{getValueOrDefault(data.lak_one.avg_j305kg)}</td>
                        <td>{getValueOrDefault(data.lak_one.fat_percentage)}%</td>
                        <td>{getValueOrDefault(data.lak_one.avg_b305kg)}</td>
                        <td>{getValueOrDefault(data.lak_one.protein_percentage)}%</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>{getValue_OrDefault(data.lak_two.count_u305)}</td>
                        <td>{getValueOrDefault(data.lak_two.avg_u305)}</td>
                        <td>{getValueOrDefault(data.lak_two.avg_j305kg)}</td>
                        <td>{getValueOrDefault(data.lak_two.fat_percentage)}%</td>
                        <td>{getValueOrDefault(data.lak_two.avg_b305kg)}</td>
                        <td>{getValueOrDefault(data.lak_two.protein_percentage)}%</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>{getValue_OrDefault(data.lak_three.count_u305)}</td>
                        <td>{getValueOrDefault(data.lak_three.avg_u305)}</td>
                        <td>{getValueOrDefault(data.lak_three.avg_j305kg)}</td>
                        <td>{getValueOrDefault(data.lak_three.fat_percentage)}%</td>
                        <td>{getValueOrDefault(data.lak_three.avg_b305kg)}</td>
                        <td>{getValueOrDefault(data.lak_three.protein_percentage)}%</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default LakTable;