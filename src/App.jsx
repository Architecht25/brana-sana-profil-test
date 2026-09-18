import { useState, useEffect } from "react";

// ─── PALETTE (charte douceur/harmonie) ─────────────────────────────────────
const TXT = "#2D2A26";
const TXT2 = "#6B6560";
const MUTED = "#9C948C";
const SURF1 = "#F7F5F2";
const SURF2 = "#FFFFFF";
const BORDER = "#E5E0D8";

// ─── DONNÉES MÉTIER ────────────────────────────────────────────────────────

const DALTON_QUESTIONS = [
  { id: "physique",   emoji: "🌿", label: "Physique",   q: "Tu te réveilles fatigué même après une nuit complète, et tu ressens des tensions corporelles persistantes ?" },
  { id: "mental",     emoji: "🧠", label: "Mental",     q: "Tu as du mal à te déconnecter — les pensées tournent en boucle et tu oublies des mots en pleine conversation ?" },
  { id: "emotionnel", emoji: "💛", label: "Émotionnel", q: "Tu te sens constamment sollicité, tu portes les émotions des autres et tu as du mal à dire non ?" },
  { id: "social",     emoji: "👥", label: "Social",     q: "Tu te sens isolé ou épuisé malgré beaucoup d'interactions avec les autres ?" },
  { id: "sensoriel",  emoji: "👁️", label: "Sensoriel",  q: "Les écrans, notifications et bruits t'irritent facilement, et tu ressens un besoin compulsif de scroller ?" },
  { id: "creatif",    emoji: "🎨", label: "Créatif",    q: "Tu ressens un blocage créatif ou un sentiment de vide, comme si tu tournais en rond malgré les efforts ?" },
  { id: "spirituel",  emoji: "✨", label: "Spirituel",  q: "Tu te sens déconnecté d'un sens plus profond, sans direction claire, ou épuisé par des actions sans signification ?" },
];

const RESPONSES = ["Rarement", "Parfois", "Souvent", "Toujours"];

const HD_TYPES = [
  { value: "generateur",      label: "Générateur",             pct: "37%", desc: "Bâtisseur — énergie sacrale constante" },
  { value: "gen_manifesteur", label: "Générateur Manifesteur", pct: "33%", desc: "Multitâche — énergie et initiative" },
  { value: "manifesteur",     label: "Manifesteur",            pct: "8%",  desc: "Initiateur — impulsions intenses" },
  { value: "projecteur",      label: "Projecteur",             pct: "21%", desc: "Guide — absorption de l'énergie des autres" },
  { value: "reflecteur",      label: "Réflecteur",             pct: "1%",  desc: "Miroir — capte l'énergie de l'environnement" },
  { value: "unknown",         label: "Je ne connais pas mon type", pct: "", desc: "" },
];

const ACTIVITIES = {
  physique:   ["Yoga doux en terrasse", "Sentier pieds nus sur le domaine", "Randonnée contemplative (Picos)", "Baignade · Plage d'Andrín ou Toró", "Bain nordique froid"],
  mental:     ["Sieste guidée NSDR (yoga nidra)", "Méditation en salle dédiée", "Journaling guidé (5 questions)", "Cohérence cardiaque 3×/jour", "Niksen — journée sans programme"],
  emotionnel: ["Soin botanique · Massage aux huiles locales", "Cercle de parole (si groupe)", "Session numérologie / Human Design", "Journaling émotionnel guidé"],
  social:     ["Dîner partagé chaque soir", "Atelier cuisine collaborative", "Apéritif botanique en terrasse", "Balade guidée en groupe"],
  sensoriel:  ["Shinrin-yoku — bain de forêt guidé", "Bain nordique chaud en soirée", "Atelier jardin médicinal", "Sentier botanique du domaine", "Déconnexion numérique complète"],
  creatif:    ["Atelier manuel · Poterie, bois, vannerie", "Jardinage dans le potager", "Atelier plantes médicinales", "Contemplation du paysage asturien"],
  spirituel:  ["Session numérologie + plante compagne", "Session Human Design en salle Solana", "Méditation sur le sens du séjour", "Cérémonie botanique du soir"],
};

