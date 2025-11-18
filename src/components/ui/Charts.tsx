import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { ChartPriceProps } from '../../types';

const Charts: React.FC<ChartPriceProps> = ({ data, color }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-2xl shadow-md w-full">
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis
            dataKey="time"
            stroke="#ccc"
            tick={{ fontSize: 10 }}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="#ccc"
            tick={{ fontSize: 10 }}
            domain={['auto', 'auto']}
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              borderRadius: 8,
              border: 'none',
              fontSize: 12,
            }}
          />
          <Line type="monotone" dataKey="price" stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Charts;
