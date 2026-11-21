"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ExternalLink, Globe2, RefreshCw, ShieldCheck, Clock3, Sparkles } from "lucide-react";

type Change = {
  id: string;
  changedAt?: string;
  createdAt?: string;
  summary?: string | null;
  diffJson?: {
    changedFields?: string[];
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
    aiMeaningful?: { description: string; before?: string; after?: string }[];
    stats?: { adds?: number; dels?: number };
  };
};

export default function MonitorDetail() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [changes, setChanges] = useState<Change[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState("");
  const [historyError, setHistoryError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/monitors/" + encodeURIComponent(params.id), { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || result.error || "Could not load this monitor.");
      setData(result.monitor || result.data || result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  const loadChanges = useCallback(async () => {
    setHistoryLoading(true);
    setHistoryError("");
    try {
      const response = await fetch("/api/monitors/" + encodeURIComponent(params.id) + "/changes", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || result.error || "Could not load change history.");
      setChanges(Array.isArray(result) ? result : result.changes || []);
    } catch (err) {
      setHistoryError(err instanceof Error ? err.message : "Could not load change history.");
    } finally {
      setHistoryLoading(false);
    }
  }, [params.id]);

  const refresh = () => { void load(); void loadChanges(); };
  useEffect(() => { if (params.id) { void load(); void loadChanges(); } }, [params.id, load, loadChanges]);

  const url = data?.url || data?.targetUrl || data?.websiteUrl;

  return <div className="page">
    <Link href="/watchlist" className="button button-secondary" style={{ marginBottom: 24 }}><ArrowLeft size={14}/> Back to watchlist</Link>
    <div className="page-heading">
      <div><div className="eyebrow">Monitor details</div><h1>Page overview.</h1><p className="lede">Inspect the page NoticeShift is watching and review recorded updates.</p></div>
      <button className="button button-secondary" onClick={refresh} disabled={loading || historyLoading}><RefreshCw size={13}/> Refresh</button>
    </div>
    {loading ? <div className="surface empty">Loading monitor details...</div> : error ? <div className="callout" role="alert">{error}</div> : <>
      <div className="surface">
        <div className="surface-head">
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}><div className="site-icon"><Globe2 size={18}/></div><div><h2 className="section-title" style={{ overflowWrap: "anywhere" }}>{url || "Monitored webpage"}</h2><p className="section-copy">Monitor ID · <span className="mono">{params.id}</span></p></div></div>
          <span className="status">{data?.isActive === false ? "PAUSED" : "WATCHING"}</span>
        </div>
        {url && <a href={url} target="_blank" rel="noreferrer" className="button button-secondary">Open original page <ExternalLink size={13}/></a>}
        <div className="grid stats-grid" style={{ marginBottom: 0 }}>
          <div className="stat-card"><div className="stat-label">Check interval</div><div className="stat-value">{data?.intervalMinutes || 15}<span style={{ fontSize: 12 }}> min</span></div></div>
          <div className="stat-card"><div className="stat-label">Last checked</div><div className="stat-value" style={{ fontSize: 17 }}>{data?.lastCheckedAt ? new Date(data.lastCheckedAt).toLocaleString() : "Pending"}</div></div>
          <div className="stat-card"><div className="stat-label">Next check</div><div className="stat-value" style={{ fontSize: 17 }}>{data?.nextRunAt ? new Date(data.nextRunAt).toLocaleString() : "Scheduled"}</div></div>
        </div>
      </div>
      <div className="surface" style={{ marginTop: 17 }}>
        <div className="surface-head"><div><h2 className="section-title">Change history</h2><p className="section-copy">Updates recorded by Anakin for this page.</p></div><ShieldCheck size={18} color="var(--green)"/></div>
        {historyLoading ? <div className="empty">Loading recorded changes...</div> : historyError ? <div className="callout" role="alert">{historyError}</div> : changes.length === 0 ? <div className="empty"><Clock3 size={25}/><div>No changes recorded yet.</div><div>The first check creates a baseline. Changes appear here after a later check finds something different.</div></div> : <div className="monitor-list">{changes.map(change => <article className="monitor-row" key={change.id}><div className="site-icon"><Sparkles size={16}/></div><div className="monitor-main"><div className="monitor-url">{change.summary || "The page content changed."}</div><div className="monitor-meta">{change.changedAt || change.createdAt ? new Date(change.changedAt || change.createdAt!).toLocaleString() : "Recently detected"}{change.diffJson?.changedFields?.length ? " · " + change.diffJson.changedFields.join(", ") : ""}</div>{change.diffJson?.aiMeaningful?.map((item, index) => <div className="monitor-meta" key={index}>{item.description}{item.before ? " · " + item.before : ""}{item.after ? " → " + item.after : ""}</div>)}</div><span className="status">CHANGE</span></article>)}</div>}
      </div>
    </>}
    <footer className="footer"><span>NoticeShift · Know what changed.</span><span>Monitoring by Anakin</span></footer>
  </div>;
}