const HD_REST = {
  generateur:      { rest: "Sieste courte (20 min) après épuisement complet", key: "Physique", note: "Préfère s'épuiser dans ce qui l'allume — le repos vient après l'action." },
  gen_manifesteur: { rest: "Alternance action / sieste courte", key: "Physique + Mental", note: "Multi-tâche naturel — le repos vient entre les séquences actives." },
  manifesteur:     { rest: "Sieste longue (60-90 min) régulière", key: "Mental + Émotionnel", note: "Repos profond entre les impulsions — informer l'entourage avant de se retirer." },
  projecteur:      { rest: "Sieste quotidienne longue + solitude régulière", key: "Social + Émotionnel", note: "Absorbe l'énergie des autres — a besoin de se vider en étant seul." },
  reflecteur:      { rest: "Beaucoup de repos — qualité du lieu compte plus que l'activité", key: "Sensoriel", note: "Le lieu lui-même est le soin — Braña Sana est un environnement idéal." },
  unknown:         { rest: "Programme équilibré sur tous les types", key: "Tous", note: "Commencez par le diagnostic Dalton-Smith pour identifier les priorités." },
};

const NUMEROLOGIE_REST = {
  1: { label: "Le Pionnier",          deficit: "Social + Émotionnel",    pratique: "Solitude active, marche seul, journaling" },
  2: { label: "Le Médiateur",         deficit: "Émotionnel",             pratique: "Cohérence cardiaque, espaces authentiques, nature" },
  3: { label: "Le Créateur",          deficit: "Créatif + Mental",       pratique: "Journaling, art, musique, conversations profondes" },
  4: { label: "Le Bâtisseur",         deficit: "Mental + Physique",      pratique: "Sieste structurée, déconnexion, nature ordonnée" },
  5: { label: "L'Aventurier",         deficit: "Sensoriel + Social",     pratique: "Niksen, silence intentionnel, déconnexion numérique" },
  6: { label: "L'Harmonisateur",      deficit: "Émotionnel + Créatif",   pratique: "Shinrin-yoku, beauté des espaces, création libre" },
  7: { label: "L'Analyste",           deficit: "Social + Spirituel",     pratique: "Solitude contemplative, méditation, nature sauvage" },
  8: { label: "L'Entrepreneur",       deficit: "Physique + Mental",      pratique: "Sport intense + décompression totale, sieste longue" },
  9: { label: "Le Sage",              deficit: "Émotionnel + Sensoriel", pratique: "Retraite contemplative, déconnexion totale, nature" },
  11: { label: "L'Inspirateur",        deficit: "Mental + Sensoriel",     pratique: "Méditation, silence, espaces épurés, nature" },
  22: { label: "Le Maître Bâtisseur",  deficit: "Mental + Physique",      pratique: "Retraite structurée, sieste, déconnexion du projet" },
  33: { label: "Le Maître Guérisseur", deficit: "Émotionnel",            pratique: "Retraite totale, cercles de soin, pratiques spirituelles" },
};

// ─── CALCULS ───────────────────────────────────────────────────────────────

function calcLifeNumber(dateStr) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return null;
  const digits = `${d}${m}${y}`.split("").map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = String(sum).split("").map(Number).reduce((a, b) => a + b, 0);
  }
  return sum;
}

function getDeficits(answers) {
  const scores = {};
  DALTON_QUESTIONS.forEach(q => {
    scores[q.id] = RESPONSES.indexOf(answers[q.id] ?? "Rarement") + 1;
  });
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return {
    critical: sorted.filter(([, s]) => s >= 3).map(([k]) => k),
    watch: sorted.filter(([, s]) => s === 2).map(([k]) => k),
    good: sorted.filter(([, s]) => s === 1).map(([k]) => k),
    scores,
  };
}

