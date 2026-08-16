import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import useAuth from '../../hooks/useAuth';
import baseURL from '../../shared/baseURL';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { parseISO, startOfWeek, format } from 'date-fns';
import { groupBy } from 'lodash';
import { useLocation } from 'react-router-dom';

const COLORS = ['#82ca9d', '#ff6961', '#8884d8'];

const TransactionCharts = () => {
  const { auth } = useAuth();
  const fetch = useFetch();
  const { id } = useParams();
  const url = `${baseURL}transaction`;
  const navigate = useNavigate();
  const location = useLocation();

  const fetchTransaction = async () => {
    try {
      const result = await fetch(`${url}`, auth.accessToken);
      return result.data;
    } catch (error) {
      toast.error("Error fetching transaction's details");
    }
  };

  const { data, isLoading } = useQuery(["transaction"], fetchTransaction, {
    staleTime: 10000,
    refetchOnMount: "always"
  });

  // 🧠 Compute weekly trends
  const weeklyData = useMemo(() => {
    if (!data?.transactions) return [];

    const grouped = groupBy(data.transactions, (tx) =>
      format(startOfWeek(parseISO(tx.createdAt)), 'yyyy-MM-dd')
    );

    return Object.entries(grouped).map(([week, txs]) => {
      const summary = {
        week,
        Deposit: 0,
        Withdrawal: 0,
        Investment: 0
      };

      txs.forEach(tx => {
        if (summary[tx.type] !== undefined) {
          summary[tx.type] += tx.amount || 0;
        }
      });

      return summary;
    }).sort((a, b) => new Date(a.week) - new Date(b.week));
  }, [data]);

  // 📊 Total Summary for Bar & Pie Charts
  const totalSummary = useMemo(() => {
    if (!data?.transactions) return [];

    const summary = {
      Deposit: 0,
      Withdrawal: 0,
      Investment: 0
    };

    data.transactions.forEach(tx => {
      if (summary[tx.type] !== undefined) {
        summary[tx.type] += tx.amount || 0;
      }
    });

    return [
      { name: 'Deposit', value: summary.Deposit },
      { name: 'Withdrawal', value: summary.Withdrawal },
      { name: 'Investment', value: summary.Investment }
    ];
  }, [data]);

  return (
    <div className='pt-20 pb-10 bg-white px-4 md:px-8'>
      <h2 className="text-2xl font-bold mb-6">Transaction Visualizations</h2>

     <div>
        <div className={location.pathname === '/admin' ? 'grid grid-cols-1' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}>
          {/* Line Chart */}
          { location.pathname !== '/admin'&&
            <div className="mb-12">
            <h3 className="text-lg font-semibold mb-3">Weekly Transaction Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Deposit" stroke="#82ca9d" />
                <Line type="monotone" dataKey="Withdrawal" stroke="#ff6961" />
                <Line type="monotone" dataKey="Investment" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          }

          {/* Bar Chart */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold mb-3">Total Transaction Summary</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={totalSummary}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8">
                  {totalSummary.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          </div>
          {/* Pie Chart */}
          {location.pathname !== '/admin' &&
            <div>
            <h3 className="text-lg font-semibold mb-3">Transaction Type Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={totalSummary}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {totalSummary.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          }
      </div>
    </div>
  );
};

export default TransactionCharts;
