import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function SmartSCMControlCenter() {
  // --- BIẾN SỐ NỘI BỘ (TECHONE) ---
  const [aqlThreshold, setAqlThreshold] = useState(1.0);
  const [dailyDemand, setDailyDemand] = useState(60);   
  const [safetyStock, setSafetyStock] = useState(200);  
  const [orderVolume, setOrderVolume] = useState(1200); 

  // --- BIẾN SỐ RỦI RO (NHÀ CUNG CẤP) ---
  const [defectRate, setDefectRate] = useState(0.5);    
  const [leadTime, setLeadTime] = useState(8);          

  // --- TRẠNG THÁI KẾT QUẢ ---
  const [alphaShare, setAlphaShare] = useState(60);
  const [betaShare, setBetaShare] = useState(30);
  const [gammaShare, setGammaShare] = useState(10);
  
  const [statusStyle, setStatusStyle] = useState("bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]");
  const [systemMsg, setSystemMsg] = useState("Hệ thống ổn định. Đang vận hành chiến lược Tri-Sourcing (Alpha 60% - Beta 30% - Gamma 10%).");
  const [dynamicRop, setDynamicRop] = useState(680);
  const [deltaCost, setDeltaCost] = useState(0);
  const [isCritical, setIsCritical] = useState(false);

  // THUẬT TOÁN AI
  const handleRunSimulation = () => {
    const calculatedRop = Math.round((dailyDemand * leadTime) + safetyStock);
    setDynamicRop(calculatedRop);

    let alpha = 60, beta = 30, gamma = 10;
    let msg = "", critical = false, style = "";

    if (defectRate > aqlThreshold) {
      alpha = 0; beta = 70; gamma = 30;
      critical = true;
      style = "bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse shadow-[0_0_30px_rgba(225,29,72,0.4)]";
      msg = `⚠️ BÁO ĐỘNG SMT: Lỗi Alpha (${defectRate}%) vượt AQL. Kích hoạt khẩn cấp: Ngắt PO Alpha, chuyển sang Beta (70%) & Gamma (30%)!`;
    } else {
      critical = false;
      style = "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]";
      msg = `Chuỗi cung ứng an toàn. Tỷ lệ lỗi (${defectRate}%) đạt chuẩn. Giữ nguyên cấu trúc Multi-Sourcing.`;
    }

    setAlphaShare(alpha); setBetaShare(beta); setGammaShare(gamma);
    setStatusStyle(style); setSystemMsg(msg); setIsCritical(critical);

    const priceAlpha = 250000, priceBeta = 260000, priceGamma = 245000;
    const baseCost = (0.6 * priceAlpha + 0.3 * priceBeta + 0.1 * priceGamma) * orderVolume;
    const newCost = ((alpha / 100) * priceAlpha + ((beta / 100) * priceBeta) + ((gamma / 100) * priceGamma)) * orderVolume;
    setDeltaCost(newCost - baseCost);
  };

  // Dữ liệu cho biểu đồ Donut
  const chartData = [
    { name: 'Alpha (Đài Loan)', value: alphaShare, color: '#3b82f6' },
    { name: 'Beta (Việt Nam)', value: betaShare, color: '#f97316' },
    { name: 'Gamma (Ấn Độ)', value: gammaShare, color: '#a855f7' }
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-200 p-4 md:p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto">
        
        {/* Header với Gradient Text */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 tracking-tight drop-shadow-sm">
              TechOne Smart SCM
            </h1>
            <p className="text-slate-400 mt-2 text-sm font-medium tracking-wide uppercase">Trung tâm điều hành chuỗi cung ứng thời gian thực</p>
          </div>
          <div className="flex gap-3">
            <span className="bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-xs font-bold tracking-widest text-blue-300">MCU-ARM32</span>
            <span className="bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-xs font-bold tracking-widest text-purple-300">CAP-X7R</span>
          </div>
        </div>

        {/* Trạm Cảnh báo (Glassmorphism) */}
        <div className={`p-5 rounded-2xl mb-8 border backdrop-blur-md transition-all duration-500 flex items-center gap-4 ${statusStyle}`}>
          <div className="text-4xl drop-shadow-lg">{isCritical ? "🚨" : "🛡️"}</div>
          <div>
            <h2 className="text-xs uppercase tracking-widest font-black opacity-80 mb-1">Trạng thái hệ thống AI</h2>
            <p className="text-lg font-bold tracking-tight">{systemMsg}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* CỘT 1: THIẾT LẬP NỘI BỘ */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl">
            <h2 className="text-sm uppercase tracking-widest font-bold mb-6 text-indigo-400 flex items-center gap-2">
              <span className="p-1.5 bg-indigo-500/20 rounded-lg">⚙️</span> Cấu hình TechOne
            </h2>
            <div className="space-y-6">
              {[
                { label: "Ngưỡng AQL", val: `${aqlThreshold}%`, setter: setAqlThreshold, state: aqlThreshold, min: 0.1, max: 2.0, step: 0.1, color: "accent-indigo-500" },
                { label: "Nhu cầu ngày", val: dailyDemand, setter: setDailyDemand, state: dailyDemand, min: 20, max: 150, step: 10, color: "accent-cyan-500" },
                { label: "Tồn kho an toàn", val: safetyStock, setter: setSafetyStock, state: safetyStock, min: 50, max: 500, step: 50, color: "accent-emerald-500" },
                { label: "Lượng đặt hàng", val: orderVolume.toLocaleString(), setter: setOrderVolume, state: orderVolume, min: 500, max: 5000, step: 100, color: "accent-blue-500" }
              ].map((item, idx) => (
                <div key={idx} className="group">
                  <div className="flex justify-between mb-2 text-sm">
                    <label className="text-slate-400 font-medium group-hover:text-slate-200 transition-colors">{item.label}</label>
                    <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded-md">{item.val}</span>
                  </div>
                  <input type="range" min={item.min} max={item.max} step={item.step} value={item.state} onChange={(e) => item.setter(parseFloat(e.target.value))} className={`w-full h-1.5 bg-white/10 rounded-lg cursor-pointer ${item.color}`} />
                </div>
              ))}
            </div>
          </div>

          {/* CỘT 2: GIẢ LẬP RỦI RO */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl flex flex-col justify-between relative overflow-hidden">
            {/* Background glow effect */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/10 blur-3xl rounded-full"></div>
            
            <div className="relative z-10">
              <h2 className="text-sm uppercase tracking-widest font-bold mb-6 text-rose-400 flex items-center gap-2">
                <span className="p-1.5 bg-rose-500/20 rounded-lg">⚠️</span> Cú sốc Chuỗi cung ứng
              </h2>
              
              <div className="space-y-8">
                <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                  <div className="flex justify-between mb-3 text-sm">
                    <label className="text-slate-300 font-medium">Tỷ lệ lỗi lô hàng (Defect Rate)</label>
                    <span className={`font-black text-lg ${defectRate > aqlThreshold ? 'text-rose-400' : 'text-amber-400'}`}>{defectRate}%</span>
                  </div>
                  <input type="range" min="0" max="3" step="0.1" value={defectRate} onChange={(e) => setDefectRate(parseFloat(e.target.value))} className="w-full accent-rose-500 h-2 bg-white/10 rounded-lg cursor-pointer" />
                </div>

                <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                  <div className="flex justify-between mb-3 text-sm">
                    <label className="text-slate-300 font-medium">Độ trễ vận tải (Lead Time)</label>
                    <span className="font-black text-lg text-amber-400">{leadTime} Ngày</span>
                  </div>
                  <input type="range" min="3" max="20" step="1" value={leadTime} onChange={(e) => setLeadTime(parseInt(e.target.value))} className="w-full accent-amber-500 h-2 bg-white/10 rounded-lg cursor-pointer" />
                </div>
              </div>
            </div>

            <button onClick={handleRunSimulation} className="relative z-10 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-4 px-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] mt-8 hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:-translate-y-1 active:translate-y-0 uppercase tracking-widest text-sm">
              🚀 Kích hoạt AI Mô Phỏng
            </button>
          </div>

          {/* CỘT 3: KẾT QUẢ ĐẦU RA */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl flex flex-col">
            <h2 className="text-sm uppercase tracking-widest font-bold mb-2 text-emerald-400 flex items-center gap-2">
              <span className="p-1.5 bg-emerald-500/20 rounded-lg">📊</span> Bản sao số (Digital Twin)
            </h2>
            
            {/* Biểu đồ Donut Recharts */}
            <div className="h-48 w-full -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px'}} itemStyle={{fontWeight: 'bold'}}/>
                  <Legend verticalAlign="middle" align="right" layout="vertical" wrapperStyle={{fontSize: '12px', fontWeight: '500', color: '#cbd5e1'}}/>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4 mt-auto">
              <div className="bg-black/30 p-4 rounded-2xl border border-white/5 flex justify-between items-center group hover:bg-black/40 transition-colors">
                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Tác động Tài chính<br/><span className="text-white/30 text-[10px]">Delta Cost</span></div>
                <div className={`text-2xl font-black tracking-tight ${deltaCost > 0 ? 'text-rose-400 drop-shadow-[0_0_10px_rgba(225,29,72,0.8)]' : 'text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]'}`}>
                  {deltaCost > 0 ? `+${deltaCost.toLocaleString()} ₫` : `${deltaCost.toLocaleString()} ₫`}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-rose-900/40 to-black/40 p-4 rounded-2xl border border-rose-500/30 flex justify-between items-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-xs text-rose-300 uppercase font-bold tracking-wider z-10">Báo động ROP<br/><span className="text-rose-400/50 text-[10px]">Dynamic Reorder Point</span></div>
                <div className="text-4xl font-black text-rose-400 tracking-tighter drop-shadow-[0_0_15px_rgba(225,29,72,0.6)] z-10">
                  {dynamicRop.toLocaleString()} <span className="text-sm font-medium text-rose-400/60 uppercase tracking-widest">chiếc</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