function getRecommendedActivities(deficits, hdType) {
  const all = [];
  const priority = [...deficits.critical, ...deficits.watch];
  priority.slice(0, 4).forEach(type => {
    (ACTIVITIES[type] || []).forEach(a => {
      if (!all.includes(a)) all.push(a);
    });
  });
  if (hdType === "projecteur" || hdType === "manifesteur") {
    if (!all.includes("Sieste guidée NSDR (yoga nidra)")) all.push("Sieste guidée NSDR (yoga nidra)");
  }
  return all.slice(0, 8);
}

// ─── COMPOSANTS UI ─────────────────────────────────────────────────────────

function ProgressBar({ step, total }) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < step ? "#1F4E79" : BORDER, transition: "background 0.3s" }} />
      ))}
    </div>
  );
}

function StepHeader({ emoji, title, subtitle }) {
  return (
    <div style={{ marginBottom: 24 }}>
      {emoji && <div style={{ fontSize: 32, marginBottom: 8 }}>{emoji}</div>}
      <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 500, color: TXT }}>{title}</h2>
      {subtitle && <p style={{ margin: 0, fontSize: 14, color: TXT2, lineHeight: 1.5 }}>{subtitle}</p>}
    </div>
  );
}

function StepIntro({ prenom, nom, onChangePrenom, onChangeNom, onNext }) {
  const ready = prenom.trim().length > 0;
  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🌿</div>
        <h1 style={{ margin: "0 0 12px", fontSize: 24, fontWeight: 500, color: "#1F4E79" }}>Braña Sana</h1>
        <p style={{ margin: "0 0 8px", fontSize: 15, color: TXT2, lineHeight: 1.6 }}>
          Découvrez votre profil de repos personnalisé et les activités qui correspondent à vos besoins.
        </p>
        <p style={{ margin: 0, fontSize: 13, color: MUTED }}>10 à 12 minutes · 3 dimensions · Programme sur mesure</p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", fontSize: 14, color: TXT2, marginBottom: 8 }}>Prénom</label>
        <input value={prenom} onChange={e => onChangePrenom(e.target.value)} placeholder="Votre prénom"
          style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `0.5px solid ${BORDER}`, fontSize: 15, background: SURF2, color: TXT, boxSizing: "border-box" }} />
      </div>
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "block", fontSize: 14, color: TXT2, marginBottom: 8 }}>Nom <span style={{ color: MUTED }}>(optionnel)</span></label>
        <input value={nom} onChange={e => onChangeNom(e.target.value)} placeholder="Votre nom"
          style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `0.5px solid ${BORDER}`, fontSize: 15, background: SURF2, color: TXT, boxSizing: "border-box" }} />
      </div>

      <div style={{ background: SURF1, borderRadius: 12, padding: "16px 20px", marginBottom: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { emoji: "💛", label: "Dalton-Smith", desc: "7 types de repos — identifier vos déficits" },
            { emoji: "🔢", label: "Numérologie", desc: "Votre chiffre de vie — profil structurel" },
            { emoji: "⚡", label: "Human Design", desc: "Votre type énergétique — mode de récupération" },
          ].map(({ emoji, label, desc }) => (
            <div key={label} style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 20, minWidth: 28 }}>{emoji}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: TXT }}>{label}</div>
                <div style={{ fontSize: 12, color: TXT2 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={onNext} disabled={!ready} style={{ width: "100%", padding: "14px", borderRadius: 10, background: ready ? "#1F4E79" : BORDER, color: ready ? "#fff" : MUTED, border: "none", fontSize: 16, fontWeight: 500, cursor: ready ? "pointer" : "default" }}>
        Découvrir mon profil de repos →
      </button>
    </div>
  );
}

