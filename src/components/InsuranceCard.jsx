import React from "react";
import unitedIndiaLogo from "../assets/united-india-logo.webp";
import vidalHealthLogo from "../assets/vidal-health-logo.webp";

const formatDate = (value) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

const detailRows = (student) => [
  { label: "Card No.", value: student.card_no, bold: true },
  { label: "Name", value: student.name, bold: true },
  { label: "Gender", value: student.gender },
  { label: "Age", value: `${student.age} Years` },
  { label: "Employee Code", value: student.roll_no },
  { label: "Corporate Name", value: student.corporate_name },
  { label: "Valid From", value: formatDate(student.valid_from) },
];

const InfoRow = ({ label, value, bold = false }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "180px 18px minmax(0, 1fr)",
      alignItems: "start",
      gap: "8px",
      fontSize: "15px",
      lineHeight: 1.35,
      marginBottom: "12px",
    }}
  >
    <div style={{ color: "#101828", fontWeight: 500 }}>{label}</div>
    <div style={{ color: "#2d3748", fontWeight: 600 }}>:</div>
    <div
      style={{
        color: "#111827",
        fontWeight: bold ? 700 : 500,
        letterSpacing: bold ? "0.01em" : "0",
        wordBreak: "break-word",
      }}
    >
      {value}
    </div>
  </div>
);

const QrBlock = () => (
  <div style={{ textAlign: "center" }}>
    <svg width="92" height="92" viewBox="0 0 92 92" role="img" aria-label="QR placeholder">
      <rect width="92" height="92" fill="#ffffff" />
      <rect x="4" y="4" width="24" height="24" fill="#111827" />
      <rect x="64" y="4" width="24" height="24" fill="#111827" />
      <rect x="4" y="64" width="24" height="24" fill="#111827" />
      {[0, 1, 2, 3, 4, 5, 6, 7].flatMap((row) =>
        [0, 1, 2, 3, 4, 5, 6, 7].map((col) => ({ row, col }))
      ).map(({ row, col }) => {
        const size = 7;
        const x = 30 + col * size;
        const y = 30 + row * size;
        const filled = (row + col) % 2 === 0 || (row % 3 === 0 && col % 2 === 1);
        return (
          <rect
            key={`${row}-${col}`}
            x={x}
            y={y}
            width={size - 1}
            height={size - 1}
            fill={filled ? "#111827" : "#ffffff"}
          />
        );
      })}
    </svg>
    <div style={{ fontSize: "11px", color: "#475467", marginTop: "8px", maxWidth: "170px" }}>
      Scan QR code to download Vidal Health Mobile App
    </div>
  </div>
);

