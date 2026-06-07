"use client";

import { useState, useEffect } from "react";

// ============================================================
//  ★ GAS Web App URL をここに貼り付けてください
// ============================================================
const GAS_URL = "https://script.google.com/macros/s/AKfycbzd_RBDM1L0LM5KgV92cWTU7rix7uXZmVKl6jEwofI_bEFXbKrDPUohaIrybYLzvwUg/exec";

const STAFF_KEY = "checkin_staffs_v3";
const STORE_KEY = "checkin_stores_v2";

const DEFAULT_STORES = [
  "Arbre et chimie",
  "Choupinet by Arbre et chimie",
  "Miroir EYELASH&BROW",
  "Liora nail&eye",
  "SHINCA三鷹店",
];

const MBTI_LIST = [
  { value: "", label: "未診断", hint: "" },
  { value: "INTJ", label: "建築家", hint: "戦略的・独立心が強い・長期ビジョン重視。論理的根拠のない指示を嫌う。" },
  { value: "INTP", label: "論理学者", hint: "知的好奇心旺盛・理論派・独自の視点。急かされたり感情論を押しつけられると萎縮。" },
  { value: "ENTJ", label: "指揮官", hint: "大胆なリーダー・効率重視・目標達成型。マイクロマネジメントは禁物。" },
  { value: "ENTP", label: "討論者", hint: "アイデア豊富・変化好き・ルーティン嫌い。新しい挑戦で一気にやる気が上がる。" },
  { value: "INFJ", label: "提唱者", hint: "深い洞察・理想主義・他者の成長を支援。表面的な会話より本質的なつながりを求める。" },
  { value: "INFP", label: "仲介者", hint: "共感力高い・価値観重視・クリエイティブ。数字だけの評価や冷徹な指示は心が閉じやすい。" },
  { value: "ENFJ", label: "主人公", hint: "カリスマ性・人の可能性を引き出す・利他的。チームの対立に巻き込まれると消耗する。" },
  { value: "ENFP", label: "運動家", hint: "情熱的・自由奔放・可能性の開拓が好き。束縛・管理・細かいルールで意欲が急落。" },
  { value: "ISTJ", label: "管理者", hint: "責任感が強い・細部まで丁寧・ルール重視。急な変更や根拠のない指示はストレスになる。" },
  { value: "ISFJ", label: "擁護者", hint: "献身的・温かい・縁の下で人を支える。感謝がないと静かに疲弊していく。" },
  { value: "ESTJ", label: "幹部", hint: "秩序と効率を好む・計画的・現実的な管理者。曖昧な評価基準や場当たり指示は不満の元。" },
  { value: "ESFJ", label: "領事", hint: "思いやり深い・チームの和を大切にする・人気者。批判や対立を正面から受けると傷つきやすい。" },
  { value: "ISTP", label: "巨匠", hint: "技術探求・実用的・問題解決が得意。感情的なやり取りより具体的な対話が響く。" },
  { value: "ISFP", label: "冒険家", hint: "感性豊か・おだやか・自分のペースを大切に。比較や競争の強制は逆効果。" },
  { value: "ESTP", label: "起業家", hint: "行動力抜群・臨機応変・スピード解決型。机上の空論的な長い説明より実践ファースト。" },
  { value: "ESFP", label: "エンターテイナー", hint: "場を明るくする・柔軟・今を楽しむ。長期の不確かなコミットを強制されると苦手。" },
];

const ENNEA_LIST = [
  { value: "", label: "未診断" },
  { value: "タイプ1", label: "タイプ1 — 改革する人（完璧主義・誠実）" },
  { value: "タイプ2", label: "タイプ2 — 助ける人（思いやり・愛されたい）" },
  { value: "タイプ3", label: "タイプ3 — 達成する人（野心・評価重視）" },
  { value: "タイプ4", label: "タイプ4 — 個性を求める人（繊細・独自性）" },
  { value: "タイプ5", label: "タイプ5 — 調べる人（知識欲・冷静）" },
  { value: "タイプ6", label: "タイプ6 — 忠実な人（安定・信頼・リスク回避）" },
  { value: "タイプ7", label: "タイプ7 — 熱中する人（楽観・新体験）" },
  { value: "タイプ8", label: "タイプ8 — 挑戦する人（自信・リーダー）" },
  { value: "タイプ9", label: "タイプ9 — 平和をもたらす人（調和・衝突回避）" },
];