function StepDalton({ answers, onChange, onNext, onBack }) {
  const [current, setCurrent] = useState(0);
  const q = DALTON_QUESTIONS[current];
  const isLast = current === DALTON_QUESTIONS.length - 1;

  function selectAnswer(val) {
    onChange(q.id, val);
    if (!isLast) setTimeout(() => setCurrent(c => c + 1), 200);
  }

  return (
    <div>
      <StepHeader emoji={q.emoji} title={q.label} subtitle={`Question ${current + 1} sur ${DALTON_QUESTIONS.length}`} />
      <div style={{ background: SURF1, borderRadius: 12, padding: "16px 20px", marginBottom: 24 }}>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: TXT }}>{q.q}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {RESPONSES.map((r, i) => {
          const selected = answers[q.id] === r;
          const colors = ["#375623", "#C55A11", "#C00000", "#7B0000"];
          const bgs = ["#E2EFDA", "#FFF3CD", "#FCE4D6", "#FCE4EC"];
          return (
            <button key={r} onClick={() => selectAnswer(r)} style={{
              padding: "12px 16px", borderRadius: 10, textAlign: "left", cursor: "pointer",
              background: selected ? bgs[i] : SURF2,
              border: selected ? `2px solid ${colors[i]}` : `0.5px solid ${BORDER}`,
              color: selected ? colors[i] : TXT, fontSize: 15, fontWeight: selected ? 500 : 400, transition: "all 0.15s"
            }}>{r}</button>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        {current > 0 && <button onClick={() => setCurrent(c => c - 1)} style={{ flex: 1, padding: 12, borderRadius: 10, background: SURF1, border: `0.5px solid ${BORDER}`, cursor: "pointer", fontSize: 15 }}>← Précédent</button>}
        {isLast && answers[q.id] && (
          <button onClick={onNext} style={{ flex: 2, padding: 12, borderRadius: 10, background: "#1F4E79", color: "#fff", border: "none", cursor: "pointer", fontSize: 15, fontWeight: 500 }}>
            Continuer →
          </button>
        )}
      </div>
    </div>
  );
}

function StepNumerology({ birthdate, onChange, onNext, onBack }) {
  const lifeNum = calcLifeNumber(birthdate);
  const numInfo = lifeNum ? NUMEROLOGIE_REST[lifeNum] : null;

  return (
    <div>
      <StepHeader emoji="🔢" title="Votre chiffre de vie" subtitle="Votre date de naissance révèle votre profil numérologique structurel." />
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", fontSize: 14, color: TXT2, marginBottom: 8 }}>Date de naissance</label>
        <input type="date" value={birthdate} onChange={e => onChange(e.target.value)}
          style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `0.5px solid ${BORDER}`, fontSize: 15, background: SURF2, color: TXT, boxSizing: "border-box" }} />
      </div>
      {lifeNum && numInfo && (
        <div style={{ background: "#FFF9C4", border: "1px solid #C55A11", borderRadius: 12, padding: "16px 20px", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#1F4E79", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 20, fontWeight: 500 }}>{lifeNum}</div>
            <div>
              <div style={{ fontWeight: 500, fontSize: 16, color: "#1F4E79" }}>{numInfo.label}</div>
              <div style={{ fontSize: 13, color: "#C55A11" }}>Chiffre de vie {lifeNum}</div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: "#555", lineHeight: 1.5 }}>
            <strong>Déficit structurel :</strong> {numInfo.deficit}<br />
            <strong>Pratique prioritaire :</strong> {numInfo.pratique}
          </div>
        </div>
      )}
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onBack} style={{ flex: 1, padding: 12, borderRadius: 10, background: SURF1, border: `0.5px solid ${BORDER}`, cursor: "pointer", fontSize: 15 }}>←</button>
        <button onClick={onNext} disabled={!birthdate}
          style={{ flex: 3, padding: 12, borderRadius: 10, background: birthdate ? "#1F4E79" : BORDER, color: birthdate ? "#fff" : MUTED, border: "none", cursor: birthdate ? "pointer" : "default", fontSize: 15, fontWeight: 500 }}>
          Continuer →
        </button>
      </div>
    </div>
  );
}