const InsuranceCard = ({ student }) => {
  if (!student) return null;

  return (
    <div
      style={{
        width: "min(1120px, 100%)",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        background: "#fbfcf8",
        color: "#101828",
        borderRadius: "22px",
        overflow: "hidden",
        border: "1px solid rgba(185, 200, 185, 0.8)",
        boxShadow: "0 28px 80px rgba(0, 0, 0, 0.32)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <section
        style={{
          position: "relative",
          padding: "26px 28px 24px",
          minHeight: "540px",
          background:
            "radial-gradient(circle at -10% 110%, rgba(168, 214, 164, 0.28) 0, rgba(168, 214, 164, 0.28) 13%, transparent 13.5%), linear-gradient(160deg, #fdfefb 0%, #f7faf4 55%, #edf6e9 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 78% 82%, rgba(184, 229, 176, 0.7) 0, rgba(184, 229, 176, 0.7) 14%, transparent 14.5%), linear-gradient(150deg, transparent 64%, rgba(190, 231, 188, 0.65) 64.5%, rgba(190, 231, 188, 0.2) 100%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column" }}>
          <header style={{ display: "flex", alignItems: "flex-start", gap: "18px" }}>
            <h2
              style={{
                margin: 0,
                flex: 1,
                fontSize: "26px",
                lineHeight: 1.15,
                fontWeight: 800,
                letterSpacing: "0.02em",
                fontFamily: "Georgia, 'Times New Roman', serif",
                textTransform: "uppercase",
              }}
            >
              United India Insurance Company Ltd
            </h2>
            <img
              src={unitedIndiaLogo}
              alt="United India Insurance"
              style={{ width: "132px", maxHeight: "92px", objectFit: "contain", flexShrink: 0 }}
            />
          </header>

          <div style={{ marginTop: "52px", maxWidth: "100%" }}>
            {detailRows(student).map((row) => (
              <InfoRow key={row.label} label={row.label} value={row.value} bold={row.bold} />
            ))}
          </div>

          <div style={{ marginTop: "auto", paddingTop: "28px", display: "flex", justifyContent: "flex-end" }}>
            <img
              src={vidalHealthLogo}
              alt="Vidal Health"
              style={{ width: "280px", maxWidth: "62%", objectFit: "contain" }}
            />
          </div>
        </div>
      </section>

      <section
        style={{
          position: "relative",
          padding: "26px 28px 24px",
          minHeight: "540px",
          background:
            "linear-gradient(180deg, rgba(250, 252, 248, 0.98) 0%, rgba(248, 251, 246, 0.98) 100%)",
          borderLeft: "2px solid #d4d9d1",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(155deg, rgba(190, 231, 188, 0.5) 0, rgba(190, 231, 188, 0.5) 8%, transparent 8.5%), linear-gradient(170deg, transparent 88%, rgba(196, 235, 194, 0.6) 88.5%, rgba(196, 235, 194, 0.25) 100%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
            <img
              src={vidalHealthLogo}
              alt="Vidal Health"
              style={{ width: "240px", maxWidth: "52%", objectFit: "contain" }}
            />
          </div>

          <div style={{ fontSize: "14px", lineHeight: 1.4 }}>
            <div style={{ fontWeight: 800, marginBottom: "8px" }}>Note:</div>
            <ul style={{ margin: "0 0 14px 18px", padding: 0 }}>
              <li>Submit this card & a photo ID for availing cashless at network hospitals.</li>
              <li>Cashless facility is subject to approval by Vidal Health as per policy terms & conditions.</li>
              <li>Valid of this card is subject to valid policy / renewal of policy.</li>
              <li>Inform Vidal Health immediately upon hospitalisation.</li>
              <li>For quick access of e-cards, policy details, claims, hospital list and more, give a missed call to 022-4892-6099.</li>
            </ul>
          </div>

          <div style={{ height: "1px", background: "#d6dad5", margin: "6px 0 12px" }} />

          <div style={{ fontSize: "14px", lineHeight: 1.35 }}>
            <div style={{ fontWeight: 800, marginBottom: "8px" }}>24x7 Dedicated Helpline No:</div>
            {[
              ["Karnataka/Andhra Pradesh/Telangana", "080-46267018 / 18004250251"],
              ["North and East region/Gujarat", "080-46267068 / 18004250261"],
              ["Maharashtra", "080-46267021 / 18004250254"],
              ["Tamil Nadu", "080-46267019 / 18004250253"],
              ["Kerala", "080-46267017 / 18004250252"],
              ["Sr. Citizen", "080-46267070 / 18001203348"],
            ].map(([region, number]) => (
              <div
                key={region}
                style={{
                  display: "grid",
                  gridTemplateColumns: "20px minmax(0, 1fr) auto",
                  gap: "8px",
                  marginBottom: "6px",
                  alignItems: "start",
                }}
              >
                <span style={{ color: "#101828", fontWeight: 700 }}>✓</span>
                <span>{region}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap" }}>{number}</span>
              </div>
            ))}
          </div>

          <div style={{ height: "1px", background: "#d6dad5", margin: "12px 0 14px" }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 170px", gap: "18px", alignItems: "end", marginTop: "auto" }}>
            <div style={{ fontSize: "13px", lineHeight: 1.35 }}>
              <div style={{ fontWeight: 800, marginBottom: "6px" }}>If found, please return to:</div>
              <div style={{ fontWeight: 700 }}>Vidal Health Insurance TPA Private Limited</div>
              <div>Regd. Office: Gopalan Global Axis, Block G, 5th & 6th Floor, #152,</div>
              <div>Opp. Satya Sai Hospital, ITPL Main Road, EPIP Zone, KIADB Export</div>
              <div>Promotion Industrial Area, Whitefield, Bangalore - 560066</div>
              <div style={{ marginTop: "6px" }}>
                <strong>Email:</strong> help@vidalhealthtpa.com | <strong>Website:</strong> www.vidalhealthtpa.com
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <QrBlock />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InsuranceCard;
