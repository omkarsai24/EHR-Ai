import React, { useState } from "react";
import { DoctorProfile, LabComponent } from "../types";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Search, ChevronDown, ChevronUp, Download, Heart, Activity, Flame, Droplets, Calendar, MapPin, CheckCircle2, AlertTriangle, Printer, Sparkles } from "lucide-react";

interface ExamSummaryViewProps {
  doctorProfile: DoctorProfile;
  labComponents: LabComponent[];
}

export const ExamSummaryView: React.FC<ExamSummaryViewProps> = ({
  doctorProfile,
  labComponents,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openPanels, setOpenPanels] = useState<Record<string, boolean>>({
    TSH: false,
    Lipid: false,
    CMP: true,
  });

  const [selectedComponentIds, setSelectedComponentIds] = useState<string[]>([
    "lab-4", // Carbon Dioxide
    "lab-6", // Creatinine
    "lab-1", // Sodium
  ]);

  const togglePanel = (key: string) => {
    setOpenPanels((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleComponentSelection = (id: string) => {
    if (selectedComponentIds.includes(id)) {
      if (selectedComponentIds.length > 1) {
        setSelectedComponentIds((prev) => prev.filter((item) => item !== id));
      }
    } else {
      if (selectedComponentIds.length < 10) {
        setSelectedComponentIds((prev) => [...prev, id]);
      }
    }
  };

  // Filter components
  const filteredComponents = labComponents.filter((comp) =>
    comp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedLabs = labComponents.filter((comp) =>
    selectedComponentIds.includes(comp.id)
  );

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner - Complete Exam Summary */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2 z-10">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Complete Exam Summary with {doctorProfile.name}
          </h2>
          <p className="text-xs text-blue-100 flex items-center gap-2">
            <span>Friday December 27, 2024</span>
            <span>•</span>
            <span>8:20 AM EST</span>
          </p>

          {/* Vitals Summary Row (Image 2 style cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
              <div className="flex items-center gap-2 text-rose-200 text-[11px] font-semibold mb-1">
                <Heart className="w-4 h-4 text-rose-300" /> Heart Pulse
              </div>
              <div className="text-lg font-black">72 <span className="text-[10px] font-medium opacity-80">bpm</span></div>
              <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/30 text-emerald-200 rounded font-bold">Normal</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
              <div className="flex items-center gap-2 text-blue-200 text-[11px] font-semibold mb-1">
                <Activity className="w-4 h-4 text-blue-300" /> Blood Pressure
              </div>
              <div className="text-lg font-black">116<span className="text-[11px] font-normal opacity-80">/66 mmHg</span></div>
              <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/30 text-emerald-200 rounded font-bold">Normal</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
              <div className="flex items-center gap-2 text-amber-200 text-[11px] font-semibold mb-1">
                <Flame className="w-4 h-4 text-amber-300" /> Blood Sugar
              </div>
              <div className="text-lg font-black">80 <span className="text-[10px] font-medium opacity-80">mg / dL</span></div>
              <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/30 text-emerald-200 rounded font-bold">Normal</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
              <div className="flex items-center gap-2 text-emerald-200 text-[11px] font-semibold mb-1">
                <Droplets className="w-4 h-4 text-emerald-300" /> Oxygen Sat.
              </div>
              <div className="text-lg font-black">98 <span className="text-[10px] font-medium opacity-80">%</span></div>
              <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/30 text-emerald-200 rounded font-bold">Normal</span>
            </div>
          </div>
        </div>

        {/* Doctor Graphic & Upcoming Visit Card */}
        <div className="bg-white text-slate-900 p-4 rounded-2xl shadow-md border border-slate-100 shrink-0 w-full md:w-72 space-y-3 z-10">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Upcoming Visit</h3>
            <div className="text-right">
              <span className="text-xs font-black text-blue-700 block">DEC</span>
              <span className="text-lg font-black leading-none">27</span>
              <span className="text-[9px] text-slate-400 block">2024</span>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <p className="font-bold text-slate-900">Sunrise Haven Medical Center</p>
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" /> 432 Serenity Lane, CA 90210
            </p>
          </div>

          <div className="flex items-center gap-1.5 pt-1">
            <button className="flex-1 py-1 text-[10px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg">Cancel</button>
            <button className="flex-1 py-1 text-[10px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg">Reschedule</button>
            <button className="flex-1 py-1 text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs">Confirm</button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Lab Panels, Right Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Lab Panels & Component Cards */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Test Results (e.g. Creatinine, Sodium)..."
              className="w-full pl-10 pr-10 py-2.5 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Collapsible Panel 1: TSH with Reflex */}
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
            <button
              onClick={() => togglePanel("TSH")}
              className="w-full px-5 py-3.5 flex items-center justify-between font-bold text-xs text-slate-900 bg-slate-50/80 hover:bg-slate-100/80 transition-colors"
            >
              <span>TSH with Reflex (1)</span>
              {openPanels.TSH ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {openPanels.TSH && (
              <div className="p-4 text-xs text-slate-600 bg-white">
                <p>TSH Value: 1.85 uIU/mL (Normal Range: 0.40 - 4.50 uIU/mL)</p>
              </div>
            )}
          </div>

          {/* Collapsible Panel 2: Lipid Panel */}
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
            <button
              onClick={() => togglePanel("Lipid")}
              className="w-full px-5 py-3.5 flex items-center justify-between font-bold text-xs text-slate-900 bg-slate-50/80 hover:bg-slate-100/80 transition-colors"
            >
              <span>Lipid Panel (3)</span>
              {openPanels.Lipid ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {openPanels.Lipid && (
              <div className="p-4 text-xs text-slate-600 space-y-1 bg-white">
                <p>Cholesterol Total: 185 mg/dL (Desirable &lt; 200)</p>
                <p>HDL Cholesterol: 52 mg/dL (&gt; 40)</p>
                <p>LDL Cholesterol: 108 mg/dL (&lt; 100 optimal)</p>
              </div>
            )}
          </div>

          {/* Collapsible Panel 3: Comprehensive Metabolic Panel (9) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
            <button
              onClick={() => togglePanel("CMP")}
              className="w-full px-5 py-3.5 flex items-center justify-between font-bold text-xs text-slate-900 bg-slate-50/80 hover:bg-slate-100/80 transition-colors"
            >
              <span>Comprehensive Metabolic Panel ({filteredComponents.length})</span>
              {openPanels.CMP ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openPanels.CMP && (
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-white">
                {filteredComponents.map((comp) => (
                  <div
                    key={comp.id}
                    onClick={() => toggleComponentSelection(comp.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                      selectedComponentIds.includes(comp.id)
                        ? "border-blue-500 bg-blue-50/40 shadow-xs"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-900">{comp.name}</span>
                      <span className="text-[10px] text-slate-400">View Detail</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mb-2">Normal Range: {comp.normalRange}</p>

                    {/* Value Badge & Range Bar */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          comp.status === "warning"
                            ? "bg-amber-400 text-slate-900"
                            : comp.status === "danger"
                            ? "bg-rose-500 text-white"
                            : "bg-emerald-500 text-white"
                        }`}
                      >
                        {comp.currentValue}
                      </span>

                      {/* Visual Range Indicator Bar */}
                      <div className="flex-1 h-2 bg-slate-100 rounded-full relative overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            comp.status === "warning" ? "bg-amber-400 w-4/5" : "bg-emerald-500 w-1/2"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recharts Interactive Trend Graphs & Component Selector */}
        <div className="lg:col-span-5 space-y-4">
          {/* Charts Container */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Multi-Year Component Trends
              </h3>
              <div className="flex bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
                <button className="px-2 py-0.5 bg-white rounded text-blue-700 shadow-2xs">All Data</button>
                <button className="px-2 py-0.5 text-slate-500">Month</button>
                <button className="px-2 py-0.5 text-slate-500">Year</button>
              </div>
            </div>

            {/* Render selected component charts */}
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {selectedLabs.map((comp) => (
                <div key={comp.id} className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>{comp.name}</span>
                    <span className="text-[10px] text-slate-400">Normal Range: {comp.normalRange}</span>
                  </div>

                  <div className="h-28 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={comp.history}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#64748b" }} />
                        <YAxis tick={{ fontSize: 10, fill: "#64748b" }} domain={["dataMin - 1", "dataMax + 1"]} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#2563eb"
                          strokeWidth={2.5}
                          dot={{ fill: "#2563eb", r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Component Checkboxes (Select up to 10 components) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-800">
              Select up to 10 components to compare:
            </h4>

            <div className="grid grid-cols-3 gap-2 text-xs">
              {labComponents.map((comp) => {
                const isChecked = selectedComponentIds.includes(comp.id);
                return (
                  <label
                    key={comp.id}
                    className={`flex items-center gap-2 p-1.5 rounded-lg border cursor-pointer text-[11px] font-medium transition-colors ${
                      isChecked ? "bg-blue-50 border-blue-300 text-blue-900 font-bold" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleComponentSelection(comp.id)}
                      className="w-3.5 h-3.5 text-blue-600 rounded"
                    />
                    <span className="truncate">{comp.name}</span>
                  </label>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                Selected ({selectedComponentIds.length}/10)
              </span>
              <button
                onClick={() => setSelectedComponentIds(["lab-1", "lab-4", "lab-6"])}
                className="text-[10px] font-bold text-blue-600 hover:underline"
              >
                Reset Selections
              </button>
            </div>
          </div>

          {/* Download PDF Button */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <h5 className="text-xs font-bold text-slate-900">Download Full Lab Results</h5>
              <p className="text-[10px] text-slate-500">Save a printable table of your exam results as PDF document.</p>
            </div>
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