function StepHD({ hdType, onChange, onNext, onBack }) {
  return (
    <div>
      <StepHeader emoji="⚡" title="Votre type Human Design" subtitle="Chaque type a un mode de récupération différent. Sélectionnez le vôtre (basé sur date, heure et lieu de naissance si vous l'avez déjà calculé)." />
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {HD_TYPES.map(t => {
          const selected = hdType === t.value;
          return (
            <button key={t.value} onClick={() => onChange(t.value)} style={{
              padding: "12px 16px", borderRadius: 10, textAlign: "left", cursor: "pointer",
              background: selected ? "#EDE7F6" : SURF2, border: selected ? "2px solid #4A148C" : `0.5px solid ${BORDER}`,
              display: "flex", alignItems: "center", gap: 12, transition: "all 0.15s"
            }}>
              <div style={{ minWidth: 40, textAlign: "center" }}>
                {t.pct && <div style={{ fontSize: 11, color: selected ? "#4A148C" : MUTED, fontWeight: 500 }}>{t.pct}</div>}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: selected ? 500 : 400, color: selected ? "#4A148C" : TXT }}>{t.label}</div>
                {t.desc && <div style={{ fontSize: 12, color: TXT2 }}>{t.desc}</div>}
              </div>
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onBack} style={{ flex: 1, padding: 12, borderRadius: 10, background: SURF1, border: `0.5px solid ${BORDER}`, cursor: "pointer", fontSize: 15 }}>←</button>
        <button onClick={onNext} disabled={!hdType}
          style={{ flex: 3, padding: 12, borderRadius: 10, background: hdType ? "#1F4E79" : BORDER, color: hdType ? "#fff" : MUTED, border: "none", cursor: hdType ? "pointer" : "default", fontSize: 15, fontWeight: 500 }}>
          Voir mon profil →
        </button>
      </div>
    </div>
  );
}

function ResultCard({ label, value, color, bg }) {
  return (
    <div style={{ background: bg, border: `1px solid ${color}40`, borderRadius: 10, padding: "12px 16px", marginBottom: 10 }}>
      <div style={{ fontSize: 12, color, fontWeight: 500, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 14, color: TXT, lineHeight: 1.5 }}>{value}</div>
    </div>
  );
}

function StepResults({ data, onRestart }) {
  const { prenom, answers, birthdate, hdType } = data;
  const deficits = getDeficits(answers);
  const lifeNum = calcLifeNumber(birthdate);
  const numInfo = lifeNum ? NUMEROLOGIE_REST[lifeNum] : null;
  const hdInfo = HD_REST[hdType] || HD_REST.unknown;
  const hdLabel = HD_TYPES.find(t => t.value === hdType)?.label || "Non défini";
  const activities = getRecommendedActivities(deficits, hdType);
  const [pdfState, setPdfState] = useState("idle"); // idle | loading | done | error

  function generatePDF() {
    if (typeof window === "undefined" || !window.jspdf) {
      setPdfState("error");
      return;
    }
    setPdfState("loading");
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
    const margin = 20;
    let y = 20;

    doc.setFillColor(31, 78, 121);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22); doc.setFont("helvetica", "bold");
    doc.text("BRAÑA SANA", 105, 18, { align: "center" });
    doc.setFontSize(11); doc.setFont("helvetica", "normal");
    doc.text("La Borbolla · Llanes · Asturias", 105, 26, { align: "center" });
    doc.text(prenom ? `Programme de repos personnalisé — ${prenom}` : "Programme de repos personnalisé", 105, 33, { align: "center" });
    y = 55;

    doc.setTextColor(31, 78, 121); doc.setFontSize(13); doc.setFont("helvetica", "bold");
    doc.text("VOTRE PORTRAIT DE REPOS — 3 DIMENSIONS", margin, y); y += 8;

    doc.setFillColor(252, 228, 214); doc.rect(margin, y, 170, 7, "F");
    doc.setTextColor(192, 0, 0); doc.setFontSize(10); doc.setFont("helvetica", "bold");
    doc.text("Déficits prioritaires (Dalton-Smith)", margin + 3, y + 5); y += 10;
    doc.setTextColor(50, 50, 50); doc.setFont("helvetica", "normal"); doc.setFontSize(9);
    if (deficits.critical.length) { doc.text("Critique : " + deficits.critical.map(k => DALTON_QUESTIONS.find(q => q.id === k)?.label).join(", "), margin + 3, y); y += 5; }
    if (deficits.watch.length) { doc.text("Attention : " + deficits.watch.map(k => DALTON_QUESTIONS.find(q => q.id === k)?.label).join(", "), margin + 3, y); y += 5; }
    if (deficits.good.length) { doc.text("Bon niveau : " + deficits.good.map(k => DALTON_QUESTIONS.find(q => q.id === k)?.label).join(", "), margin + 3, y); y += 8; }

    if (numInfo) {
      doc.setFillColor(255, 249, 196); doc.rect(margin, y, 170, 7, "F");
      doc.setTextColor(197, 90, 17); doc.setFont("helvetica", "bold"); doc.setFontSize(10);
      doc.text(`Numérologie — Chiffre ${lifeNum} : ${numInfo.label}`, margin + 3, y + 5); y += 10;
      doc.setTextColor(50, 50, 50); doc.setFont("helvetica", "normal"); doc.setFontSize(9);
      doc.text("Pratique : " + numInfo.pratique, margin + 3, y); y += 8;
    }

    doc.setFillColor(237, 231, 246); doc.rect(margin, y, 170, 7, "F");
    doc.setTextColor(74, 20, 140); doc.setFont("helvetica", "bold"); doc.setFontSize(10);
    doc.text(`Human Design — ${hdLabel}`, margin + 3, y + 5); y += 10;
    doc.setTextColor(50, 50, 50); doc.setFont("helvetica", "normal"); doc.setFontSize(9);
    doc.text("Repos : " + hdInfo.rest, margin + 3, y); y += 5;
    doc.text(hdInfo.note, margin + 3, y, { maxWidth: 164 }); y += 12;

    doc.setFillColor(31, 78, 121); doc.rect(margin, y, 170, 7, "F");
    doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(10);
    doc.text("ACTIVITÉS RECOMMANDÉES À BRAÑA SANA", margin + 3, y + 5); y += 12;
    doc.setTextColor(50, 50, 50); doc.setFont("helvetica", "normal"); doc.setFontSize(9);
    activities.forEach((a, i) => { doc.text(`${i + 1}. ${a}`, margin + 3, y); y += 6; });

    y += 8;
    doc.setFillColor(226, 239, 218); doc.rect(margin, y, 170, 20, "F");
    doc.setTextColor(55, 86, 35); doc.setFont("helvetica", "bold"); doc.setFontSize(10);
    doc.text("Prêt à vivre ce programme ?", margin + 3, y + 7);
    doc.setFont("helvetica", "normal"); doc.setFontSize(9);
    doc.text("branasana.com · La Borbolla, Llanes, Asturias", margin + 3, y + 13);

    doc.save(`profil-repos-brana-sana${prenom ? "-" + prenom.toLowerCase() : ""}.pdf`);
    setPdfState("done");
  }

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
        <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 500, color: "#1F4E79" }}>{prenom ? `Le profil de repos de ${prenom}` : "Votre profil de repos"}</h2>
        <p style={{ margin: 0, fontSize: 13, color: TXT2 }}>3 dimensions analysées · Programme personnalisé</p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#1F4E79", marginBottom: 10, letterSpacing: "0.02em" }}>Dalton-Smith — Types de repos</div>
        {deficits.critical.map(k => { const q = DALTON_QUESTIONS.find(q => q.id === k); return <ResultCard key={k} label="🔴 Déficit prioritaire" value={`${q.emoji} ${q.label}`} color="#C00000" bg="#FCE4D6" />; })}
        {deficits.watch.map(k => { const q = DALTON_QUESTIONS.find(q => q.id === k); return <ResultCard key={k} label="🟡 Zone d'attention" value={`${q.emoji} ${q.label}`} color="#C55A11" bg="#FFF3CD" />; })}
        {deficits.good.map(k => { const q = DALTON_QUESTIONS.find(q => q.id === k); return <ResultCard key={k} label="✅ Bon niveau" value={`${q.emoji} ${q.label}`} color="#375623" bg="#E2EFDA" />; })}
      </div>

      {numInfo && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: "#1F4E79", marginBottom: 10, letterSpacing: "0.02em" }}>Numérologie</div>
          <ResultCard label={`Chiffre de vie ${lifeNum}`} value={`${numInfo.label} · ${numInfo.pratique}`} color="#C55A11" bg="#FFF9C4" />
        </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#1F4E79", marginBottom: 10, letterSpacing: "0.02em" }}>Human Design</div>
        <ResultCard label={hdLabel} value={`${hdInfo.rest} · ${hdInfo.note}`} color="#4A148C" bg="#EDE7F6" />
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#1F4E79", marginBottom: 10, letterSpacing: "0.02em" }}>Activités recommandées à Braña Sana</div>
        <div style={{ background: SURF1, borderRadius: 12, padding: "16px 20px" }}>
          {activities.map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderBottom: i < activities.length - 1 ? `0.5px solid ${BORDER}` : "none" }}>
              <span style={{ color: "#1F4E79", fontWeight: 500, minWidth: 20, fontSize: 13 }}>{i + 1}.</span>
              <span style={{ fontSize: 14, color: TXT, lineHeight: 1.4 }}>{a}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <button onClick={generatePDF} style={{ flex: 1, padding: 12, borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: "pointer", background: pdfState === "done" ? "#E2EFDA" : "#1F4E79", color: pdfState === "done" ? "#375623" : "#fff", border: "none" }}>
          {pdfState === "done" ? "✅ PDF téléchargé" : pdfState === "loading" ? "Génération…" : "📄 Télécharger le PDF"}
        </button>
      </div>
      {pdfState === "error" && (
        <div style={{ textAlign: "center", padding: "10px", borderRadius: 8, background: "#FCE4D6", color: "#C00000", fontSize: 13, marginBottom: 12 }}>
          Le moteur PDF ne s'est pas chargé — réessaie dans un instant.
        </div>
      )}

      <button onClick={onRestart} style={{ width: "100%", padding: 12, borderRadius: 10, background: SURF1, border: `0.5px solid ${BORDER}`, cursor: "pointer", fontSize: 14, color: TXT2 }}>
        Recommencer pour un autre profil
      </button>
    </div>
  );
}

