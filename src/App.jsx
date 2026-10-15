import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SmartSCMDashboard() {
  const [defectRate, setDefectRate] = useState(0.5); 
  const [leadTime, setLeadTime] = useState(8); 
  const [alphaShare, setAlphaShare] = useState(80);
  const [betaShare, setBetaShare] = useState(20);
  const [alertStyle, setAlertStyle] = useState("bg-green-500");
  const [systemMsg, setSystemMsg] = useState("Hệ thống hoạt động ổn định. Đang ưu tiên Alpha (80%).");

  const [inventoryData, setInventoryData] = useState([
    { day: 'Ngày 1', stock: 1200, rop: 680 },
    { day: 'Ngày 5', stock: 900, rop: 680 },
    { day: 'Ngày 10', stock: 600, rop: 680 },
    { day: 'Ngày 15', stock: 300, rop: 680 },
  ]);

  // Hàm gọi API thực tế tới Backend trên Render
  const handleSimulation = async () => {
    try {
      const response = await fetch('https://techone-backend.onrender.com/api/simulation/dual-sourcing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          alpha_defect_rate: defectRate,
          alpha_lead_time: leadTime,
          alpha_price: 250000,
          beta_price: 260000,
          order_volume: 1200
        })
      });

      const result = await response.json();

      if (result.status === "CRITICAL_RISK") {
        setAlertStyle("bg-red-600 animate-pulse");
      } else {
        setAlertStyle("bg-green-500");
      }
      
      setSystemMsg(result.ai_recommendation);
      setAlphaShare(result.dual_sourcing_allocation.alpha_percent);
      setBetaShare(result.dual_sourcing_allocation.beta_percent);

    } catch (error) {
      console.error("Lỗi kết nối tới Backend:", error);
      setSystemMsg("Lỗi kết nối máy chủ backend. Vui lòng thử lại!");
    }

    if (leadTime > 8) {
      const dynamicRop = (60 * leadTime) + 200; 
      const newData = inventoryData.map(item => ({ ...item, rop: dynamicRop }));
      setInventoryData(newData);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 font-sans">
      <h1 className="text-3xl font-bold mb-2 text-blue-400">TechOne Control Center</h1>
      <p className="text-slate-400 mb-8">Hệ thống Smart SCM & Phân tích rủi ro đa nguồn cung (Dual Sourcing)</p>

      <div className={`p-4 rounded-lg mb-8 transition-all duration-500 shadow-lg ${alertStyle}`}>
        <h2 className="text-xl font-bold">TRẠNG THÁI HỆ THỐNG:</h2>
        <p className="text-lg mt-1">{systemMsg}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h2 className="text-xl font-bold mb-6 text-orange-400">1. Bảng Nhập Liệu Mô Phỏng Rủi Ro</h2>
          
          <div className="mb-6">
            <label className="block mb-2 text-slate-300">Tỷ lệ lỗi thực tế của Alpha (AQL Threshold = 1.0%)</label>
            <input 
              type="range" min="0" max="3" step="0.1" 
              value={defectRate} 
              onChange={(e) => setDefectRate(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="text-right text-2xl font-bold text-red-400">{defectRate}%</div>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-slate-300">Thời gian giao hàng (Lead time) của Alpha</label>
            <input 
              type="range" min="5" max="15" step="1" 
              value={leadTime} 
              onChange={(e) => setLeadTime(parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="text-right text-2xl font-bold text-yellow-400">{leadTime} Ngày</div>
          </div>

          <button 
            onClick={handleSimulation}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded transition-colors"
          >
            Chạy Phân Tích (Run Simulation)
          </button>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col justify-center">
          <h2 className="text-xl font-bold mb-6 text-green-400">2. Quyết Định Điều Hướng (Order Allocation)</h2>
          
          <div className="flex justify-between items-end h-40 gap-4">
            <div className="w-1/2 bg-slate-700 rounded-t-lg relative flex flex-col justify-end transition-all duration-500" style={{ height: `${alphaShare}%` }}>
              <div className="text-center w-full bg-blue-500 py-2 rounded-t-lg font-bold">
                Alpha: {alphaShare}%
              </div>
            </div>
            
            <div className="w-1/2 bg-slate-700 rounded-t-lg relative flex flex-col justify-end transition-all duration-500" style={{ height: `${betaShare}%` }}>
              <div className="text-center w-full bg-orange-500 py-2 rounded-t-lg font-bold">
                Beta: {betaShare}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-slate-800 p-6 rounded-xl border border-slate-700 h-96">
        <h2 className="text-xl font-bold mb-4 text-purple-400">3. Digital Twin: Dynamic ROP (Điểm Đặt Hàng Tự Động)</h2>
        <ResponsiveContainer width="100%" height="80%">
          <LineChart data={inventoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="day" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }}/>
            <Legend />
            <Line type="monotone" dataKey="stock" name="Tồn kho thực tế (WIP)" stroke="#3b82f6" strokeWidth={3} />
            <Line type="stepAfter" dataKey="rop" name="Đường ROP Động" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
