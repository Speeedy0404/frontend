import React, { useState } from 'react';
import {
    ResponsiveContainer,
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    LabelList
} from 'recharts';
import { Button, Stack, Typography, useMediaQuery } from '@mui/material';
import { useTheme as useCustomTheme } from "../ThemeContext";

const mockData = [
    { year: 2009, bulls_rm: 102, bulls_rm_heads: 276 },
    { year: 2010, bulls_rm: 105, bulls_rm_heads: 327 },
    { year: 2011, cows_rm: 96, cows_rm_heads: 177038, cows_rc: 98, cows_rc_heads: 16591, cows_rf: 99, cows_rf_heads: 135630, cows_rscs: 98, cows_rscs_heads: 71109, bulls_rm: 112, bulls_rm_heads: 276 },
    { year: 2012, cows_rm: 96, cows_rm_heads: 197511, cows_rc: 98, cows_rc_heads: 19725, cows_rf: 98, cows_rf_heads: 149944, cows_rscs: 98, cows_rscs_heads: 85203, bulls_rm: 115, bulls_rm_heads: 353 },
    { year: 2013, cows_rm: 96, cows_rm_heads: 215566, cows_rc: 97, cows_rc_heads: 24605, cows_rf: 97, cows_rf_heads: 161151, cows_rscs: 97, cows_rscs_heads: 108240, bulls_rm: 116, bulls_rm_heads: 319 },
    { year: 2014, cows_rm: 97, cows_rm_heads: 238026, cows_rc: 98, cows_rc_heads: 27706, cows_rf: 95, cows_rf_heads: 171607, cows_rscs: 97, cows_rscs_heads: 129380, bulls_rm: 116, bulls_rm_heads: 286 },
    { year: 2015, cows_rm: 98, cows_rm_heads: 250577, cows_rc: 97, cows_rc_heads: 33145, cows_rf: 95, cows_rf_heads: 180648, cows_rscs: 97, cows_rscs_heads: 147022, bulls_rm: 117, bulls_rm_heads: 341 },
    { year: 2016, cows_rm: 98, cows_rm_heads: 247631, cows_rc: 97, cows_rc_heads: 37586, cows_rf: 95, cows_rf_heads: 176628, cows_rscs: 96, cows_rscs_heads: 153646, bulls_rm: 119, bulls_rm_heads: 298 },
    { year: 2017, cows_rm: 100, cows_rm_heads: 253208, cows_rc: 101, cows_rc_heads: 35686, cows_rf: 96, cows_rf_heads: 164981, cows_rscs: 97, cows_rscs_heads: 167349, bulls_rm: 121, bulls_rm_heads: 256 },
    { year: 2018, cows_rm: 102, cows_rm_heads: 236176, cows_rc: 101, cows_rc_heads: 33158, cows_rf: 99, cows_rf_heads: 144283, cows_rscs: 102, cows_rscs_heads: 169429, bulls_rm: 125, bulls_rm_heads: 180 },
    { year: 2019, cows_rm: 105, cows_rm_heads: 219923, cows_rc: 100, cows_rc_heads: 33334, cows_rf: 102, cows_rf_heads: 129993, cows_rscs: 104, cows_rscs_heads: 147623, bulls_rm: 130, bulls_rm_heads: 59 },
    { year: 2020, cows_rm: 107, cows_rm_heads: 235410, cows_rc: 100, cows_rc_heads: 28926, cows_rf: 108, cows_rf_heads: 109268, cows_rscs: 105, cows_rscs_heads: 136380 },
    { year: 2021, cows_rm: 110, cows_rm_heads: 205213, cows_rc: 102, cows_rc_heads: 25063, cows_rf: 119, cows_rf_heads: 24531, cows_rscs: 108, cows_rscs_heads: 86768 },
    { year: 2022, cows_rm: 112, cows_rm_heads: 54559, cows_rc: 100, cows_rc_heads: 8312, cows_rf: 117, cows_rf_heads: 7, cows_rscs: 109, cows_rscs_heads: 3408 }
];



const parameters = ['rm', 'rc', 'rf', 'rscs'];

const GeneticTrendsChart = () => {
    const [animalType, setAnimalType] = useState('cows');
    const [parameter, setParameter] = useState('rm');
    const { isDarkMode } = useCustomTheme();
    const isSmallScreen = useMediaQuery('(max-width: 600px)');

    const paramKey = `${animalType}_${parameter}`;
    const headsKey = `${paramKey}_heads`;

    const isValidParameter = mockData.some(
        item => item[paramKey] !== undefined && item[headsKey] !== undefined
    );

    const filteredData = isValidParameter
        ? mockData.map(item => ({
            year: item.year,
            heads: item[headsKey],
            value: item[paramKey]
        }))
        : [];

    const labelColor = isDarkMode ? '#fff' : '#000';

    return (
        <div style={{ padding: '0 16px', maxWidth: '100%', boxSizing: 'border-box' }}>
            <Typography variant="h5" style={{ marginBottom: '10px' }}>Генетические тренды</Typography>

            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                justifyContent="center"
                alignItems="center"
                style={{ marginBottom: '20px', flexWrap: 'wrap' }}
            >
                <Button variant={animalType === 'cows' ? 'contained' : 'outlined'} onClick={() => setAnimalType('cows')}>Коровы</Button>
                <Button variant={animalType === 'bulls' ? 'contained' : 'outlined'} onClick={() => setAnimalType('bulls')}>Быки</Button>

                {parameters.map(param => (
                    <Button
                        key={param}
                        variant={parameter === param ? 'contained' : 'outlined'}
                        onClick={() => setParameter(param)}
                    >
                        {param.toUpperCase()}
                    </Button>
                ))}
            </Stack>

            <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={filteredData} margin={{ right: isSmallScreen ? 30 : 50 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#444' : '#ccc'} />
                    <XAxis dataKey="year" stroke={labelColor} interval={isSmallScreen ? 1 : 0} angle={isSmallScreen ? -45 : 0} textAnchor={isSmallScreen ? 'end' : 'middle'} height={isSmallScreen ? 60 : undefined} />
                    <YAxis
                        yAxisId="left"
                        stroke={labelColor}
                        label={{ value: 'Голов', angle: -90, position: 'insideLeft', fill: labelColor }}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke={labelColor}
                        domain={[70, 'auto']}
                        label={{ value: parameter.toUpperCase(), angle: 90, position: 'insideRight', fill: labelColor }}
                    />
                    <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#333' : '#fff', color: labelColor }} />
                    <Legend />
                    {isValidParameter && (
                        <>
                            <Bar yAxisId="left" dataKey="heads" fill="#8884d8" name="Голов">
                                <LabelList dataKey="heads" position="inside" style={{ fill: labelColor, fontSize: isSmallScreen ? 10 : 12 }} />
                            </Bar>
                            <Line yAxisId="right" type="monotone" dataKey="value" stroke="#82ca9d" name={parameter.toUpperCase()}>
                                <LabelList dataKey="value" position="top" style={{ fill: labelColor, fontSize: isSmallScreen ? 10 : 12 }} />
                            </Line>
                        </>
                    )}
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

export default GeneticTrendsChart;