const NLP_LIST = [
  { value: "", label: "未診断" },
  { value: "Visual", label: "Visual（視覚型）" },
  { value: "Auditory", label: "Auditory（聴覚型）" },
  { value: "Kinesthetic", label: "Kinesthetic（体感型）" },
];

const ROLES = ["アイリスト","ネイリスト","ヘアスタイリスト","アイブロウリスト","美容師","受付","店長","業務委託","その他"];
const EMPLOYS = ["正社員","パート","時短社員","業務委託"];
const TOPICS = ["技術・スキルアップ","接客・お客様対応","人間関係","キャリア・将来","体力・健康","給与・評価","プライベート","職場環境"];
const FOCUSES = ["本人の気持ちを引き出す","具体的な改善アクションを決める","キャリアビジョンを深める","モチベーションを上げる","関係性の信頼を深める"];

const P = {
  pink: "#C97A96", pinkL: "#FAF0F4", pinkM: "#E8C4D4", pinkD: "#72243E",
  bg: "#FAFAF9", card: "#FFFFFF", border: "#EDE8E4",
  text: "#2C2826", sub: "#8C7B74", light: "#B8A8A0",
  green: "#4a9a6a", greenL: "#edf7f2", greenM: "#b8dfc9",
  amber: "#b87a20", amberL: "#fdf5e8", amberM: "#f0d090",
};

const s = {
  card: { background: P.card, border: `1px solid ${P.border}`, borderRadius: 14, padding: "16px 18px", marginBottom: 12 },
  label: { fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: P.light, marginBottom: 10, display: "block" },
  input: { width: "100%", border: `1px solid ${P.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 13, color: P.text, background: P.bg, outline: "none", fontFamily: "inherit", boxSizing: "border-box" },
  select: { width: "100%", border: `1px solid ${P.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 13, color: P.text, background: P.bg, outline: "none", fontFamily: "inherit", appearance: "none", boxSizing: "border-box", cursor: "pointer" },
  btnPrimary: { width: "100%", padding: "11px 0", borderRadius: 10, border: "none", background: P.pink, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  btnGhost: { padding: "7px 14px", borderRadius: 8, border: `1px solid ${P.border}`, background: P.card, color: P.sub, fontSize: 12, cursor: "pointer", fontFamily: "inherit" },
  btnDanger: { padding: "7px 14px", borderRadius: 8, border: `1px solid ${P.pinkM}`, background: P.pinkL, color: P.pinkD, fontSize: 12, cursor: "pointer", fontFamily: "inherit" },
};

function Badge({ children, variant = "default" }) {
  const styles = {
    default: { background: "#F5F0EE", color: P.sub, border: `1px solid ${P.border}` },
    pink: { background: P.pinkL, color: P.pinkD, border: `1px solid ${P.pinkM}` },
    green: { background: P.greenL, color: P.green, border: `1px solid ${P.greenM}` },
    amber: { background: P.amberL, color: P.amber, border: `1px solid ${P.amberM}` },
  };
  return (
    <span style={{ fontSize: 11, fontWeight: 500, padding: "2px 9px", borderRadius: 20, ...styles[variant] }}>
      {children}
    </span>
  );
}

function Chip({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      fontSize: 12, padding: "5px 13px", borderRadius: 20, cursor: "pointer", fontFamily: "inherit",
      border: `1px solid ${active ? P.pinkM : P.border}`,
      background: active ? P.pinkL : P.card,
      color: active ? P.pinkD : P.sub,
    }}>{label}</button>
  );
}

