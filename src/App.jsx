import React, { useRef, useState } from "react";
import SearchBar from "./components/SearchBar";
import InsuranceCard from "./components/InsuranceCard";
import { fetchStudentByRollNo } from "./api";

const ordinalYear = (year) => {
  const n = Number(year);
  if (!Number.isFinite(n)) return "";
  if (n === 1) return "1st Year";
  if (n === 2) return "2nd Year";
  if (n === 3) return "3rd Year";
  return `${n}th Year`;
};

const App = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef(null);

  const handleSearch = async (rollNo) => {
    setLoading(true);
    setError("");
    setStudent(null);
    try {
      const data = await fetchStudentByRollNo(rollNo);
      setStudent(data);
    } catch (err) {
      setError(err.message || "Failed to fetch student");
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async () => {
    if (!cardRef.current || downloading) return;
    setDownloading(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(cardRef.current, { scale: 3 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [canvas.width, canvas.height] });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      const name = student?.name ? student.name.replace(/\s+/g, "_") : "STUDENT";
      pdf.save(`Insurance_Card_${name}.pdf`);
    } finally {
      setDownloading(false);
    }
  };

  const downloadImage = async () => {
    if (!cardRef.current || downloading) return;
    setDownloading(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(cardRef.current, { scale: 3 });
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      const name = student?.name ? student.name.replace(/\s+/g, "_") : "STUDENT";
      link.href = url;
      link.download = `Insurance_Card_${name}.png`;
      link.click();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(45,122,58,0.25),_transparent_50%)]"></div>
      <div className="absolute w-80 h-80 bg-green-500/20 blur-3xl rounded-full -top-20 -left-20"></div>
      <div className="absolute w-72 h-72 bg-emerald-500/20 blur-3xl rounded-full bottom-10 -right-10"></div>

      <div className="relative max-w-[1280px] mx-auto px-5 sm:px-8 py-10 sm:py-14">
        <div className="animate-fadeUp" style={{ animationDelay: "0.05s" }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-200 text-xs mb-4">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            LNM Institute of Information Technology
          </div>
          <h1 className="font-display text-[44px] sm:text-[56px] lg:text-[64px] leading-[0.98]">Insurance Card Portal</h1>
          <p className="text-white/60 mt-3 text-base sm:text-lg max-w-2xl">
            Enter your roll number to retrieve your United India Insurance e-card in a printable two-panel format.
          </p>
        </div>

        <div className="mt-6 animate-fadeUp" style={{ animationDelay: "0.12s" }}>
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>

        {error && (
          <div className="mt-6 bg-red-500/10 border border-red-400/40 text-red-200 px-4 py-3 rounded-xl flex items-start gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12" y2="16"></line>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {student ? (
          <div className="mt-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Branch", value: student.branch, icon: "??" },
                { label: "Year", value: ordinalYear(student.year), icon: "??" },
                { label: "Insurer", value: "UIIC", icon: "??" },
                { label: "Status", value: "Active", icon: "?" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/5 border border-green-500/30 rounded-xl px-4 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
                  <div className="text-white/50 text-xs">{stat.icon} {stat.label}</div>
                  <div className="text-white text-lg font-semibold mt-1">{stat.value}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-center overflow-x-auto pb-2">
              <div ref={cardRef} className="animate-cardFlip min-w-[1120px] max-w-full">
                <InsuranceCard student={student} />
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={downloadPdf}
                disabled={downloading}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-400 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloading ? "Generating..." : "Download PDF"}
              </button>
              <button
                onClick={downloadImage}
                disabled={downloading}
                className="px-5 py-3 rounded-xl border border-green-400/70 text-green-200 font-semibold bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloading ? "Generating..." : "Save as Image"}
              </button>
            </div>

            <div className="mt-4 text-center text-xs text-white/50">
              This is a digital copy of your insurance card. Present it along with a valid photo ID at network hospitals.
            </div>
          </div>
        ) : (
          !error && (
            <div className="mt-16 text-center text-white/40">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 opacity-50">
                <rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect>
                <line x1="3" y1="10" x2="21" y2="10"></line>
                <line x1="7" y1="15" x2="10" y2="15"></line>
              </svg>
              <div>Your insurance card will appear here</div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default App;
