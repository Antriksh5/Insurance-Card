import React, { useState } from "react";

const SearchBar = ({ onSearch, loading }) => {
  const [rollNo, setRollNo] = useState("");

  const handleChange = (e) => {
    const value = (e.target.value || "").toUpperCase();
    setRollNo(value.slice(0, 20));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rollNo.trim() || loading) return;
    onSearch(rollNo.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-300/80">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </span>
        <input
          type="text"
          value={rollNo}
          onChange={handleChange}
          placeholder="Enter Roll No. (e.g. 24UCS134)"
          maxLength={20}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-green-500/30 text-white placeholder:text-white/40 font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-green-400/60 focus:border-green-300/80 shadow-[0_0_0_1px_rgba(45,122,58,0.15),0_10px_30px_rgba(0,0,0,0.35)]"
        />
      </div>
      <button
        type="submit"
        disabled={!rollNo.trim() || loading}
        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-400 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_12px_24px_rgba(45,122,58,0.35)]"
      >
        {loading ? (
          <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle>
            <path d="M22 12a10 10 0 0 1-10 10"></path>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        )}
        <span>{loading ? "Fetching..." : "Fetch Card"}</span>
      </button>
    </form>
  );
};

export default SearchBar;