function Slider({ label, value, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
      <span style={{ fontSize: 12, color: P.text, width: 130, flexShrink: 0 }}>{label}</span>
      <input type="range" min={1} max={5} step={1} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ flex: 1, accentColor: P.pink }} />
      <span style={{ fontSize: 13, fontWeight: 600, color: P.pink, width: 24, textAlign: "right", flexShrink: 0 }}>{value}</span>
    </div>
  );
}

function Avatar({ name }) {
  return (
    <div style={{ width: 38, height: 38, borderRadius: "50%", background: P.pinkL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 600, color: P.pinkD, flexShrink: 0 }}>
      {name?.[0] ?? "?"}
    </div>
  );
}

function SelectWrapper({ children }) {
  return (
    <div style={{ position: "relative" }}>
      {children}
      <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", fontSize: 10, color: P.light }}>▼</span>
    </div>
  );
}

function getLabel(v) {
  return v <= 1 ? "非常に低い" : v <= 2 ? "低め" : v <= 3 ? "普通" : v <= 4 ? "良好" : "非常に高い";
}

// ── 自己評価シートバナー ──
function EvalBanner({ eval: ev, expanded, onToggle }) {
  if (!ev) return null;

  const hasData = ev.success || ev.improve || ev.agendaRequest || ev.request;
  const perfAvg = [ev.skill, ev.service, ev.timeManagement, ev.teamwork]
    .map(Number).filter(Boolean);
  const avg = perfAvg.length ? (perfAvg.reduce((a,b)=>a+b,0)/perfAvg.length).toFixed(1) : null;

  // モチベーション低 or ストレス高 → amber警告
  const motiv = Number(ev.motivation);
  const stress = Number(ev.stress);
  const isAlert = motiv <= 2 || stress >= 4;

  return (
    <div style={{
      border: `1px solid ${isAlert ? P.amberM : P.greenM}`,
      background: isAlert ? P.amberL : P.greenL,
      borderRadius: 10, marginBottom: 12, overflow: "hidden"
    }}>
      {/* ヘッダー行 */}
      <div onClick={onToggle} style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 14px", cursor: "pointer"
      }}>
        <span style={{ fontSize: 16 }}>{isAlert ? "⚠️" : "✅"}</span>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: isAlert ? P.amber : P.green }}>
            自己評価シートが届いています
          </span>
          {avg && (
            <span style={{ fontSize: 11, color: P.sub, marginLeft: 8 }}>
              パフォーマンス平均 {avg}/5
            </span>
          )}
        </div>
        <Badge variant={isAlert ? "amber" : "green"}>
          {isAlert ? "要注意" : "良好"}
        </Badge>
        <span style={{ fontSize: 11, color: P.sub }}>{expanded ? "▲" : "▼"}</span>
      </div>

      {/* 展開コンテンツ */}
      {expanded && hasData && (
        <div style={{ borderTop: `1px solid ${isAlert ? P.amberM : P.greenM}`, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
          {/* スコア行 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
            {[
              ["やりがい", ev.motivation],
              ["しんどさ", ev.stress],
              ["技術自信", ev.skill],
            ].map(([label, val]) => (
              <div key={label} style={{ background: "rgba(255,255,255,0.7)", borderRadius: 8, padding: "7px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: P.pink }}>{val || "—"}</div>
                <div style={{ fontSize: 10, color: P.sub, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>

          {[
            ["成功体験", ev.success],
            ["改善したいこと", ev.improve],
            ["生活環境の変化", ev.lifeChange],
            ["会社への要望", ev.request],
            ["面談で話したいこと", ev.agendaRequest],
          ].filter(([,v]) => v).map(([label, val]) => (
            <div key={label}>
              <div style={{ fontSize: 10, fontWeight: 600, color: P.sub, letterSpacing: "0.06em", marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 12, color: P.text, lineHeight: 1.8, background: "rgba(255,255,255,0.6)", borderRadius: 6, padding: "6px 10px" }}>{val}</div>
            </div>
          ))}

          {ev.skillsWanted && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: P.sub, letterSpacing: "0.06em", marginBottom: 4 }}>習得したいスキル</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {ev.skillsWanted.split(", ").filter(Boolean).map(s => (
                  <Badge key={s} variant="pink">{s}</Badge>
                ))}
              </div>
            </div>
          )}

          {ev.careerDirection && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: P.sub, letterSpacing: "0.06em", marginBottom: 3 }}>キャリア方向性</div>
              <div style={{ fontSize: 12, color: P.text }}>{ev.careerDirection}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main App ──
export default function App() {
  const [tab, setTab] = useState("checkin");
  const [staffs, setStaffs] = useState([]);
  const [stores, setStores] = useState([]);
  const [current, setCurrent] = useState(null);
  const [form, setForm] = useState({});
  const [editId, setEditId] = useState(null);
  const [newStore, setNewStore] = useState("");

  // checkin state
  const [motiv, setMotiv] = useState(3);
  const [energy, setEnergy] = useState(4);
  const [team, setTeam] = useState(3);
  const [skill, setSkill] = useState(3);
  const [topics, setTopics] = useState([]);
  const [focus, setFocus] = useState("本人の気持ちを引き出す");
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // 自己評価シート関連
  const [evalData, setEvalData] = useState(null);
  const [evalLoading, setEvalLoading] = useState(false);
  const [evalExpanded, setEvalExpanded] = useState(true);

  useEffect(() => {
    try { setStaffs(JSON.parse(localStorage.getItem(STAFF_KEY)) || []); } catch { setStaffs([]); }
    try {
      const s = JSON.parse(localStorage.getItem(STORE_KEY));
      setStores(s?.length ? s : [...DEFAULT_STORES]);
    } catch { setStores([...DEFAULT_STORES]); }
  }, []);

  const saveStaffs = (list) => { setStaffs(list); localStorage.setItem(STAFF_KEY, JSON.stringify(list)); };
  const saveStores = (list) => { setStores(list); localStorage.setItem(STORE_KEY, JSON.stringify(list)); };

  const emptyForm = () => setForm({ name: "", store: "", role: "アイリスト", employ: "正社員", mbti: "", nlp: "", ennea: "", note: "" });

  // スタッフ選択時にGASから最新の自己評価を取得
  const selectStaff = async (sf) => {
    setCurrent(sf);
    setResult(null);
    setEvalData(null);
    setEvalExpanded(true);

    if (!GAS_URL || GAS_URL.includes("★")) return;

    setEvalLoading(true);
    try {
      const res = await fetch(`${GAS_URL}?name=${encodeURIComponent(sf.name)}`);
      const json = await res.json();
      if (json.status === "ok") {
        setEvalData(json.data);
        // 自己評価のスライダー値をプリセット（参考値として）
        if (json.data.motivation) setMotiv(Number(json.data.motivation));
        if (json.data.stress) {
          // しんどさが高い → energyを低めに反映
          const st = Number(json.data.stress);
          setEnergy(Math.max(1, 6 - st));
        }
      }
    } catch (e) {
      // GAS未設定 or ネットワークエラー → 無視
    }
    setEvalLoading(false);
  };

  const handleSaveStaff = () => {
    if (!form.name?.trim()) return alert("氏名を入力してください");
    const data = { ...form, id: editId || "s" + Date.now() };
    const next = editId ? staffs.map(s => s.id === editId ? data : s) : [data, ...staffs];
    saveStaffs(next);
    if (current?.id === editId) setCurrent(data);
    setEditId(null);
    emptyForm();
    setTab("manage");
  };

  const handleEditStaff = (s) => { setForm({ ...s }); setEditId(s.id); setTab("manage"); };
  const handleDeleteStaff = (id) => {
    if (!confirm("削除しますか？")) return;
    saveStaffs(staffs.filter(s => s.id !== id));
    if (current?.id === id) { setCurrent(null); setEvalData(null); }
  };

  const handleAddStore = () => {
    if (!newStore.trim() || stores.includes(newStore.trim())) return;
    saveStores([...stores, newStore.trim()]);
    setNewStore("");
  };

  const mbtiHint = MBTI_LIST.find(m => m.value === form.mbti)?.hint || "";

  const toggleTopic = (t) => setTopics(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const parseOutput = (text) => {
    const pats = [/1[\.\．](.+?)(?=2[\.\．]|$)/s, /2[\.\．](.+?)(?=3[\.\．]|$)/s, /3[\.\．](.+?)(?=4[\.\．]|$)/s, /4[\.\．](.+?)(?=5[\.\．]|$)/s, /5[\.\．](.+?)$/s];
    return pats.map(p => { const m = text.match(p); return m ? m[1].trim() : ""; });
  };

  const generate = async () => {
    if (!current) return alert("スタッフを選択してください");
    setLoading(true); setResult(null);

    // 自己評価データのテキスト化
    const evalSection = evalData ? `
【自己評価シートより（面談前提出）】
パフォーマンス: 技術${evalData.skill}/5・接客${evalData.service}/5・時間管理${evalData.timeManagement}/5・チームワーク${evalData.teamwork}/5
やりがい: ${evalData.motivation}/5 / しんどさ: ${evalData.stress}/5
${evalData.atmosphereComment ? `職場雰囲気コメント: ${evalData.atmosphereComment}` : ""}
${evalData.lifeChange ? `生活環境の変化: ${evalData.lifeChange}` : ""}
${evalData.success ? `成功体験: ${evalData.success}` : ""}
${evalData.improve ? `改善したいこと: ${evalData.improve}` : ""}
${evalData.skillsWanted ? `習得したいスキル: ${evalData.skillsWanted}` : ""}
${evalData.careerDirection ? `キャリア方向性: ${evalData.careerDirection}` : ""}
${evalData.request ? `会社への要望: ${evalData.request}` : ""}
${evalData.agendaRequest ? `面談で話したいこと（本人希望）: ${evalData.agendaRequest}` : ""}
` : "";

    const prompt = `あなたは美容サロン経営者の1on1面談コーチです。以下の情報をもとに今日の面談プランを日本語で生成してください。

【スタッフ情報】
名前: ${current.name} / 職種: ${current.role} / 店舗: ${current.store||"未設定"} / 雇用: ${current.employ||"未設定"}
MBTI: ${current.mbti||"未診断"} / NLP: ${current.nlp||"未診断"} / エニアグラム: ${current.ennea||"未診断"}
${current.note ? `特記: ${current.note}` : ""}
${evalSection}
【当日の状態（オーナー確認値）】
モチベーション: ${motiv}/5（${getLabel(motiv)}）
体調・疲労感: ${energy}/5（${getLabel(energy)}）
チーム関係満足度: ${team}/5（${getLabel(team)}）
技術への自信: ${skill}/5（${getLabel(skill)}）
気になるテーマ: ${topics.join("、") || "なし"}
今日のフォーカス: ${focus}
${memo ? `オーナーメモ: ${memo}` : ""}

【指示】
自己評価シートのデータがある場合はそれを最優先の情報源として活用してください。
スタッフが「面談で話したいこと」として書いた内容は必ずアジェンダに含めてください。
スコアが低い項目とテーマを優先し、MBTI・NLP・エニアグラムを組み合わせた具体的な提案を出力してください。

以下5項目を各2〜4文で:
1. 今日のアジェンダ（優先順）
2. 最初の一言・アイスブレイク（具体的なセリフ例を含む）
3. 今日意識すべきコミュニケーションスタイル
4. 今日のNGワード・注意点
5. 面談の締め・次回への橋渡し（具体的な一言例を含む）`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
      });
      const data = await res.json();
      const text = data.content.map(b => b.text || "").join("");
      const secs = parseOutput(text);
      setResult({ agenda: secs[0], opener: secs[1], comm: secs[2], ng: secs[3], close: secs[4], motiv, energy, team });
    } catch {
      setResult({ agenda: "エラーが発生しました。もう一度お試しください。", opener: "", comm: "", ng: "", close: "", motiv, energy, team });
    }
    setLoading(false);
  };

  const tabs = [
    { id: "checkin", label: "面談チェックイン" },
    { id: "manage", label: "スタッフ管理" },
    { id: "stores", label: "店舗管理" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: P.bg, fontFamily: "'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif", padding: "16px" }}>
      {/* タブ */}
      <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", border: `1px solid ${P.border}`, marginBottom: 16 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: "9px 4px", fontSize: 11, fontWeight: 600, border: "none",
            background: tab === t.id ? P.pink : "#F5F0EE",
            color: tab === t.id ? "#fff" : P.sub,
            cursor: "pointer", fontFamily: "inherit",
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── チェックイン ── */}
      {tab === "checkin" && (
        <div>
          <div style={s.card}>
            <span style={s.label}>Step 1 — スタッフを選ぶ</span>
            {staffs.length === 0 ? (
              <div style={{ textAlign: "center", color: P.light, fontSize: 13, padding: "16px 0" }}>スタッフ管理タブから登録してください</div>
            ) : staffs.map(sf => (
              <div key={sf.id} onClick={() => selectStaff(sf)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 9, border: `1px solid ${current?.id === sf.id ? P.pink : P.border}`, background: current?.id === sf.id ? P.pinkL : P.card, cursor: "pointer", marginBottom: 7 }}>
                <Avatar name={sf.name} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{sf.name}</span>
                    <Badge variant="pink">{sf.role}</Badge>
                  </div>
                  <div style={{ fontSize: 11, color: P.light, marginTop: 2 }}>{sf.store || "店舗未設定"}</div>
                </div>
                {sf.mbti && <Badge>{sf.mbti}</Badge>}
              </div>
            ))}
          </div>

          {current && (
            <>
              {/* スタッフ情報カード */}
              <div style={{ ...s.card, background: P.pinkL, border: `1px solid ${P.pinkM}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar name={current.name} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 14, fontWeight: 700 }}>{current.name}</span>
                      <Badge variant="pink">{current.role}</Badge>
                      <Badge>{current.store || "—"}</Badge>
                    </div>
                    <div style={{ display: "flex", gap: 5, marginTop: 5, flexWrap: "wrap" }}>
                      <Badge>{current.mbti || "未診断"}</Badge>
                      <Badge>{current.nlp || "未診断"}</Badge>
                      <Badge>{current.ennea || "未診断"}</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* 自己評価シートバナー */}
              {evalLoading ? (
                <div style={{ ...s.card, textAlign: "center", color: P.light, fontSize: 12, padding: "14px" }}>
                  自己評価シートを読み込み中...
                </div>
              ) : (
                <EvalBanner
                  eval={evalData}
                  expanded={evalExpanded}
                  onToggle={() => setEvalExpanded(e => !e)}
                />
              )}
            </>
          )}

          <div style={s.card}>
            <span style={s.label}>Step 2 — 当日の状態を確認</span>
            <Slider label="モチベーション" value={motiv} onChange={setMotiv} />
            <Slider label="体調・疲労感" value={energy} onChange={setEnergy} />
            <Slider label="チーム関係の満足度" value={team} onChange={setTeam} />
            <Slider label="技術への自信" value={skill} onChange={setSkill} />

            <div style={{ fontSize: 12, color: P.sub, fontWeight: 600, margin: "6px 0 8px" }}>気になるテーマ（複数可）</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 14 }}>
              {TOPICS.map(t => <Chip key={t} label={t} active={topics.includes(t)} onClick={() => toggleTopic(t)} />)}
            </div>

            <div style={{ fontSize: 12, color: P.sub, fontWeight: 600, marginBottom: 6 }}>オーナーメモ</div>
            <textarea value={memo} onChange={e => setMemo(e.target.value)} rows={3}
              placeholder="例：先週技術でミスがあって落ち込んでいた様子だった..."
              style={{ ...s.input, resize: "none", marginBottom: 14 }} />

            <div style={{ fontSize: 12, color: P.sub, fontWeight: 600, marginBottom: 8 }}>今日の面談フォーカス</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {FOCUSES.map(f => <Chip key={f} label={f} active={focus === f} onClick={() => setFocus(f)} />)}
            </div>
          </div>

          <button onClick={generate} disabled={loading}
            style={{ ...s.btnPrimary, opacity: loading ? 0.5 : 1 }}>
            {loading ? "生成中..." : "✦ 今日の面談プランをAI生成する"}
          </button>

          {result && (
            <div style={{ ...s.card, marginTop: 14, background: "#FDFBFA" }}>
              <span style={s.label}>今日の面談プラン</span>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 14 }}>
                {[["モチベーション", result.motiv], ["体調・疲労", result.energy], ["チーム満足度", result.team]].map(([l, v]) => (
                  <div key={l} style={{ background: P.card, border: `1px solid ${P.border}`, borderRadius: 9, padding: "8px 10px", textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: P.pink }}>{v}/5</div>
                    <div style={{ fontSize: 10, color: P.light, marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>

              {[
                ["🎯 今日のアジェンダ（優先順）", result.agenda],
                ["💬 最初の一言・アイスブレイク", result.opener],
                ["🤝 コミュニケーションスタイル", result.comm],
                ["⚠️ NGワード・注意点", result.ng],
                ["✅ 締め・次回への橋渡し", result.close],
              ].map(([title, body]) => body && (
                <div key={title} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${P.border}` }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: P.sub, marginBottom: 6 }}>{title}</div>
                  <div style={{ fontSize: 13, color: P.text, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{body}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── スタッフ管理 ── */}
      {tab === "manage" && (
        <div>
          <div style={s.card}>
            <span style={s.label}>{editId ? "スタッフを編集" : "新規スタッフ登録"}</span>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 11, color: P.sub, marginBottom: 4 }}>氏名 *</div>
                <input style={s.input} placeholder="例：田中 さくら" value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: P.sub, marginBottom: 4 }}>所属店舗</div>
                <SelectWrapper>
                  <select style={s.select} value={form.store || ""} onChange={e => setForm(f => ({ ...f, store: e.target.value }))}>
                    <option value="">選択してください</option>
                    {stores.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                </SelectWrapper>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 11, color: P.sub, marginBottom: 4 }}>職種</div>
                <SelectWrapper>
                  <select style={s.select} value={form.role || "アイリスト"} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </SelectWrapper>
              </div>
              <div>
                <div style={{ fontSize: 11, color: P.sub, marginBottom: 4 }}>雇用形態</div>
                <SelectWrapper>
                  <select style={s.select} value={form.employ || "正社員"} onChange={e => setForm(f => ({ ...f, employ: e.target.value }))}>
                    {EMPLOYS.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </SelectWrapper>
              </div>
            </div>

            {/* MBTI */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: P.sub, marginBottom: 4 }}>
                MBTI
                <a href="https://www.16personalities.com/ja" target="_blank" rel="noreferrer"
                  style={{ marginLeft: 8, fontSize: 10, color: P.pink, textDecoration: "none" }}>
                  → 診断サイト
                </a>
              </div>
              <SelectWrapper>
                <select style={s.select} value={form.mbti || ""} onChange={e => setForm(f => ({ ...f, mbti: e.target.value }))}>
                  {MBTI_LIST.map(m => (
                    <option key={m.value} value={m.value}>
                      {m.value ? `${m.value} — ${m.label}` : "未診断"}
                    </option>
                  ))}
                </select>
              </SelectWrapper>
              {mbtiHint && (
                <div style={{ fontSize: 11, color: P.pink, background: P.pinkL, borderRadius: 7, padding: "6px 10px", marginTop: 6, lineHeight: 1.6 }}>
                  💡 {mbtiHint}
                </div>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 11, color: P.sub, marginBottom: 4 }}>
                  NLPタイプ
                  <a href="https://www.nlp-japan.co.jp/diagnosis/" target="_blank" rel="noreferrer"
                    style={{ marginLeft: 8, fontSize: 10, color: P.pink, textDecoration: "none" }}>
                    → 診断
                  </a>
                </div>
                <SelectWrapper>
                  <select style={s.select} value={form.nlp || ""} onChange={e => setForm(f => ({ ...f, nlp: e.target.value }))}>
                    {NLP_LIST.map(n => <option key={n.value} value={n.value}>{n.label}</option>)}
                  </select>
                </SelectWrapper>
              </div>
              <div>
                <div style={{ fontSize: 11, color: P.sub, marginBottom: 4 }}>
                  エニアグラム
                  <a href="https://enneagram.ne.jp/diagnosis" target="_blank" rel="noreferrer"
                    style={{ marginLeft: 8, fontSize: 10, color: P.pink, textDecoration: "none" }}>
                    → 診断
                  </a>
                </div>
                <SelectWrapper>
                  <select style={s.select} value={form.ennea || ""} onChange={e => setForm(f => ({ ...f, ennea: e.target.value }))}>
                    {ENNEA_LIST.map(n => <option key={n.value} value={n.value}>{n.label}</option>)}
                  </select>
                </SelectWrapper>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: P.sub, marginBottom: 4 }}>メモ</div>
              <textarea style={{ ...s.input, resize: "none" }} rows={2} placeholder="例：入社6ヶ月。技術は丁寧だが自己評価が低め。"
                value={form.note || ""} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={handleSaveStaff} style={{ ...s.btnPrimary, flex: 1 }}>
                {editId ? "変更を保存" : "登録する"}
              </button>
              {editId && (
                <button style={s.btnGhost} onClick={() => { setEditId(null); emptyForm(); }}>キャンセル</button>
              )}
            </div>
          </div>

          <div style={s.card}>
            <span style={s.label}>登録済みスタッフ</span>
            {staffs.length === 0 ? (
              <div style={{ textAlign: "center", color: P.light, fontSize: 13, padding: "16px 0" }}>まだ登録されていません</div>
            ) : staffs.map(sf => (
              <div key={sf.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: `1px solid ${P.border}` }}>
                <Avatar name={sf.name} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{sf.name}</span>
                    <Badge variant="pink">{sf.role}</Badge>
                    {sf.mbti && <Badge>{sf.mbti}</Badge>}
                  </div>
                  <div style={{ fontSize: 11, color: P.light, marginTop: 2 }}>{sf.store || "—"}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button style={s.btnGhost} onClick={() => handleEditStaff(sf)}>編集</button>
                  <button style={s.btnDanger} onClick={() => handleDeleteStaff(sf.id)}>削除</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 店舗管理 ── */}
      {tab === "stores" && (
        <div>
          <div style={s.card}>
            <span style={s.label}>店舗を追加</span>
            <div style={{ display: "flex", gap: 8 }}>
              <input style={{ ...s.input, flex: 1 }} placeholder="例：Arbre et chimie 川越店"
                value={newStore} onChange={e => setNewStore(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAddStore()} />
              <button style={{ ...s.btnGhost, whiteSpace: "nowrap" }} onClick={handleAddStore}>＋ 追加</button>
            </div>
          </div>

          <div style={s.card}>
            <span style={s.label}>登録済み店舗</span>
            {stores.length === 0 ? (
              <div style={{ textAlign: "center", color: P.light, fontSize: 13, padding: "16px 0" }}>まだ登録されていません</div>
            ) : stores.map((st, i) => (
              <div key={st} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${P.border}` }}>
                <span style={{ fontSize: 13 }}>🏪 {st}</span>
                <button style={s.btnDanger} onClick={() => {
                  if (confirm(`「${st}」を削除しますか？`)) saveStores(stores.filter((_, j) => j !== i));
                }}>削除</button>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: P.light, textAlign: "center" }}>登録した店舗はスタッフ管理の所属店舗プルダウンに反映されます</div>
        </div>
      )}
    </div>
  );
}
