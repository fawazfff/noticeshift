"use client";

import { useEffect, useState } from "react";
import { Activity, ArrowUpRight, Bell, Globe2, LoaderCircle, Plus, RefreshCw, ScanEye, ShieldCheck } from "lucide-react";

type Monitor = { id: string; url: string; isActive?: boolean; intervalMinutes?: number; lastCheckedAt?: string; nextRunAt?: string; aiMode?: boolean; createdAt?: string };
const categories = [
  { id: "prices", title: "Prices & products", desc: "Prices, discounts and availability" },
  { id: "opportunities", title: "Opportunities", desc: "Scholarships, grants and deadlines" },
  { id: "announcements", title: "Announcements", desc: "Notices, policies and requirements" },
  { id: "business", title: "Business information", desc: "Suppliers, catalogues and competitors" },
];

export default function Home() {
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("prices");
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadMonitors() {
    setRefreshing(true);
    try {
      const res = await fetch("/api/monitors", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load monitors.");
      setMonitors(data.monitors || []);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally { setRefreshing(false); }
  }

  useEffect(() => { loadMonitors(); }, []);

  async function addMonitor(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(""); setMessage("");
    try {
      const res = await fetch("/api/monitors", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, category }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Could not create monitor.");
      setMessage("Monitor created. Anakin will run its first check on the next scheduler tick.");
      setUrl("");
      await loadMonitors();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally { setLoading(false); }
  }

  const active = monitors.filter(m => m.isActive).length;
  return <>
    <header className="topbar"><div className="shell nav">
      <a className="brand" href="#"><span className="mark"><Activity size={19}/></span>notice<span style={{color:"#176b50",marginLeft:-10}}>shift</span></a>
      <div className="navright"><span><i className="live"/>Anakin monitoring connected</span><span style={{borderLeft:"1px solid #e8ede9",height:20,margin:"0 5px"}}/><span>Free workspace</span></div>
    </div></header>
    <main className="shell">
      <section className="hero"><div><div className="eyebrow">The web keeps changing</div><h1>Know what changed.<br/><span style={{color:"#176b50"}}>Know what matters.</span></h1><p className="sub">Keep an eye on the prices, opportunities and updates that affect your next move. NoticeShift watches the pages. You focus on what comes next.</p></div><div className="hero-note"><ShieldCheck size={15} style={{verticalAlign:"middle",marginRight:6,color:"#176b50"}}/>Powered by Anakin website monitoring</div></section>
      <section className="stats">
        <div className="stat"><div className="stat-label">Your monitors</div><div className="stat-value">{monitors.length}</div></div>
        <div className="stat"><div className="stat-label">Active monitors</div><div className="stat-value">{active}<span style={{fontSize:13,color:"#75817c",fontWeight:500}}> / 5</span></div></div>
        <div className="stat"><div className="stat-label">Check frequency</div><div className="stat-value">15<span style={{fontSize:13,color:"#75817c",fontWeight:500}}> min</span></div></div>
      </section>
      <section className="content">
        <div className="panel">
          <div className="panel-head"><div><h2 className="panel-title">Start tracking a page</h2><p className="panel-desc">Add a public webpage you want to keep an eye on.</p></div><span style={{color:"#176b50"}}><Plus size={20}/></span></div>
          <form onSubmit={addMonitor}>
            <label className="field-label" htmlFor="url">Website URL</label>
            <input id="url" className="input" type="url" required placeholder="https://example.com/product" value={url} onChange={e=>setUrl(e.target.value)}/>
            <label className="field-label">What are you watching?</label>
            <div className="categories">{categories.map(c=><button type="button" key={c.id} className={`category ${category===c.id?"active":""}`} onClick={()=>setCategory(c.id)}><div className="cat-title">{c.title}</div><div className="cat-desc">{c.desc}</div></button>)}</div>
            <button className="primary full" type="submit" disabled={loading}>{loading?<><LoaderCircle size={16} className="spin"/> Creating monitor...</>:<><ScanEye size={16}/> Start monitoring <ArrowUpRight size={15}/></>}</button>
          </form>
          {error&&<div className="notice error">{error}</div>}
          {message&&<div className="notice info">{message}</div>}
        </div>
        <div className="panel">
          <div className="panel-head"><div><h2 className="panel-title">Your watchlist</h2><p className="panel-desc">Pages Anakin is monitoring for you.</p></div><button className="secondary" onClick={loadMonitors} disabled={refreshing} aria-label="Refresh"><RefreshCw size={14} className={refreshing?"spin":""}/></button></div>
          {monitors.length===0?<div className="empty"><Globe2 size={27} style={{margin:"0 auto 12px",opacity:.45}}/><div>No pages yet.</div><div>Add a URL to start watching for meaningful changes.</div></div>:<div className="monitor-list">{monitors.map(m=><div className="monitor" key={m.id}><div className="favicon"><Globe2 size={17}/></div><div className="monitor-main"><div className="monitor-url" title={m.url}>{m.url.replace(/^https?:\/\//,"")}</div><div className="monitor-meta">{m.intervalMinutes||15} min checks · {m.lastCheckedAt?"Last checked "+new Date(m.lastCheckedAt).toLocaleString():"Waiting for first check"}</div></div><span className="status">{m.isActive?"ACTIVE":"PAUSED"}</span></div>)}</div>}
          <div className="notice info" style={{marginTop:20}}><Bell size={14} style={{verticalAlign:"middle",marginRight:6}}/>Your monitors check automatically. Meaningful changes are summarized by Anakin AI.</div>
        </div>
      </section>
      <footer className="footer"><span>NoticeShift · Stay ahead of the changes.</span><span>Monitoring by Anakin</span></footer>
    </main>
    <style jsx global>{`.spin{animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </>;
}