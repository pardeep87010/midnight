import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Search, 
  Bell, 
  RefreshCw, 
  Layers, 
  Cpu, 
  Database,
  ArrowRight,
  Eye
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const QuickEscapeDecoy = () => {
  const { isQuickEscapeActive, setIsQuickEscapeActive } = useApp();
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isQuickEscapeActive) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-[#0b0f19] text-slate-200 font-mono text-xs overflow-y-auto p-4 sm:p-6 select-none">
      {/* Top Decoy Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center font-bold text-white text-sm">
            Δ
          </div>
          <div>
            <span className="font-bold tracking-wider text-slate-100 uppercase">
              APEX FINANCIAL TERMINAL v4.12
            </span>
            <span className="text-[10px] text-slate-500 block">
              Global Equities • Cloud Telemetry • Real-Time Order Routing
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 text-[11px] text-slate-400">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>NYSE/NASDAQ: OPEN</span>
            <span className="text-slate-600">|</span>
            <span>TIME: {time} EST</span>
          </div>

          {/* Discreet Re-entry button */}
          <button
            onClick={() => setIsQuickEscapeActive(false)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-1.5 rounded flex items-center space-x-2 transition-colors cursor-pointer"
            title="Resume session (ESC)"
          >
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[11px]">Resume Session</span>
            <kbd className="bg-slate-900 px-1 rounded text-[10px] text-slate-400">ESC</kbd>
          </button>
        </div>
      </div>

      {/* Market Tickers */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 my-4">
        {[
          { ticker: 'S&P 500', val: '5,648.40', chg: '+0.42%', up: true },
          { ticker: 'NASDAQ', val: '17,877.22', chg: '+0.88%', up: true },
          { ticker: 'DOW JONES', val: '41,288.78', chg: '-0.14%', up: false },
          { ticker: '10Y YIELD', val: '3.81%', chg: '-0.02', up: false },
          { ticker: 'EUR/USD', val: '1.1184', chg: '+0.15%', up: true },
          { ticker: 'AWS CLOUD LATENCY', val: '14.2ms', chg: 'NORMAL', up: true },
        ].map((item, i) => (
          <div key={i} className="bg-slate-900/90 border border-slate-800 p-2.5 rounded">
            <div className="text-[10px] text-slate-400">{item.ticker}</div>
            <div className="text-sm font-bold text-slate-100 mt-0.5">{item.val}</div>
            <div className={`text-[10px] flex items-center ${item.up ? 'text-emerald-400' : 'text-rose-400'}`}>
              {item.up ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {item.chg}
            </div>
          </div>
        ))}
      </div>

      {/* Main Terminal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Left Column: Cloud Telemetry */}
        <div className="bg-slate-900/90 border border-slate-800 rounded p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-slate-300 font-bold">
            <span className="flex items-center">
              <Cpu className="w-4 h-4 mr-1.5 text-blue-400" />
              INFRASTRUCTURE HEALTH
            </span>
            <span className="text-[10px] text-emerald-400">HEALTHY</span>
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Cluster A (us-east-1) CPU</span>
                <span>38.4%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[38%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Database Read Replicas (NVMe IOPS)</span>
                <span>61.2%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[61%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Kafka Message Throughput (1.4M msg/s)</span>
                <span>82.0%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[82%]"></div>
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-slate-950 rounded text-[10px] text-slate-400 font-mono space-y-1 mt-4">
            <div>[INFO 23:41:02] Distributed transaction coordinator heartbeat ok</div>
            <div>[INFO 23:41:14] Microservice gateway mesh routed 48,192 reqs</div>
            <div>[INFO 23:41:29] Zero packet loss across primary fiber backbones</div>
          </div>
        </div>

        {/* Center Column: Market News Feed */}
        <div className="bg-slate-900/90 border border-slate-800 rounded p-4 space-y-3 md:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-slate-300 font-bold">
            <span className="flex items-center">
              <Database className="w-4 h-4 mr-1.5 text-purple-400" />
              GLOBAL ECONOMIC & COMMODITY DISPATCH
            </span>
            <RefreshCw className="w-3.5 h-3.5 text-slate-500 cursor-pointer hover:text-slate-300" />
          </div>

          <div className="space-y-3">
            {[
              {
                time: '14:22',
                source: 'REUTERS',
                headline: 'Central Banks Signal Cautious Rate Trajectory Amid Global Supply Normalization',
                tag: 'MONETARY POLICY'
              },
              {
                time: '14:15',
                source: 'BLOOMBERG',
                headline: 'Semiconductor Demand Rebounds Driven by Next-Gen Enterprise AI Compute Architectures',
                tag: 'EQUITIES'
              },
              {
                time: '13:58',
                source: 'WALL ST JOURNAL',
                headline: 'Logistics Indices Show Shipping Container Freight Rates Stabilizing at Pre-Q3 Levels',
                tag: 'LOGISTICS'
              },
              {
                time: '13:40',
                source: 'FINANCIAL TIMES',
                headline: 'Treasury Yield Curve Steepens Following Strong Labor & Consumer Confidence Prints',
                tag: 'MACRO'
              }
            ].map((news, idx) => (
              <div key={idx} className="p-2.5 bg-slate-950/60 border border-slate-800/80 rounded hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-blue-400">{news.source}</span>
                    <span>{news.time}</span>
                  </div>
                  <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[9px] text-slate-300">{news.tag}</span>
                </div>
                <div className="text-xs text-slate-200 font-sans font-medium">{news.headline}</div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-between items-center text-[11px] text-slate-400">
            <span>Terminal status: Operational</span>
            <button 
              onClick={() => setIsQuickEscapeActive(false)}
              className="text-blue-400 hover:underline flex items-center"
            >
              Exit decoy & return to Velour <ArrowRight className="w-3 h-3 ml-1" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