// ─── APP PRINCIPALE ────────────────────────────────────────────────────────

export default function BranaSanaApp() {
  const [step, setStep] = useState(0);
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [daltonAnswers, setDaltonAnswers] = useState({});
  const [birthdate, setBirthdate] = useState("");
  const [hdType, setHdType] = useState("");

  useEffect(() => {
    if (window.jspdf) return;
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const STEPS = ["intro", "dalton", "numerology", "hd", "results"];
  const totalSteps = STEPS.length;

  function handleDaltonChange(id, val) {
    setDaltonAnswers(prev => ({ ...prev, [id]: val }));
  }
  function handleNext() { setStep(s => Math.min(s + 1, totalSteps - 1)); }
  function handleBack() { setStep(s => Math.max(s - 1, 0)); }
  function handleRestart() {
    setStep(0); setPrenom(""); setNom(""); setDaltonAnswers({}); setBirthdate(""); setHdType("");
  }

  const showProgress = step > 0 && step < totalSteps - 1;

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px", fontFamily: "system-ui, -apple-system, sans-serif", minHeight: "100vh", background: "#FDFCFA" }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: MUTED, fontStyle: "italic" }}>Braña Sana · La Borbolla — aperçu de test</div>
      </div>
      {showProgress && <ProgressBar step={step} total={totalSteps - 1} />}
      {step === 0 && <StepIntro prenom={prenom} nom={nom} onChangePrenom={setPrenom} onChangeNom={setNom} onNext={handleNext} />}
      {step === 1 && <StepDalton answers={daltonAnswers} onChange={handleDaltonChange} onNext={handleNext} onBack={handleBack} />}
      {step === 2 && <StepNumerology birthdate={birthdate} onChange={setBirthdate} onNext={handleNext} onBack={handleBack} />}
      {step === 3 && <StepHD hdType={hdType} onChange={setHdType} onNext={handleNext} onBack={handleBack} />}
      {step === 4 && <StepResults data={{ prenom, nom, answers: daltonAnswers, birthdate, hdType }} onRestart={handleRestart} />}
    </div>
  );
}
