import React, { useState } from 'react';

export default function SmartSCMControlCenter() {
  // Trạng thái đầu vào mô phỏng
  const [defectRate, setDefectRate] = useState(0.5); 
  const [leadTime, setLeadTime] = useState(8); 
  const [orderVolume, setOrderVolume] = useState(1200);

  // Trạng thái kết quả mô phỏng
  const [alphaShare, setAlphaShare] = useState(80);
  const [betaShare, setBetaShare] = useState(20);
  const [statusStyle, setStatusStyle] = useState("bg-emerald-900/60 border-emerald-500 text-emerald-300");
  const [systemMsg, setSystemMsg] = useState("Hệ thống hoạt động ổn định. Đang ưu tiên phân bổ 80% cho Alpha (Đài Loan).");
  const [dynamicRop, setDynamicRop] = useState(680);
  const [deltaCost, setDeltaCost] = useState(0);
  const [isCritical, setIsCritical] = useState(false);

  // Thuật toán tích hợp sẵn xử lý trực tiếp ngay trên Frontend
  const handleRunSimulation = () => {
    // 1. Tính ROP động dựa trên Lead Time mới (d = 60 chiếc/ngày, SS = 200 chiếc)
    const calculatedRop = Math.round((60 * leadTime) + 200);
    setDynamicRop(calculatedRop);

    let alpha = 80;
    let beta = 20;
    let msg = "";
    let critical = false;
    let style = "";

    // 2. Thuật toán AI điều hướng theo AQL Threshold (1.0%)
    if (defectRate > 1.0) {
      alpha = 0;
      beta = 100;
      critical = true;
      style = "bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse";
      msg = `⚠️ CẢNH BÁO KHẨN CẤP: Lô CAP-X7R lỗi ${defectRate}% (Vượt định mức AQL 1.0%). AI tự động kích hoạt Dual Sourcing: Đóng băng Alpha, chuyển 100% PO sang Beta (Việt Nam) để cứu chuyền SMT!`;
    } else {
      alpha = 80;
      beta = 20;
      critical = false;
      style = "bg-emerald-950/80 border-emerald-500 text-emerald-300";
      msg = `Hệ thống ổn định. Tỷ lệ lỗi Alpha (${defectRate}%) nằm trong ngưỡng cho phép. Duy trì phân bổ 80/20.`;
    }

    setAlphaShare(alpha);
    setBetaShare(beta);
    setStatusStyle(style);
    setSystemMsg(msg);
    setIsCritical(critical);

    // 3. Phân tích tài chính chênh lệch chi phí (Delta Cost)
    const priceAlpha = 250000;
    const priceBeta = 260000;
    const baseCost = (0.8 * priceAlpha + 0.2 * priceBeta) * orderVolume;
    const newCost = ((alpha / 100) * priceAlpha + (beta / 100) * priceBeta) * orderVolume;
    setDeltaCost(newCost - baseCost);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-400 tracking-tight">TechOne Smart SCM Control Center</h1>
            <p className="text-slate-400 mt-1">Hệ thống điều hành chuỗi cung ứng thời gian thực & Mô phỏng rủi ro Dual Sourcing</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-right">
            <span className="text-xs text-slate-400 block">Mã linh kiện giám sát</span>
            <span className="font-bold text-amber-400">MCU-ARM32 & CAP-X7R</span>
          </div>
        </div>

        {/* Trạm Cảnh báo Trạng thái (Alert Banner) */}
        <div className={`p-5 rounded-2xl mb-8 border shadow-2xl transition-all duration-300 ${statusStyle}`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{isCritical ? "🚨" : "🛡️"}</span>
            <div>
              <h2 className="text-xs uppercase tracking-wider font-bold opacity-70">Trạng thái vận hành trung tâm:</h2>
              <p className="text-base font-semibold mt-0.5">{systemMsg}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Module 1: Bảng Nhập Liệu Mô Phỏng Rủi Ro */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-6 text-blue-400 flex items-center gap-2">
                <span>🎛️</span> 1. Mô Phỏng Biến Động Nhà Cung Ứng
              </h2>
              
              {/* Thanh trượt Tỷ lệ lỗi */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-slate-300 font-medium">Tỷ lệ lỗi thực tế của Alpha (AQL Max: 1.0%):</label>
                  <span className={`text-lg font-extrabold px-3 py-1 rounded-lg ${defectRate > 1.0 ? 'bg-rose-900/50 text-rose-400 border border-rose-600' : 'bg-slate-800 text-blue-400'}`}>
                    {defectRate}%
                  </span>
                </div>
                <input 
                  type="range" min="0" max="3" step="0.1" 
                  value={defectRate} 
                  onChange={(e) => setDefectRate(parseFloat(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
              </div>

              {/* Thanh trượt Lead time */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-slate-300 font-medium">Thời gian giao hàng (Lead Time):</label>
                  <span className="text-lg font-bold text-amber-400 bg-slate-800 px-3 py-1 rounded-lg">
                    {leadTime} Ngày
                  </span>
                </div>
                <input 
                  type="range" min="5" max="15" step="1" 
                  value={leadTime} 
                  onChange={(e) => setLeadTime(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
              </div>
            </div>

            <button 
              onClick={handleRunSimulation}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-blue-600/30 mt-4 active:scale-95"
            >
              Chạy Thuật Toán Phân Tích (Run AI Simulation)
            </button>
          </div>

          {/* Module 2: Quyết định phân bổ đơn hàng */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-4 text-emerald-400 flex items-center gap-2">
                <span>📊</span> 2. Quyết Định Điều Hướng (Dual Sourcing Allocation)
              </h2>
              <p className="text-xs text-slate-400 mb-6">Tỷ lệ phân bổ đơn hàng tự động co giãn theo phương án của hệ thống.</p>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2 font-semibold">
                    <span className="text-blue-400">Nhà cung cấp Alpha (Đài Loan - Chủ lực)</span>
                    <span className="text-lg text-blue-400">{alphaShare}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden p-0.5 border border-slate-700">
                    <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${alphaShare}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2 font-semibold">
                    <span className="text-orange-400">Nhà cung cấp Beta (Việt Nam - Dự phòng)</span>
                    <span className="text-lg text-orange-400">{betaShare}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden p-0.5 border border-slate-700">
                    <div className="bg-orange-500 h-full rounded-full transition-all duration-500" style={{ width: `${betaShare}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tài chính chênh lệch */}
            <div className="mt-6 pt-4 border-t border-slate-800 bg-slate-950 p-3.5 rounded-xl">
              <div className="text-xs text-slate-400 uppercase font-semibold">Tác động tài chính (Delta Cost):</div>
              <div className={`text-lg font-bold mt-0.5 ${deltaCost > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {deltaCost > 0 ? `+${deltaCost.toLocaleString()} VNĐ` : `${deltaCost.toLocaleString()} VNĐ`}
              </div>
            </div>
          </div>

        </div>

        {/* Module 3: Digital Twin & Dynamic ROP */}
        <div className="mt-6 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <h2 className="text-xl font-bold mb-2 text-purple-400 flex items-center gap-2">
            <span>📈</span> 3. Digital Twin: Quản Trị Tồn Kho Tự Động (Dynamic ROP)
          </h2>
          <p className="text-slate-400 text-sm mb-6">Mức tồn kho an toàn và điểm đặt hàng lại tự động điều chỉnh theo độ trễ giao hàng thực tế.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 shadow-inner">
              <span className="text-slate-400 text-xs uppercase font-semibold block">Lượng đặt hàng (EOQ)</span>
              <span className="text-3xl font-extrabold text-blue-400 mt-2 block">1,200</span>
              <span className="text-xs text-slate-500 mt-1 block">Chiếc / Lô tiêu chuẩn</span>
            </div>
            
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 shadow-inner relative overflow-hidden">
              <span className="text-slate-400 text-xs uppercase font-semibold block">Điểm ROP Động</span>
              <span className="text-3xl font-extrabold text-rose-400 mt-2 block">{dynamicRop}</span>
              <span className="text-xs text-slate-500 mt-1 block">Tự động co giãn theo Lead Time</span>
            </div>
            
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 shadow-inner">
              <span className="text-slate-400 text-xs uppercase font-semibold block">Tồn kho an toàn (SS)</span>
              <span className="text-3xl font-extrabold text-emerald-400 mt-2 block">200</span>
              <span className="text-xs text-slate-500 mt-1 block">Định mức an toàn chuyền SMT</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
