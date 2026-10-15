import React, { useState } from 'react';

export default function SmartSCMControlCenter() {
  // --- BIẾN SỐ NỘI BỘ (TECHONE) ---
  const [aqlThreshold, setAqlThreshold] = useState(1.0); // Ngưỡng chất lượng
  const [dailyDemand, setDailyDemand] = useState(60);    // Nhu cầu ngày
  const [safetyStock, setSafetyStock] = useState(200);   // Tồn kho an toàn
  const [orderVolume, setOrderVolume] = useState(1200);  // Lượng đặt hàng EOQ

  // --- BIẾN SỐ RỦI RO (NHÀ CUNG CẤP ALPHA) ---
  const [defectRate, setDefectRate] = useState(0.5);     // Tỷ lệ lỗi thực tế
  const [leadTime, setLeadTime] = useState(8);           // Thời gian giao hàng

  // --- TRẠNG THÁI KẾT QUẢ ---
  const [alphaShare, setAlphaShare] = useState(80);
  const [betaShare, setBetaShare] = useState(20);
  const [statusStyle, setStatusStyle] = useState("bg-emerald-900/60 border-emerald-500 text-emerald-300");
  const [systemMsg, setSystemMsg] = useState("Hệ thống hoạt động ổn định. Đang ưu tiên phân bổ 80% cho Alpha (Đài Loan).");
  const [dynamicRop, setDynamicRop] = useState(680);
  const [deltaCost, setDeltaCost] = useState(0);
  const [isCritical, setIsCritical] = useState(false);

  // THUẬT TOÁN ĐIỀU HÀNH TRUNG TÂM
  const handleRunSimulation = () => {
    // 1. Digital Twin: Tính ROP động theo tất cả biến số (d * L + SS)
    const calculatedRop = Math.round((dailyDemand * leadTime) + safetyStock);
    setDynamicRop(calculatedRop);

    let alpha = 80;
    let beta = 20;
    let msg = "";
    let critical = false;
    let style = "";

    // 2. AI Ra quyết định (So sánh Tỷ lệ lỗi thực tế với Ngưỡng AQL động)
    if (defectRate > aqlThreshold) {
      alpha = 0;
      beta = 100;
      critical = true;
      style = "bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse";
      msg = `⚠️ BÁO ĐỘNG SMT: Tỷ lệ lỗi thực tế (${defectRate}%) vượt mốc AQL cho phép (${aqlThreshold}%). AI kích hoạt Dual Sourcing: Chuyển 100% PO khẩn cấp sang Beta!`;
    } else {
      alpha = 80;
      beta = 20;
      critical = false;
      style = "bg-emerald-950/80 border-emerald-500 text-emerald-300";
      msg = `Chuỗi cung ứng an toàn. Tỷ lệ lỗi (${defectRate}%) đạt chuẩn AQL nội bộ (${aqlThreshold}%). Duy trì cấu trúc 80/20.`;
    }

    setAlphaShare(alpha);
    setBetaShare(beta);
    setStatusStyle(style);
    setSystemMsg(msg);
    setIsCritical(critical);

    // 3. Phân tích tài chính
    const priceAlpha = 250000;
    const priceBeta = 260000;
    const baseCost = (0.8 * priceAlpha + 0.2 * priceBeta) * orderVolume;
    const newCost = ((alpha / 100) * priceAlpha + (beta / 100) * priceBeta) * orderVolume;
    setDeltaCost(newCost - baseCost);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-6 border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-400 tracking-tight">TechOne Smart SCM Control Center</h1>
            <p className="text-slate-400 mt-1 text-sm">Hệ thống điều hành chuỗi cung ứng & Bản sao số (Digital Twin) thời gian thực</p>
          </div>
        </div>

        {/* Trạm Cảnh báo */}
        <div className={`p-4 rounded-xl mb-6 border shadow-2xl transition-all duration-300 ${statusStyle}`}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{isCritical ? "🚨" : "🛡️"}</span>
            <div>
              <h2 className="text-xs uppercase tracking-wider font-bold opacity-70">AI Control Center:</h2>
              <p className="text-base font-semibold mt-0.5">{systemMsg}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* CỘT 1: BIẾN SỐ NỘI BỘ TECHONE */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
            <h2 className="text-lg font-bold mb-5 text-indigo-400 flex items-center gap-2">
              <span>⚙️</span> 1. Cấu hình Nội bộ (TechOne)
            </h2>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-1.5 text-sm">
                  <label className="text-slate-300">Ngưỡng chấp nhận lỗi (AQL):</label>
                  <span className="font-bold text-indigo-300">{aqlThreshold}%</span>
                </div>
                <input type="range" min="0.1" max="2.0" step="0.1" value={aqlThreshold} onChange={(e) => setAqlThreshold(parseFloat(e.target.value))} className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer" />
              </div>

              <div>
                <div className="flex justify-between mb-1.5 text-sm">
                  <label className="text-slate-300">Nhu cầu SX ngày (Daily Demand):</label>
                  <span className="font-bold text-cyan-400">{dailyDemand} chiếc/ngày</span>
                </div>
                <input type="range" min="20" max="150" step="10" value={dailyDemand} onChange={(e) => setDailyDemand(parseInt(e.target.value))} className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer" />
              </div>

              <div>
                <div className="flex justify-between mb-1.5 text-sm">
                  <label className="text-slate-300">Tồn kho an toàn (Safety Stock):</label>
                  <span className="font-bold text-emerald-400">{safetyStock} chiếc</span>
                </div>
                <input type="range" min="50" max="500" step="50" value={safetyStock} onChange={(e) => setSafetyStock(parseInt(e.target.value))} className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer" />
              </div>

              <div>
                <div className="flex justify-between mb-1.5 text-sm">
                  <label className="text-slate-300">Lượng đặt hàng (EOQ):</label>
                  <span className="font-bold text-blue-400">{orderVolume.toLocaleString()} chiếc</span>
                </div>
                <input type="range" min="500" max="5000" step="100" value={orderVolume} onChange={(e) => setOrderVolume(parseInt(e.target.value))} className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer" />
              </div>
            </div>
          </div>

          {/* CỘT 2: BIẾN SỐ RỦI RO ĐỐI TÁC */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold mb-5 text-amber-400 flex items-center gap-2">
                <span>⚠️</span> 2. Giả lập Rủi ro (Nhà cung cấp)
              </h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <label className="text-slate-300">Tỷ lệ lỗi lô hàng thực tế (Defect Rate):</label>
                    <span className={`font-bold px-2 py-0.5 rounded ${defectRate > aqlThreshold ? 'bg-rose-900/80 text-rose-300' : 'text-amber-400'}`}>{defectRate}%</span>
                  </div>
                  <input type="range" min="0" max="3" step="0.1" value={defectRate} onChange={(e) => setDefectRate(parseFloat(e.target.value))} className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg cursor-pointer" />
                  <p className="text-xs text-slate-500 mt-1.5">Trượt để giả lập chất lượng linh kiện đầu vào suy giảm.</p>
                </div>

                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <label className="text-slate-300">Thời gian giao hàng (Lead Time):</label>
                    <span className="font-bold text-amber-400">{leadTime} Ngày</span>
                  </div>
                  <input type="range" min="3" max="20" step="1" value={leadTime} onChange={(e) => setLeadTime(parseInt(e.target.value))} className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer" />
                  <p className="text-xs text-slate-500 mt-1.5">Trượt để giả lập rủi ro chậm trễ vận tải hàng hải/hải quan.</p>
                </div>
              </div>
            </div>

            <button onClick={handleRunSimulation} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 mt-6 active:scale-95 border border-blue-400/30 uppercase text-sm tracking-wide">
              Chạy AI Điều Phối Chuỗi Cung Ứng
            </button>
          </div>

          {/* CỘT 3: KẾT QUẢ OUTPUT & TÀI CHÍNH */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold mb-5 text-emerald-400 flex items-center gap-2">
                <span>📊</span> 3. Báo cáo Tác động (Impact)
              </h2>
              
              {/* Allocation */}
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between text-xs mb-1.5 font-semibold text-slate-400">
                    <span>PO Alpha (Đài Loan)</span>
                    <span className="text-blue-400">{alphaShare}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
                    <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${alphaShare}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5 font-semibold text-slate-400">
                    <span>PO Beta (Việt Nam)</span>
                    <span className="text-orange-400">{betaShare}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
                    <div className="bg-orange-500 h-full rounded-full transition-all duration-500" style={{ width: `${betaShare}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tài chính & ROP */}
            <div className="space-y-3">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
                <div className="text-xs text-slate-400 uppercase font-semibold">Chi phí phát sinh<br/>(Delta Cost)</div>
                <div className={`text-xl font-bold ${deltaCost > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {deltaCost > 0 ? `+${deltaCost.toLocaleString()} đ` : `${deltaCost.toLocaleString()} đ`}
                </div>
              </div>
              
              <div className="bg-slate-950 p-3.5 rounded-xl border border-rose-900/50 shadow-[0_0_15px_rgba(225,29,72,0.1)] flex justify-between items-center relative overflow-hidden">
                <div className="text-xs text-rose-300/80 uppercase font-bold">Báo động điểm đặt hàng<br/>(Dynamic ROP)</div>
                <div className="text-3xl font-black text-rose-400 tracking-tighter">
                  {dynamicRop.toLocaleString()} <span className="text-sm font-medium text-rose-400/50 uppercase tracking-normal">Chiếc</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
