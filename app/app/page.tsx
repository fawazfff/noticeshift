"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, ArrowRight, ArrowUpRight, Bell, BriefcaseBusiness, CalendarClock, Globe2, LoaderCircle, Plus, RefreshCw, ScanEye, ShoppingBag, Sparkles } from "lucide-react";

type Monitor = { id: string; url: string; isActive?: boolean; intervalMinutes?: number; lastCheckedAt?: string; nextRunAt?: string; createdAt?: string };
const categories = [
  { id: "prices", title: "Prices & products", desc: "Price changes, discounts and stock", icon: ShoppingBag },
  { id: "opportunities", title: "Opportunities", desc: "Scholarships, grants and deadlines", icon: BriefcaseBusiness },
  { id: "announcements", title: "Announcements", desc: "School notices and policy updates", icon: Bell },
  { id: "business", title: "Business information", desc: "Suppliers, catalogues and competitors", icon: Activity },
];

export default function Dashboard() {
  const [url,setUrl]=useState(""); const [category,setCategory]=useState("prices"); const [intervalMinutes,setIntervalMinutes]=useState("15");
  const [monitors,setMonitors]=useState<Monitor[]>([]); const [loading,setLoading]=useState(false);
  const [refreshing,setRefreshing]=useState(false); const [error,setError]=useState(""); const [message,setMessage]=useState("");
  async function load(){setRefreshing(true);try{const r=await fetch("/api/monitors",{cache:"no-store"});const d=await r.json();if(!r.ok)throw new Error(d.error||"Could not load your watchlist.");setMonitors(Array.isArray(d)?d:(d.monitors||d.data?.monitors||[]));setError("");}catch(e){setError(e instanceof Error?e.message:"Something went wrong.");}finally{setRefreshing(false);}}
  useEffect(()=>{load();},[]);
  async function add(e:React.FormEvent){e.preventDefault();setLoading(true);setError("");setMessage("");try{const r=await fetch("/api/monitors",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url,category,intervalMinutes:Number(intervalMinutes)})});const d=await r.json();if(!r.ok)throw new Error(d.message||d.error||"Could not create this monitor.");setMessage("Your page has been added. Its first check will run on Anakin's schedule.");setUrl("");await load();}catch(e){setError(e instanceof Error?e.message:"Something went wrong.");}finally{setLoading(false);}}
  const active=monitors.filter(m=>m.isActive!==false).length;
  return <div className="page">
    <div className="page-heading"><div><div className="eyebrow">Your signal desk</div><h1>Stay ahead of the change.</h1><p className="lede">The pages you care about keep moving. NoticeShift keeps watch, so you don't have to keep checking.</p></div><Link href="/watchlist" className="button button-secondary">Open watchlist <ArrowUpRight size={14}/></Link></div>
    <div className="grid stats-grid">
      <div className="stat-card"><div className="stat-label">Pages you follow</div><div className="stat-value">{monitors.length.toString().padStart(2,"0")}</div><div className="stat-foot">Across your categories</div></div>
      <div className="stat-card"><div className="stat-label">Currently active</div><div className="stat-value">{active}<span style={{fontSize:13,color:"var(--muted)",fontWeight:500}}> / 5</span></div><div className="stat-foot">Free plan monitor limit</div></div>
      <div className="stat-card"><div className="stat-label">Check interval</div><div className="stat-value">15<span style={{fontSize:13,color:"var(--muted)",fontWeight:500}}> min</span></div><div className="stat-foot">Minimum interval on Anakin</div></div>
    </div>
    <div className="grid dashboard-grid">
      <section className="surface">
        <div className="surface-head"><div><h2 className="section-title">Add a page to watch</h2><p className="section-copy">Start with any public webpage. Choose what you want NoticeShift to pay attention to.</p></div><span style={{color:"var(--accent)"}}><Plus size={19}/></span></div>
        <form onSubmit={add}>
          <label className="field-label" htmlFor="url">Public webpage URL</label>
          <input id="url" className="input" type="url" required placeholder="https://store.com/product" value={url} onChange={e=>setUrl(e.target.value)}/>
          <label className="field-label">What matters on this page?</label>
          <div className="categories">{categories.map(c=>{const Icon=c.icon;return <button type="button" key={c.id} className={"category "+(category===c.id?"active":"")} onClick={()=>setCategory(c.id)}><div style={{display:"flex",alignItems:"center",gap:7,marginBottom:5,color:category===c.id?"var(--accent-dark)":"var(--muted)"}}><Icon size={14}/><span className="cat-title">{c.title}</span></div><div className="cat-desc">{c.desc}</div></button>})}</div>
          <label className="field-label" htmlFor="interval">How often should we check?</label>\n          <select id="interval" className="input" value={intervalMinutes} onChange={e=>setIntervalMinutes(e.target.value)}>\n            <option value="15">Every 15 minutes · Fastest</option>\n            <option value="30">Every 30 minutes</option>\n            <option value="60">Every hour</option>\n            <option value="180">Every 3 hours</option>\n            <option value="360">Every 6 hours</option>\n            <option value="720">Every 12 hours</option>\n            <option value="1440">Every 24 hours</option>\n            <option value="10080">Every 7 days</option>\n          </select>\n          <p className="section-copy" style={{marginTop:7}}>The provider requires at least 15 minutes between checks. Faster checks use credits more quickly.</p>\n          <button className="button button-primary full" type="submit" disabled={loading}>{loading?<><LoaderCircle size={15} className="spin"/> Adding your page...</>:<><ScanEye size={15}/> Start watching <ArrowRight size={14}/></>}</button>
        </form>
        {error&&<div className="callout" role="alert">{error}</div>}{message&&<div className="callout">{message}</div>}
      </section>
      <section className="surface">
        <div className="surface-head"><div><h2 className="section-title">Your watchlist</h2><p className="section-copy">The latest pages connected to your workspace.</p></div><button className="button button-secondary" onClick={load} disabled={refreshing} aria-label="Refresh watchlist"><RefreshCw size={13} className={refreshing?"spin":""}/></button></div>
        {monitors.length===0?<div className="empty"><Globe2 size={26}/><div>No pages on your list yet.</div><div>Add your first URL and NoticeShift will start tracking it.</div></div>:<div className="monitor-list">{monitors.slice(0,5).map(m=><Link href={"/monitor/"+encodeURIComponent(m.id)} className="monitor-row" key={m.id}><div className="site-icon"><Globe2 size={16}/></div><div className="monitor-main"><div className="monitor-url">{m.url?.replace(/^https?:\/\//,"")||"Tracked webpage"}</div><div className="monitor-meta">{m.lastCheckedAt?"Checked "+new Date(m.lastCheckedAt).toLocaleDateString():"Waiting for first check"}</div></div><span className="status">{m.isActive===false?"PAUSED":"WATCHING"}</span></Link>)}</div>}
        <div style={{marginTop:17}}><Link href="/watchlist" className="button button-secondary" style={{width:"100%"}}>View all pages <ArrowRight size={13}/></Link></div>
      </section>
    </div>
    <div className="grid info-grid" style={{marginTop:17}}>
      <div className="surface info-card"><div className="info-icon"><Sparkles size={17}/></div><h3>Changes, in plain language</h3><p>NoticeShift uses Anakin to monitor public pages and help explain what has changed in the information you follow.</p></div>
      <div className="surface info-card"><div className="info-icon"><CalendarClock size={17}/></div><h3>One place to keep watch</h3><p>Prices, student opportunities, school announcements and supplier updates all belong in the same workspace.</p></div>
    </div>
    <footer className="footer"><span>NoticeShift · Know what changed. Know what matters.</span><span>Monitoring infrastructure by Anakin</span></footer>
  </div>;
}
