import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const nav=[
{to:'dashboard',icon:'🏠',label:'Dashboard'},
{to:'profile',icon:'🏡',label:'Employer Profile'},
{to:'create-job',icon:'📢',label:'Post a Job'},
{to:'jobs',icon:'📋',label:'My Job Posts',badge:'2'},
{to:'applicants',icon:'👥',label:'Review Applicants',badge:'7'},
{to:'workers',icon:'🔍',label:'Browse Workers'},
{to:'messages',icon:'💬',label:'Messages',badge:'4'},
{to:'notifications',icon:'🔔',label:'Notifications',badge:'2'},
{to:'reviews',icon:'⭐',label:'Rate Workers'},
{to:'report',icon:'🚨',label:'Report User'},
{to:'security',icon:'🔒',label:'Security & Privacy'},
]

const c={
primary:'#d97706',
primary2:'#f59e0b',
pale:'rgba(217,119,6,0.1)',
bg:'#fffdf5',
surface:'#f5efe2',              // darker warm sidebar
border:'#e2d8c4',
text:'#111827',
muted:'#6b7280',
activeText:'#b45309',
activeBg:'linear-gradient(90deg,#fef3c7,#fde68a)',
headerGrad:'linear-gradient(135deg,#d97706,#b45309)',
topbarBg:'rgba(255,253,245,.9)',
}

export default function EmployerLayout(){
const{user,logout}=useAuth()
const navigate=useNavigate()
const[open,setOpen]=useState(false)
const handleLogout=async()=>{await logout();navigate('/login')}
const initials=user?.name?.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()||'EM'

return(
<div style={{display:'flex',minHeight:'100vh',background:c.bg,color:c.text,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
{open&&<div onClick={()=>setOpen(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.4)',zIndex:190}}/>}

<nav style={{position:'fixed',top:0,left:0,bottom:0,width:'260px',background:c.surface,borderRight:`1px solid ${c.border}`,display:'flex',flexDirection:'column',zIndex:200,boxShadow:'2px 0 12px rgba(0,0,0,.03)'}}>

<div style={{background:c.headerGrad,padding:'20px 18px 18px',position:'relative',overflow:'hidden'}}>
<div style={{position:'absolute',right:'-20px',top:'-20px',width:'100px',height:'100px',borderRadius:'50%',background:'rgba(255,255,255,.1)'}}/>
<div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'14px',position:'relative',zIndex:1}}>
<div style={{width:'36px',height:'36px',background:'rgba(255,255,255,.2)',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:'16px',color:'#fff',border:'1.5px solid rgba(255,255,255,.3)'}}>L</div>
<div>
<div style={{fontFamily:'Syne,sans-serif',fontSize:'16px',fontWeight:800,color:'#fff'}}>Local Job Finder</div>
<div style={{fontSize:'9px',fontWeight:700,background:'rgba(255,255,255,.2)',border:'1px solid rgba(255,255,255,.3)',borderRadius:'20px',padding:'2px 8px',color:'#fff',letterSpacing:'.5px',textTransform:'uppercase',display:'inline-block'}}>🏠 Employer</div>
</div>
</div>

<div style={{background:'rgba(255,255,255,.15)',border:'1px solid rgba(255,255,255,.25)',borderRadius:'12px',padding:'10px 12px',display:'flex',alignItems:'center',gap:'10px',position:'relative',zIndex:1}}>
<div style={{width:'32px',height:'32px',borderRadius:'50%',background:'rgba(255,255,255,.25)',border:'2px solid rgba(255,255,255,.4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:700,color:'#fff'}}>{initials}</div>
<div style={{flex:1,minWidth:0}}>
<div style={{fontSize:'12px',fontWeight:700,color:'#fff',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{user?.name}</div>
<div style={{fontSize:'10px',color:'rgba(255,255,255,.8)'}}>Employer Account</div>
</div>
<div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#fef08a'}}/>
</div>
</div>

<div style={{flex:1,overflowY:'auto',padding:'10px'}}>
{nav.map(item=>(
<NavLink key={item.to} to={item.to} style={({isActive})=>({display:'flex',alignItems:'center',gap:'10px',padding:'8px 12px',borderRadius:'10px',fontSize:'13px',fontWeight:isActive?600:500,textDecoration:'none',margin:'1px 0',color:isActive?c.activeText:c.muted,background:isActive?c.activeBg:'transparent',borderRight:isActive?`3px solid ${c.primary}`:'3px solid transparent'})}>
<span style={{fontSize:'15px',width:'20px',textAlign:'center'}}>{item.icon}</span>
<span style={{flex:1}}>{item.label}</span>
{item.badge&&<span style={{background:c.primary,color:'#fff',fontSize:'9px',fontWeight:700,borderRadius:'20px',padding:'2px 7px'}}>{item.badge}</span>}
</NavLink>
))}
</div>

<div style={{padding:'12px',borderTop:`1px solid ${c.border}`}}>
<div style={{background:'#fde68a',borderRadius:'12px',padding:'10px 12px',display:'flex',alignItems:'center',gap:'10px'}}>
<div style={{width:'32px',height:'32px',borderRadius:'50%',background:c.headerGrad,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:700,color:'#fff'}}>{initials}</div>
<div style={{flex:1,minWidth:0}}>
<div style={{fontSize:'12px',fontWeight:600,color:c.text,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{user?.name}</div>
<div style={{fontSize:'10px',color:c.muted}}>Employer</div>
</div>
<button onClick={handleLogout} style={{background:'none',border:'none',fontSize:'11px',fontWeight:700,color:'#ef4444',cursor:'pointer'}}>Sign out</button>
</div>
</div>

</nav>

<div style={{marginLeft:'260px',flex:1,display:'flex',flexDirection:'column'}}>
<div style={{position:'sticky',top:0,zIndex:100,height:'64px',background:c.topbarBg,backdropFilter:'blur(12px)',borderBottom:`1px solid ${c.border}`,display:'flex',alignItems:'center',padding:'0 28px',gap:'12px'}}>
<span style={{fontFamily:'Syne,sans-serif',fontSize:'18px',fontWeight:800,color:c.text,flex:1}}>Employer Portal</span>
<div style={{display:'flex',alignItems:'center',gap:'8px'}}>
<div style={{width:'32px',height:'32px',borderRadius:'50%',background:c.headerGrad,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:700,color:'#fff'}}>{initials}</div>
<span style={{fontSize:'13px',fontWeight:600,color:c.text}}>{user?.name}</span>
</div>
</div>
<div style={{flex:1}}><Outlet/></div>
</div>

</div>
)}