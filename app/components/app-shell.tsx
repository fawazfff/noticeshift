"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Activity,ChartNoAxesCombined,LayoutDashboard,ListChecks,Settings2} from "lucide-react";
const links=[{href:"/",label:"Overview",icon:LayoutDashboard},{href:"/watchlist",label:"My watchlist",icon:ListChecks},{href:"/insights",label:"Change insights",icon:ChartNoAxesCombined},{href:"/settings",label:"Settings",icon:Settings2}];
export function AppShell({children}:{children:React.ReactNode}) {
 const path=usePathname();
 const title=links.find(x=>x.href===path)?.label||(path.startsWith("/monitor/")?"Monitor details":"NoticeShift");
 return <div className="app-frame"><aside className="sidebar"><Link href="/" className="brand"><span className="brand-mark"><Activity size={18}/></span><span>notice<span>shift</span></span></Link><div className="workspace-label">Workspace</div><nav className="nav-links">{links.map(x=>{const I=x.icon;const active=x.href==="/" ? path==="/" : path===x.href||path.startsWith(x.href+"/");return <Link key={x.href} href={x.href} className={"nav-link"+(active?" active":"")}><I/><span>{x.label}</span></Link>})}</nav><div className="sidebar-bottom"><div className="plan-label">YOUR WORKSPACE</div><div className="plan-title">Free plan · 5 monitors</div><div className="sidebar-note">Keep an eye on the changes that could affect your next move.</div></div></aside><div className="main-area"><header className="topbar"><div className="breadcrumb">NoticeShift / <strong>{title}</strong></div><div className="topbar-right"><span><i className="live-dot"/>Monitoring workspace</span><span className="workspace-text">FREE</span><div className="avatar">N</div></div></header>{children}</div></div>;
}