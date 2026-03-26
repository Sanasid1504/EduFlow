import { useState , useRef } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_JOBS = [
  { id: 1, title: "Senior Mathematics Teacher", institution: "Westfield Academy", location: "New York, NY", subject: "Mathematics", salary: "65000-85000", type: "Full-time", postedDate: "2026-02-13", description: "We are looking for an experienced mathematics teacher to lead our senior math program. The ideal candidate will have experience in AP Calculus and Statistics.", applicants: 12, status: "active" },
  { id: 2, title: "English Literature Instructor", institution: "Greendale High School", location: "Chicago, IL", subject: "English", salary: "50000-65000", type: "Full-time", postedDate: "2026-02-15", description: "Seeking a passionate English Literature instructor for grades 9-12.", applicants: 8, status: "active" },
  { id: 3, title: "Coding Teacher", institution: "TechEdu Mumbai", location: "Mumbai, Maharashtra", subject: "Programming", salary: "40000-60000", type: "Full-time", postedDate: "2026-02-13", description: "Looking for a coding teacher with experience in Python and Web Development.", applicants: 15, status: "active" },
  { id: 4, title: "Physics Teacher", institution: "St. Xavier's College", location: "Mumbai, Maharashtra", subject: "Physics", salary: "45000-65000", type: "Part-time", postedDate: "2026-02-20", description: "Part-time physics teacher for undergraduate students.", applicants: 5, status: "active" },
  { id: 5, title: "History & Civics Teacher", institution: "Delhi Public School", location: "New Delhi, India", subject: "History", salary: "35000-50000", type: "Full-time", postedDate: "2026-02-22", description: "Experienced History teacher for secondary section.", applicants: 7, status: "active" },
  { id: 6, title: "Art & Design Instructor", institution: "Creative Academy", location: "Bangalore, India", subject: "Arts", salary: "30000-45000", type: "Contract", postedDate: "2026-03-01", description: "Art instructor for digital and traditional media courses.", applicants: 3, status: "active" },
];

const MOCK_APPLICATIONS = [
  { id: 1, jobId: 1, teacherId: 1, userName: "Priya Sharma", appliedDate: "2026-03-10", status: "shortlisted", resumeUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
  { id: 2, jobId: 3, teacherId: 4, userName: "Vikram Singh", appliedDate: "2026-03-05", status: "applied", resumeUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
];
const MOCK_TEACHERS = [
  { id: 1, name: "Priya Sharma", subject: "Mathematics", location: "Mumbai", experience: 8, rating: 4.9, endorsements: 28, certifications: 12, tags: ["Algebra", "Calculus", "Statistics"], verified: true },
  { id: 2, name: "Rahul Mehta", subject: "Physics", location: "Delhi", experience: 5, rating: 4.7, endorsements: 15, certifications: 8, tags: ["Mechanics", "Optics", "Thermodynamics"], verified: true },
  { id: 3, name: "Anjali Desai", subject: "English", location: "Pune", experience: 10, rating: 4.8, endorsements: 32, certifications: 6, tags: ["Literature", "Grammar", "Creative Writing"], verified: false },
  { id: 4, name: "Vikram Singh", subject: "Computer Science", location: "Bangalore", experience: 3, rating: 4.6, endorsements: 10, certifications: 15, tags: ["Python", "Web Dev", "Data Science"], verified: true },
];

const MOCK_NOTIFICATIONS = [
  { id: 1, type: "shortlisted", message: "Your application for Senior Mathematics Teacher was shortlisted!", time: "2 hours ago", read: false },
  { id: 2, type: "new_job", message: "New job matching your profile: Physics Teacher at St. Xavier's", time: "1 day ago", read: false },
  { id: 3, type: "endorsement", message: "Rahul Mehta endorsed your Mathematics skills", time: "3 days ago", read: true },
];

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const Avatar = ({ name, size = "md" }) => {
  const s = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-lg" };
  return (
    <div className={`${s[size]} rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {name?.[0]?.toUpperCase() || "?"}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const cfg = {
    applied: "bg-sky-100 text-sky-700",
    shortlisted: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
    hired: "bg-violet-100 text-violet-700",
    active: "bg-emerald-100 text-emerald-700",
    closed: "bg-slate-100 text-slate-500",
  };
  const lbl = { applied: "📋 Applied", shortlisted: "⭐ Shortlisted", rejected: "✕ Rejected", hired: "🎉 Hired", active: "● Active", closed: "○ Closed" };
  return <span className={`${cfg[status] || "bg-slate-100 text-slate-500"} text-xs font-semibold px-3 py-1 rounded-full`}>{lbl[status] || status}</span>;
};

const Chip = ({ label, color = "blue" }) => {
  const c = { blue: "bg-blue-50 text-blue-700", purple: "bg-violet-50 text-violet-700", green: "bg-emerald-50 text-emerald-700", orange: "bg-orange-50 text-orange-700", rose: "bg-rose-50 text-rose-700" };
  return <span className={`${c[color] || c.blue} text-xs font-semibold px-2.5 py-1 rounded-full`}>{label}</span>;
};

const Btn = ({ children, variant = "primary", size = "md", onClick, disabled, className = "", icon }) => {
  const base = "inline-flex items-center gap-2 font-semibold rounded-xl transition-all duration-150 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  const s = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" };
  const v = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700",
    ghost: "hover:bg-blue-50 text-slate-600 hover:text-blue-600",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    success: "bg-emerald-500 hover:bg-emerald-600 text-white",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${s[size]} ${v[variant]} ${className}`}>
      {icon && <span>{icon}</span>}{children}
    </button>
  );
};

const Field = ({ label, placeholder, value, onChange, type = "text", icon, required }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}{required && <span className="text-red-400 ml-1">*</span>}</label>}
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{icon}</span>}
      <input type={type} placeholder={placeholder} value={value} onChange={onChange}
        className={`w-full ${icon ? "pl-9" : "pl-3"} pr-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400 transition-all`} />
    </div>
  </div>
);

const TArea = ({ label, placeholder, value, onChange, rows = 4 }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</label>}
    <textarea placeholder={placeholder} value={value} onChange={onChange} rows={rows}
      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400 resize-y leading-relaxed transition-all" />
  </div>
);

const Sel = ({ label, value, onChange, options }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</label>}
    <select value={value} onChange={onChange}
      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const Card = ({ children, className = "", onClick, hover }) => (
  <div onClick={onClick}
    className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${hover ? "hover:shadow-md hover:-translate-y-0.5 cursor-pointer" : ""} transition-all duration-200 ${className}`}>
    {children}
  </div>
);

const StatCard = ({ icon, label, value, sub, iconBg = "bg-blue-50 text-blue-600" }) => (
  <Card className="p-5">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
        <p className="text-3xl font-black text-slate-900">{value}</p>
        {sub && <p className="text-xs text-emerald-600 font-semibold mt-1">{sub}</p>}
      </div>
      <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center text-xl`}>{icon}</div>
    </div>
  </Card>
);

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const Sidebar = ({ user, activePage, setPage, onLogout, notifications }) => {
  const teacherNav = [
    { id: "dashboard", icon: "⊞", label: "Dashboard" },
    { id: "profile", icon: "👤", label: "My Profile" },
    { id: "jobs", icon: "💼", label: "Explore Jobs" },
    { id: "applications", icon: "📋", label: "My Applications" },
    { id: "portfolio", icon: "📁", label: "Portfolio" }
  ];
  const instituteNav = [
    { id: "dashboard", icon: "⊞", label: "Dashboard" },
    { id: "profile", icon: "🏫", label: "Institute Profile" },
    { id: "post-job", icon: "➕", label: "Post a Job" },
    { id: "manage-jobs", icon: "💼", label: "Manage Jobs" },
    { id: "applicants", icon: "👥", label: "Applicants" },
    { id: "teachers", icon: "🔍", label: "Find Teachers" }
  ];
  const nav = user?.role === "institute" ? instituteNav : teacherNav;
  const unread = notifications.filter(n => !n.read).length;

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-slate-100 flex flex-col fixed left-0 top-0 z-50">
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-lg">🎓</div>
          <span className="font-black text-lg text-slate-900 tracking-tight">EduFlow</span>
        </div>
      </div>
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <Avatar name={user?.name} size="md" />
          <div>
            <p className="font-bold text-sm text-slate-900 leading-tight">{user?.name}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-3">
        {nav.map(item => (
          <button key={item.id} onClick={() => setPage(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-sm font-medium transition-all relative
              ${activePage === item.id ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
            <span className="text-base">{item.icon}</span>
            {item.label}
            {item.id === "inbox" && unread > 0 && (
              <span className="absolute right-2.5 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">{unread}</span>
            )}
          </button>
        ))}
      </nav>
      <div className="px-3 py-3 border-t border-slate-100">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 transition-all">
          <span>🚪</span> Sign Out
        </button>
      </div>
    </aside>
  );
};

// ─── TOP BAR ──────────────────────────────────────────────────────────────────
const TopBar = ({ title, subtitle, user, notifications, onNotifClick }) => {
  const unread = notifications.filter(n => !n.read).length;
  return (
    <div className="flex justify-between items-center mb-7">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button onClick={onNotifClick} className="relative w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-lg transition-colors">
          🔔
          {unread > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />}
        </button>
        <Avatar name={user?.name} size="md" />
      </div>
    </div>
  );
};

// ─── NOTIFICATIONS PANEL ──────────────────────────────────────────────────────
const NotifPanel = ({ notifications, onClose, onMarkRead }) => (
  <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-[200] flex flex-col">
    <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
      <h3 className="font-black text-lg text-slate-900">Notifications</h3>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
    </div>
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {notifications.map(n => (
        <div key={n.id} onClick={() => onMarkRead(n.id)}
          className={`p-4 rounded-xl cursor-pointer transition-all border ${n.read ? "bg-white border-slate-100" : "bg-blue-50 border-blue-200"}`}>
          <p className="text-sm text-slate-800 mb-1">{n.message}</p>
          <p className="text-xs text-slate-400">{n.time}</p>
        </div>
      ))}
    </div>
    <div className="p-4 border-t border-slate-100">
      <Btn variant="ghost" size="sm" onClick={() => notifications.forEach(n => onMarkRead(n.id))}>Mark all as read</Btn>
    </div>
  </div>
);

// ─── TEACHER DASHBOARD ────────────────────────────────────────────────────────
const TeacherDashboard = ({ user, applications, jobs, setPage }) => {
  const profileFields = ["name", "tagline", "location", "bio", "subjects", "skills"];
  const filled = profileFields.filter(f => user?.profile?.[f]).length;
  const pct = Math.round((filled / profileFields.length) * 100);
  const sc = applications.reduce((a, c) => { a[c.status] = (a[c.status] || 0) + 1; return a; }, {});

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon="📋" label="Applications" value={applications.length} iconBg="bg-blue-50 text-blue-600" />
        <StatCard icon="⭐" label="Shortlisted" value={sc.shortlisted || 0} iconBg="bg-amber-50 text-amber-600" />
        <StatCard icon="✉️" label="Messages" value={0} sub="0 New" iconBg="bg-sky-50 text-sky-600" />
        <StatCard icon="👁" label="Profile Views" value={24} sub="+8 this week" iconBg="bg-emerald-50 text-emerald-600" />
      </div>

      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-blue-100 mb-1">Profile Completeness</p>
            <p className="text-4xl font-black text-white mb-3">{pct}%</p>
            <div className="w-48 h-2 bg-white/20 rounded-full">
              <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-100 mb-3">Complete your profile to get more visibility</p>
            <Btn variant="secondary" size="sm" onClick={() => setPage("profile")}>Update Profile →</Btn>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-slate-900">Recent Applications</h3>
            <Btn variant="ghost" size="sm" onClick={() => setPage("applications")}>View All →</Btn>
          </div>
          {applications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-3xl mb-2">📋</p>
              <p className="text-sm text-slate-500 mb-4">No applications yet</p>
              <Btn size="sm" onClick={() => setPage("jobs")}>Explore Jobs</Btn>
            </div>
          ) : applications.slice(0, 3).map(app => (
            <div key={app.id} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
              <div>
                <p className="font-semibold text-sm text-slate-900">{app.jobTitle}</p>
                <p className="text-xs text-slate-500">{app.institution}</p>
              </div>
              <StatusBadge status={app.status} />
            </div>
          ))}
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { icon: "👤", label: "My Profile", desc: "Edit your profile", page: "profile", bg: "bg-blue-50" },
              { icon: "💼", label: "Explore Jobs", desc: "Find opportunities", page: "jobs", bg: "bg-emerald-50" },
              { icon: "📁", label: "Portfolio", desc: "Manage documents", page: "portfolio", bg: "bg-violet-50" },
            ].map(({ icon, label, desc, page, bg }) => (
              <button key={page} onClick={() => setPage(page)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-blue-50 transition-colors text-left">
                <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center text-lg flex-shrink-0`}>{icon}</div>
                <div>
                  <p className="font-semibold text-sm text-slate-900">{label}</p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h3 className="font-bold text-slate-900">Recommended Jobs</h3>
            <p className="text-xs text-slate-500 mt-0.5">Matched based on your profile</p>
          </div>
          <Btn variant="ghost" size="sm" onClick={() => setPage("jobs")}>View All →</Btn>
        </div>
        {jobs.slice(0, 4).map(job => (
          <div key={job.id} className="flex justify-between items-center py-3.5 border-b border-slate-50 last:border-0">
            <div>
              <p className="font-semibold text-sm text-slate-900">{job.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">🏫 {job.institution} · 📍 {job.location} · 📅 {job.postedDate}</p>
            </div>
            <Btn variant="secondary" size="sm" onClick={() => setPage("jobs")}>View</Btn>
          </div>
        ))}
      </Card>
    </div>
  );
};

// ─── TEACHER PROFILE ──────────────────────────────────────────────────────────
const TeacherProfile = ({ user, onSave }) => {
  const [form, setForm] = useState({ name: user?.name || "", tagline: "", location: "", experience: 0, bio: "", subjects: [], skills: [], phone: "", linkedin: "" });
  const [ns, setNs] = useState(""); const [nk, setNk] = useState(""); const [saved, setSaved] = useState(false);
  const addTag = (f, v, s) => { if (v.trim() && !form[f].includes(v.trim())) { setForm(p => ({ ...p, [f]: [...p[f], v.trim()] })); s(""); } };
  const rmTag = (f, t) => setForm(p => ({ ...p, [f]: p[f].filter(x => x !== t) }));
  const pct = [form.name, form.tagline, form.location, form.bio, form.subjects.length > 0, form.skills.length > 0].filter(Boolean).length;

  return (
    <div className="max-w-7xl space-y-5">
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 p-7 flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-black text-white flex-shrink-0">{form.name?.[0] || "?"}</div>
        <div className="flex-1">
          <p className="text-xl font-black text-white">{form.name || "Your Name"}</p>
          <p className="text-sm text-blue-100 mt-1">{form.tagline || "Your professional tagline"}</p>
          <div className="flex items-center gap-2 mt-2"><span className="text-yellow-300">⭐</span><span className="text-white text-xs">0 rating</span></div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-blue-100 mb-2">Profile {Math.round(pct / 6 * 100)}% complete</p>
          <div className="w-28 h-1.5 bg-white/20 rounded-full"><div className="h-full bg-white rounded-full" style={{ width: `${pct / 6 * 100}%` }} /></div>
        </div>
      </div>

      <Card className="p-6">
        <h3 className="font-bold text-slate-900 mb-5">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Field label="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your full name" required />
          <Field label="Tagline" value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} placeholder="e.g. Passionate Math Teacher" />
          <Field label="Location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="City, State" icon="📍" />
          <Field label="Experience (years)" type="number" value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} />
          <Field label="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" icon="📞" />
          <Field label="LinkedIn" value={form.linkedin} onChange={e => setForm(f => ({ ...f, linkedin: e.target.value }))} placeholder="linkedin.com/in/..." icon="🔗" />
        </div>
        <TArea label="Bio" value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Tell institutions about yourself..." rows={4} />
      </Card>

      <Card className="p-6">
        <h3 className="font-bold text-slate-900 mb-5">Subjects & Skills</h3>
        {[["subjects", ns, setNs, "bg-blue-50 text-blue-700", "Subjects", "e.g. Mathematics"],
          ["skills", nk, setNk, "bg-violet-50 text-violet-700", "Skills", "e.g. Classroom Management"]].map(([field, val, setter, cls, lbl, ph]) => (
          <div key={field} className="mb-5 last:mb-0">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">{lbl}</label>
            <div className="flex gap-2 mb-3">
              <input value={val} onChange={e => setter(e.target.value)} onKeyDown={e => e.key === "Enter" && addTag(field, val, setter)}
                placeholder={ph} className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <Btn size="sm" onClick={() => addTag(field, val, setter)}>+ Add</Btn>
            </div>
            <div className="flex flex-wrap gap-2">
              {form[field].map(s => (
                <span key={s} className={`${cls} text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5`}>
                  {s}<button onClick={() => rmTag(field, s)} className="opacity-50 hover:opacity-100 leading-none">✕</button>
                </span>
              ))}
            </div>
          </div>
        ))}
      </Card>

      <div className="flex gap-3">
        <Btn size="lg" onClick={() => { onSave(form); setSaved(true); setTimeout(() => setSaved(false), 2000); }}>{saved ? "✓ Saved!" : "Save Profile"}</Btn>
        <Btn variant="secondary" size="lg">Preview Profile</Btn>
      </div>
    </div>
  );
};

// ─── EXPLORE JOBS ─────────────────────────────────────────────────────────────
const ExploreJobs = ({ jobs, applications, onApply, user }) => {
  const [search, setSearch] = useState("");
  const [loc, setLoc] = useState("");
  const [sub, setSub] = useState("");
  const [type, setType] = useState("");
  const [sel, setSel] = useState(null);
  const [msg, setMsg] = useState("");
  
  // States for the application flow
  const [isApplying, setIsApplying] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  const appliedIds = new Set(applications.map(a => a.jobId));

  const filtered = jobs.filter(j =>
    (!search || [j.title, j.institution, j.subject].some(s => s.toLowerCase().includes(search.toLowerCase())))
    && (!loc || j.location.toLowerCase().includes(loc.toLowerCase()))
    && (!sub || j.subject.toLowerCase().includes(sub.toLowerCase()))
    && (!type || j.type === type)
  );

  // Find the apply function inside ExploreJobs
const apply = (job) => {
  if (appliedIds.has(job.id)) return;

  // Get the file from the input ref
  const uploadedFile = fileInputRef.current?.files[0];
  
  // Create a temporary local URL so the browser can view the file
  const fileUrl = uploadedFile ? URL.createObjectURL(uploadedFile) : "#";

  // Pass the real fileUrl to the onApply prop
  onApply(job, fileUrl); 

  setMsg(`Applied to ${job.title}!`);
  setTimeout(() => setMsg(""), 3000);
  setSel(null);
  setIsApplying(false);
  setFileName("");
};

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 p-5 flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-xl flex-shrink-0">✨</div>
        <div>
          <p className="font-bold text-white">AI Job Recommendations</p>
          <p className="text-sm text-blue-100">Jobs matched based on your profile, skills, and preferences</p>
        </div>
      </div>

      {msg && <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-emerald-700 font-semibold text-sm">✓ {msg}</div>}

      <Card className="p-5">
        <div className="grid grid-cols-5 gap-3">
          <div className="col-span-2"><Field placeholder="Search jobs or institutions..." value={search} onChange={e => setSearch(e.target.value)} icon="🔍" /></div>
          <Field placeholder="Location" value={loc} onChange={e => setLoc(e.target.value)} icon="📍" />
          <Field placeholder="Subject" value={sub} onChange={e => setSub(e.target.value)} />
          <Sel value={type} onChange={e => setType(e.target.value)} options={[{ value: "", label: "All Types" }, { value: "Full-time", label: "Full-time" }, { value: "Part-time", label: "Part-time" }, { value: "Contract", label: "Contract" }]} />
        </div>
      </Card>

      <p className="text-xs text-slate-500 font-medium">{filtered.length} jobs found</p>

      <div className="space-y-3">
        {filtered.map(job => {
          const applied = appliedIds.has(job.id);
          return (
            <Card key={job.id} className="p-5" hover>
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="font-bold text-slate-900">{job.title}</h3>
                    <Chip label={job.type} color={job.type === "Full-time" ? "blue" : "orange"} />
                    {applied && <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">✓ Applied</span>}
                  </div>
                  <div className="flex gap-4 mb-2 flex-wrap text-sm text-slate-500">
                    <span>🏫 {job.institution}</span><span>📍 {job.location}</span>
                    <Chip label={job.subject} color="purple" />
                    <span className="font-semibold text-emerald-600">$ {job.salary}</span>
                    <span>👥 {job.applicants} applicants</span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">{job.description.slice(0, 120)}...</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Btn variant="outline" size="sm" onClick={() => { setSel(job); setIsApplying(false); }}>Details</Btn>
                  <Btn size="sm" disabled={applied} onClick={() => { setSel(job); setIsApplying(true); }}>{applied ? "Applied" : "Apply"}</Btn>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {sel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[300] p-4">
          <div className="bg-white rounded-2xl p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-black text-slate-900 pr-4">{isApplying ? `Apply: ${sel.title}` : sel.title}</h2>
              <button onClick={() => { setSel(null); setIsApplying(false); setFileName(""); }} className="text-slate-400 hover:text-slate-600 text-xl flex-shrink-0">✕</button>
            </div>

            {isApplying ? (
              <div className="space-y-5">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Applicant Information</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[11px] text-slate-500">Full Name</p>
                      <p className="text-xs font-semibold text-slate-900 leading-tight">{user?.name || "User"}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500">Email Address</p>
                      <p className="text-xs font-semibold text-slate-900 leading-tight">{user?.email || "Email"}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[11px] text-slate-500">Institution</p>
                      <p className="text-xs font-semibold text-slate-900 leading-tight">{sel.institution}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-slate-700 uppercase">Resume Attachment</p>
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                  <div 
                    onClick={() => fileInputRef.current.click()}
                    className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-white hover:border-blue-400 transition-all cursor-pointer group"
                  >
                    {fileName ? (
                      <div className="text-center">
                        <span className="text-xl mb-1 block">✅</span>
                        <p className="text-xs font-bold text-emerald-600 truncate max-w-[200px]">{fileName}</p>
                        <p className="text-[10px] text-slate-400 mt-1">Click to change file</p>
                      </div>
                    ) : (
                      <>
                        <span className="text-xl mb-1 group-hover:scale-110 transition-transform">📄</span>
                        <p className="text-xs font-bold text-slate-600">Click to upload resume</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">PDF or DOCX (Max 5MB)</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Btn size="lg" className="flex-1" onClick={() => apply(sel)}>Submit Application →</Btn>
                  <Btn variant="secondary" size="lg" onClick={() => setIsApplying(false)}>Back</Btn>
                </div>
              </div>
            ) : (
              <>
                <div className="flex gap-2 mb-5 flex-wrap"><Chip label={sel.subject} color="blue" /><Chip label={sel.type} color="orange" /></div>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[["🏫 Institution", sel.institution], ["📍 Location", sel.location], ["💰 Salary", `$${sel.salary}`], ["👥 Applicants", sel.applicants]].map(([k, v]) => (
                    <div key={k} className="bg-slate-50 rounded-xl p-3"><p className="text-xs text-slate-500">{k}</p><p className="font-semibold text-sm text-slate-900 mt-0.5">{v}</p></div>
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">{sel.description}</p>
                <div className="flex gap-3">
                  <Btn size="lg" className="flex-1" onClick={() => setIsApplying(true)} disabled={appliedIds.has(sel.id)}>{appliedIds.has(sel.id) ? "✓ Already Applied" : "Apply Now →"}</Btn>
                  <Btn variant="secondary" size="lg" onClick={() => setSel(null)}>Close</Btn>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── MY APPLICATIONS ──────────────────────────────────────────────────────────
const MyApplications = ({ applications }) => {
  const [filter, setFilter] = useState("all");
  // NEW: State to track which job details to show in the modal
  const [selectedJob, setSelectedJob] = useState(null);

  const filtered = filter === "all" ? applications : applications.filter(a => a.status === filter);

  return (
    <div className="space-y-5">
      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {["all", "applied", "shortlisted", "hired", "rejected"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-all ${filter === s ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-semibold text-slate-900 mb-1">No applications found</p>
          <p className="text-sm text-slate-500">Adjust your filter or explore new jobs</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(app => (
            <Card key={app.id} className="p-5" hover>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{app.jobTitle}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">🏫 {app.institution} · 📍 {app.location}</p>
                  <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">Applied on {app.appliedDate}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-3">
                  <StatusBadge status={app.status} />
                  {/* FIXED: Added onClick to set the selected job */}
                  <button 
                    onClick={() => setSelectedJob(app)}
                    className="text-blue-600 text-sm font-bold hover:underline"
                  >
                    View Job Details →
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* --- JOB DETAILS MODAL --- */}
      {selectedJob && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto relative p-0 shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-900">{selectedJob.jobTitle}</h2>
                <p className="text-slate-500 font-medium">{selectedJob.institution}</p>
              </div>
              <button 
                onClick={() => setSelectedJob(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-xs text-slate-400 font-bold uppercase">Location</p>
                  <p className="text-slate-900 font-semibold">{selectedJob.location}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-xs text-slate-400 font-bold uppercase">Application Status</p>
                  <div className="mt-1"><StatusBadge status={selectedJob.status} /></div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Job Description</h4>
                <p className="text-slate-600 leading-relaxed">
                  This role at {selectedJob.institution} involves lead teaching responsibilities, curriculum development, and student mentorship. (Full job details would be fetched based on JobID: {selectedJob.jobId}).
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="flex-1 py-3 bg-slate-100 text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-all"
                >
                  Close
                </button>
                <button 
                  className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                >
                  Contact Institution
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
// ─── PORTFOLIO ────────────────────────────────────────────────────────────────
const Portfolio = () => {
  const [docs, setDocs] = useState([]);
  const [showUp, setShowUp] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [nd, setNd] = useState({ title: "", type: "Other" });
  
  // NEW: State for the File Previewer
  const [viewingDoc, setViewingDoc] = useState(null);

  const icons = { Certificate: "🏆", "Lesson Plan": "📖", Achievement: "✅", Other: "📁" };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (!nd.title) setNd((prev) => ({ ...prev, title: file.name }));
    }
  };

  const upload = () => {
    if (!selectedFile) return;
    setUploading(true);
    
    setTimeout(() => {
      const newDoc = {
        id: Date.now(),
        title: nd.title || selectedFile.name,
        type: nd.type,
        date: new Date().toLocaleDateString(),
        size: (selectedFile.size / 1024 / 1024).toFixed(1) + " MB",
        // Generate a temporary URL so the browser can actually "View" the file
        url: URL.createObjectURL(selectedFile),
        fileType: selectedFile.type
      };

      setDocs((prev) => [newDoc, ...prev]);
      setNd({ title: "", type: "Other" });
      setSelectedFile(null);
      setUploading(false);
      setShowUp(false);
    }, 1200);
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Document Library</h2>
          <p className="text-slate-500 font-medium">Click "View" to open any document.</p>
        </div>
        <Btn icon="➕" onClick={() => setShowUp(true)}>Upload New</Btn>
      </div>

      {/* Grid */}
      {docs.length === 0 ? (
        <div className="text-center py-24 border-4 border-dashed border-slate-100 rounded-[40px]">
          <p className="text-6xl mb-4 opacity-30">📁</p>
          <p className="text-xl font-bold text-slate-400">Your library is empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {docs.map((doc) => (
            <Card key={doc.id} className="p-6 flex flex-col justify-between" hover>
              <div>
                <span className="text-4xl block mb-4">{icons[doc.type] || "📁"}</span>
                <h3 className="font-bold text-slate-900 leading-tight truncate" title={doc.title}>
                  {doc.title}
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-1">{doc.date} · {doc.size}</p>
              </div>
              <div className="flex gap-2 mt-6">
                {/* FIXED: Clicking this now opens the previewer */}
                <Btn 
                  variant="secondary" 
                  size="sm" 
                  className="flex-1" 
                  onClick={() => setViewingDoc(doc)}
                >
                  View
                </Btn>
                <button 
                  onClick={() => setDocs(docs.filter(d => d.id !== doc.id))}
                  className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                >
                  🗑
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* --- UPLOAD MODAL --- */}
      {showUp && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[500] p-6">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900">Upload File</h3>
              <button onClick={() => setShowUp(false)} className="text-slate-400 text-2xl hover:text-slate-600">✕</button>
            </div>
            <div className="space-y-6">
              <label htmlFor="portfolio-upload" className="block">
                <div className={`group border-4 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all
                  ${selectedFile ? "border-green-500 bg-green-50" : "border-slate-100 bg-slate-50 hover:border-blue-500 hover:bg-white"}`}>
                  <input id="portfolio-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.png,.jpeg" />
                  {selectedFile ? (
                    <div><p className="text-4xl mb-2">✅</p><p className="font-bold text-green-700 truncate max-w-[200px] mx-auto">{selectedFile.name}</p></div>
                  ) : (
                    <div><p className="text-3xl mb-2">📤</p><p className="font-bold text-slate-700">Browse Folders</p></div>
                  )}
                </div>
              </label>
              <input 
                className="w-full bg-slate-50 border-none p-4 rounded-xl font-medium outline-none"
                value={nd.title}
                placeholder="Enter file name..."
                onChange={(e) => setNd({...nd, title: e.target.value})}
              />
              <button 
                onClick={upload}
                disabled={!selectedFile || uploading}
                className={`w-full py-4 rounded-2xl font-black text-white ${!selectedFile || uploading ? "bg-slate-200" : "bg-blue-600 shadow-xl shadow-blue-200"}`}
              >
                {uploading ? "Saving..." : "Save Document"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- FILE VIEWING MODAL (PREVIEWER) --- */}
      {viewingDoc && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-lg flex flex-col z-[1000] animate-in fade-in duration-300">
          {/* Previewer Header */}
          <div className="flex justify-between items-center p-6 text-white bg-black/20">
            <div>
              <h3 className="text-xl font-black">{viewingDoc.title}</h3>
              <p className="text-sm opacity-60">{viewingDoc.type} • {viewingDoc.size}</p>
            </div>
            <div className="flex gap-4">
              <a href={viewingDoc.url} download={viewingDoc.title} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl font-bold transition-all">
                Download ↓
              </a>
              <button onClick={() => setViewingDoc(null)} className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-xl font-bold transition-all">
                Close
              </button>
            </div>
          </div>

          {/* Previewer Content */}
          <div className="flex-1 flex items-center justify-center p-10 overflow-hidden">
            {viewingDoc.fileType.includes("image") ? (
              <img 
                src={viewingDoc.url} 
                alt={viewingDoc.title} 
                className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
              />
            ) : viewingDoc.fileType.includes("pdf") ? (
              <iframe 
                src={viewingDoc.url} 
                className="w-full h-full max-w-5xl bg-white rounded-xl shadow-2xl"
                title="PDF Preview"
              />
            ) : (
              <div className="text-center text-white">
                <p className="text-6xl mb-4">📄</p>
                <p className="text-2xl font-bold">Preview not available for this file type.</p>
                <a href={viewingDoc.url} download className="text-blue-400 underline mt-2 block">Download to view</a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
// ─── INBOX ────────────────────────────────────────────────────────────────────
const Inbox = () => {
  const [convos] = useState([
    { id: 1, name: "Westfield Academy", lastMsg: "We'd like to schedule an interview...", time: "2h ago", unread: 2 },
    { id: 2, name: "Greendale High School", lastMsg: "Thank you for applying.", time: "1d ago", unread: 0 },
  ]);
  const [sel, setSel] = useState(null);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, from: "other", text: "Hello! We reviewed your application and are impressed.", time: "10:30 AM" },
    { id: 2, from: "other", text: "We'd like to schedule an interview. Are you available this Friday at 3 PM?", time: "10:31 AM" },
  ]);
  const send = () => {
    if (!msg.trim()) return;
    setMessages(m => [...m, { id: Date.now(), from: "me", text: msg, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setMsg("");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex" style={{ height: "70vh" }}>
      <div className="w-72 border-r border-slate-100 flex flex-col flex-shrink-0">
        <div className="px-4 py-4 border-b border-slate-100 font-bold text-slate-900">Messages</div>
        <div className="flex-1 overflow-y-auto">
          {convos.map(c => (
            <button key={c.id} onClick={() => setSel(c)}
              className={`w-full flex gap-3 items-center px-4 py-4 border-b border-slate-50 text-left transition-colors ${sel?.id === c.id ? "bg-blue-50" : "hover:bg-slate-50"}`}>
              <Avatar name={c.name} size="md" />
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between"><span className="font-bold text-sm truncate">{c.name}</span><span className="text-xs text-slate-400 ml-2 flex-shrink-0">{c.time}</span></div>
                <p className="text-xs text-slate-500 truncate mt-0.5">{c.lastMsg}</p>
              </div>
              {c.unread > 0 && <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{c.unread}</span>}
            </button>
          ))}
        </div>
      </div>
      {sel ? (
        <div className="flex-1 flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
            <Avatar name={sel.name} size="md" />
            <div><p className="font-bold text-sm">{sel.name}</p><p className="text-xs text-emerald-500">● Online</p></div>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.from === "me" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-800"}`}>
                  {m.text}<p className="text-xs opacity-60 mt-1 text-right">{m.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-slate-100 flex gap-3">
            <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Type a message..." className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <Btn onClick={send}>Send →</Btn>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-400">
          <div className="text-center"><p className="text-4xl mb-3">💬</p><p className="text-sm">Select a conversation</p></div>
        </div>
      )}
    </div>
  );
};

// ─── INSTITUTE DASHBOARD ──────────────────────────────────────────────────────
const InstituteDashboard = ({ jobs, setPage }) => {
  const total = jobs.reduce((s, j) => s + j.applicants, 0);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon="💼" label="Total Jobs" value={jobs.length} iconBg="bg-blue-50 text-blue-600" />
        <StatCard icon="👥" label="Total Applicants" value={total} sub="+5 this week" iconBg="bg-sky-50 text-sky-600" />
        <StatCard icon="✅" label="Hired" value={2} iconBg="bg-emerald-50 text-emerald-600" />
        <StatCard icon="📊" label="Active Jobs" value={jobs.filter(j => j.status === "active").length} iconBg="bg-amber-50 text-amber-600" />
      </div>
      <div className="grid grid-cols-2 gap-5">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-slate-900">Your Job Postings</h3>
            <Btn size="sm" onClick={() => setPage("post-job")}>+ Post Job</Btn>
          </div>
          {jobs.slice(0, 4).map(job => (
            <div key={job.id} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
              <div><p className="font-semibold text-sm text-slate-900">{job.title}</p><p className="text-xs text-slate-500">👥 {job.applicants} applicants</p></div>
              <StatusBadge status={job.status} />
            </div>
          ))}
          <Btn variant="ghost" size="sm" className="mt-3" onClick={() => setPage("manage-jobs")}>View All →</Btn>
        </Card>
        <Card className="p-6">
          <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[{ icon: "➕", label: "Post New Job", desc: "Create a job listing", page: "post-job", bg: "bg-blue-50" }, { icon: "👥", label: "View Applicants", desc: "Review candidates", page: "applicants", bg: "bg-sky-50" }, { icon: "🔍", label: "Find Teachers", desc: "Browse teacher profiles", page: "teachers", bg: "bg-emerald-50" }].map(({ icon, label, desc, page, bg }) => (
              <button key={page} onClick={() => setPage(page)} className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-blue-50 transition-colors text-left">
                <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center text-lg flex-shrink-0`}>{icon}</div>
                <div><p className="font-semibold text-sm text-slate-900">{label}</p><p className="text-xs text-slate-500">{desc}</p></div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// ─── POST JOB ─────────────────────────────────────────────────────────────────
const PostJob = ({ onPost, user }) => {
  const [form, setForm] = useState({ 
    title: "", 
    subject: "", 
    location: "", 
    salary: "", 
    type: "Full-time", 
    description: "", 
    requirements: "", 
    deadline: "" 
  });
  
  const [posted, setPosted] = useState(false);
  const [alertMsg, setAlertMsg] = useState(""); // State for the side alert

  const post = () => { 
    if (!form.title || !form.location) return; 

    const newJob = {
      ...form,
      id: Date.now(),
      postedBy: user?.id,
      institution: user?.name || "Your Institute",
      postedDate: new Date().toLocaleDateString(),
      status: "active",
      applicants: 0 
    };

    // Trigger the parent update
    onPost(newJob); 

    // 1. Show the specific UI alert
    setAlertMsg(`Job posted for ${form.title}`);

    // 2. Delay the success screen so user sees the alert
    setTimeout(() => {
      setPosted(true);
      setAlertMsg("");
    }, 1500);

    // 3. Reset everything
    setTimeout(() => { 
      setPosted(false); 
      setForm({ title: "", subject: "", location: "", salary: "", type: "Full-time", description: "", requirements: "", deadline: "" }); 
    }, 4000); 
  };

  if (posted) return (
    <div className="text-center py-20 animate-in zoom-in duration-500">
      <p className="text-6xl mb-5">🎉</p>
      <h2 className="text-2xl font-black text-slate-900 mb-2 leading-tight">Job Posted Successfully!</h2>
      <p className="text-slate-500 font-bold text-sm">Your listing is now live and visible to teachers.</p>
    </div>
  );

  return (
    <div className="max-w-7xl space-y-5 mx-auto relative">
      <Card className="p-8 border-none shadow-sm bg-white relative overflow-hidden">
        <h3 className="text-xl font-black text-slate-900 mb-6 tracking-tight">Post a New Opportunity</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Field label="Job Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Senior Math Teacher" required />
          <Field label="Subject" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="e.g. Mathematics" />
          <Field label="Location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="City, State" icon="📍" required />
          <Field label="Salary Range" value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} placeholder="50k - 80k" icon="💰" />
          <Sel label="Job Type" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} options={[{ value: "Full-time", label: "Full-time" }, { value: "Part-time", label: "Part-time" }, { value: "Contract", label: "Contract" }]} />
          <Field label="Application Deadline" type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
        </div>

        <div className="space-y-6">
          <TArea label="Job Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the role and school culture..." rows={4} />
          <TArea label="Requirements" value={form.requirements} onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))} placeholder="Certifications, years of experience..." rows={3} />
        </div>

        <div className="mt-8 pt-6 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* THE SIDE ALERT (UI ONLY) */}
          <div className={`transition-all duration-500 ${alertMsg ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}>
            {alertMsg && (
              <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl flex items-center gap-2">
                <span className="text-emerald-500 text-xs">✓</span>
                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">{alertMsg}</p>
              </div>
            )}
          </div>

          <Btn 
            size="lg" 
            onClick={post} 
            disabled={!form.title || !form.location} 
            className="w-full md:w-auto px-12 py-4 shadow-xl shadow-blue-100"
          >
            Publish Job Listing →
          </Btn>
        </div>
      </Card>
    </div>
  );
};
// ─── MANAGE JOBS ──────────────────────────────────────────────────────────────
const ManageJobs = ({ jobs, user, onDelete, onToggle }) => {
  // Filter: Only show jobs where the ID of the person who posted it matches the current user
  const myJobs = jobs.filter(job => job.postedBy === user?.id);

  return (
    <div className="space-y-3">
      {myJobs.length === 0 ? (
        <Card className="p-16 text-center border-2 border-dashed border-slate-100">
          <p className="text-4xl mb-3 opacity-30">💼</p>
          <p className="font-bold text-slate-900">No jobs posted yet</p>
          <p className="text-sm text-slate-500 mt-1">When you post a job, it will appear here for management.</p>
        </Card>
      ) : (
        myJobs.map(job => (
          <Card key={job.id} className="p-5" hover>
            <div className="flex justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-slate-900 text-lg">{job.title}</h3>
                  <StatusBadge status={job.status} />
                </div>
                <p className="text-sm text-slate-500 font-medium">
                  📍 {job.location} · 💰 {job.salary} · 📅 Posted on {job.postedDate}
                </p>
                <div className="flex items-center gap-2 mt-3 text-sky-600 bg-sky-50 px-3 py-1 rounded-lg w-fit">
                  <span className="text-xs font-black uppercase tracking-wider">👥 {job.applicants} Applicants</span>
                </div>
              </div>
              
              <div className="flex gap-2 flex-shrink-0">
                <Btn variant="secondary" size="sm">Edit</Btn>
                <Btn 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onToggle(job.id)}
                >
                  {job.status === "active" ? "Close Job" : "Reopen"}
                </Btn>
                <button 
                  onClick={() => onDelete(job.id)}
                  className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                >
                  🗑
                </button>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

// ─── APPLICANTS ───────────────────────────────────────────────────────────────
const Applicants = ({ jobs = [], applications = [], teachers = [], user = {}, onUpdateStatus }) => {
  // 1. Get ONLY the jobs that belong to the logged-in institute
  const myJobs = (jobs || []).filter(j => String(j?.postedBy) === String(user?.id));
  
  // 2. INITIALIZE STATE CORRECTLY: Set the first job as default immediately
  // This avoids the "set-state-in-effect" error
  const [selJobId, setSelJobId] = useState(myJobs[0]?.id || null);

  // 3. Filter applications for the selected job
  const jobApps = (applications || []).filter(app => String(app?.jobId) === String(selJobId));

  return (
    <div className="flex gap-6 max-w-[1400px] mx-auto text-left animate-in fade-in duration-500">
      {/* Sidebar: Job Listings */}
      <Card className="w-72 p-5 border-none shadow-sm flex-shrink-0 bg-white sticky top-5 h-fit">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Job Listings</p>
        <div className="space-y-1">
          {myJobs.length === 0 ? (
            <p className="text-xs font-bold text-slate-300 p-4">No jobs posted yet.</p>
          ) : (
            myJobs.map(job => {
              const count = applications.filter(a => String(a.jobId) === String(job.id)).length;
              return (
                <button key={job.id} onClick={() => setSelJobId(job.id)}
                  className={`w-full p-4 rounded-2xl text-left transition-all ${selJobId === job.id ? "bg-blue-600 text-white shadow-xl scale-[1.02]" : "hover:bg-slate-50 text-slate-600"}`}>
                  <p className="font-black text-sm leading-tight truncate">{job.title}</p>
                  <p className={`text-[10px] mt-1 font-bold ${selJobId === job.id ? "text-blue-200" : "text-slate-400"}`}>
                     👥 {count} Candidates
                  </p>
                </button>
              );
            })
          )}
        </div>
      </Card>

      {/* Main Content: Applicants Grid */}
      <div className="flex-1 space-y-4">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
            {myJobs.find(j => j.id === selJobId)?.title || "Select a Job"}
          </h2>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Candidate Applications</p>
        </div>

        {jobApps.length === 0 ? (
          <div className="py-24 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-100">
            <p className="text-4xl mb-3 opacity-20">👤</p>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No candidates found for this role</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {jobApps.map(app => {
              const teacher = teachers.find(t => String(t.id) === String(app.teacherId));
              return (
                <Card key={app.id} className="p-5 border-slate-50" hover>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-5">
                      <Avatar name={app.userName || teacher?.name || "U"} size="lg" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-black text-slate-900 text-base leading-none">
                            {app.userName || teacher?.name || "Anonymous Applicant"}
                          </p>
                          <StatusBadge status={app.status} />
                        </div>
                        <p className="text-[11px] text-slate-500 font-bold">
                          {app.subject || teacher?.subject} · {teacher?.experience || 0} yrs exp.
                        </p>
                        <div className="mt-3 flex items-center gap-3">
                           {/* View Resume Button */}
                         {/* View Resume Button */}
<button 
  className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 font-black uppercase px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
  onClick={() => {
    // This opens the URL in a new browser tab
    const resumeUrl = app.resumeUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'; 
    window.open(resumeUrl, '_blank', 'noopener,noreferrer');
  }}
>
  📄 View Resume
</button>
                           <span className="text-[9px] text-slate-400 font-black uppercase">Applied: {app.appliedDate || 'Today'}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Decision Actions */}
                    <div className="flex items-center gap-2">
                      <div className="flex bg-slate-50 p-1 rounded-xl gap-1 border border-slate-100">
                        <Btn size="sm" variant={app.status === 'shortlisted' ? 'primary' : 'ghost'} 
                          className="text-[10px] h-8 px-3" 
                          onClick={() => onUpdateStatus(app.id, "shortlisted")}>Shortlist</Btn>
                        
                        <Btn size="sm" variant={app.status === 'accepted' ? 'success' : 'ghost'} 
                          className="text-[10px] h-8 px-3" 
                          onClick={() => onUpdateStatus(app.id, "accepted")}>Accept</Btn>
                        
                        <Btn size="sm" variant={app.status === 'hired' ? 'success' : 'ghost'} 
                          className="text-[10px] h-8 px-3" 
                          onClick={() => onUpdateStatus(app.id, "hired")}>Hire</Btn>
                      </div>

                      <button 
                        onClick={() => onUpdateStatus(app.id, "rejected")} 
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs"
                        title="Reject"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
// ─── FIND TEACHERS ────────────────────────────────────────────────────────────
const FindTeachers = ({ teachers = [], applications = [], jobs = [], user = {} }) => {
  const [search, setSearch] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  // 1. Get IDs of jobs posted by THIS institute (Safety: using .filter and .map)
  const myJobIds = (jobs || [])
    .filter(j => j?.postedBy === user?.id)
    .map(j => j?.id);

  // 2. Get IDs of teachers who applied to those specific jobs
  const applicantIds = (applications || [])
    .filter(app => myJobIds.includes(app?.jobId))
    .map(app => app?.teacherId);

  // 3. Filter teachers: Must be an applicant AND match the search
  const filtered = (teachers || []).filter(t => 
    applicantIds.includes(t?.id) && 
    (!search || t?.name?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto animate-in fade-in duration-500">
      {/* Search Header */}
      <Card className="p-4 border-none shadow-sm bg-white">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input 
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm"
            placeholder="Search through your applicants..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
      </Card>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
            <p className="text-4xl mb-3 opacity-20">👥</p>
            <p className="text-slate-400 font-bold">No applicants have applied to your jobs yet.</p>
          </div>
        ) : (
          filtered.map(t => {
            // Find the specific application to show which job they applied for
            const appDetails = applications.find(a => a?.teacherId === t?.id && myJobIds.includes(a?.jobId));
            
            return (
              <Card key={t.id} className="p-5 flex flex-col justify-between" hover>
                <div className="flex gap-4 items-start text-left">
                  <Avatar name={t.name} size="lg" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-black text-slate-900 truncate">{t.name}</p>
                      <span className="bg-blue-50 text-blue-600 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Applicant</span>
                    </div>
                    <p className="text-xs text-slate-500 font-bold mb-3">{t.subject} Specialist</p>
                    
                    {/* The Job Link */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <p className="text-[9px] text-slate-400 font-black uppercase mb-0.5">Applied For</p>
                      <p className="text-xs font-black text-slate-700 truncate">{appDetails?.jobTitle || "Job Listing"}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-50 flex gap-2">
                  <button 
                    onClick={() => setSelectedTeacher(t)}
                    className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl font-bold text-xs hover:bg-blue-600 transition-all"
                  >
                    View Profile
                  </button>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* MINI PROFILE MODAL */}
      {selectedTeacher && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <Card className="w-full max-w-sm p-8 bg-white rounded-[2.5rem] shadow-2xl relative text-left">
            <button onClick={() => setSelectedTeacher(null)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-900">✕</button>
            
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <Avatar name={selectedTeacher.name} size={80} />
              </div>
              <p className="font-black text-slate-900 text-xl leading-tight">{selectedTeacher.name}</p>
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-1">{selectedTeacher.subject}</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-2xl text-center">
                  <p className="text-[9px] text-slate-400 font-black uppercase">Experience</p>
                  <p className="text-sm font-black text-slate-900">{selectedTeacher.experience}y</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl text-center">
                  <p className="text-[9px] text-slate-400 font-black uppercase">Rating</p>
                  <p className="text-sm font-black text-slate-900">⭐ {selectedTeacher.rating}</p>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => setSelectedTeacher(null)} 
                  className="w-full bg-blue-600 text-white py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-blue-100"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// ─── INSTITUTE PROFILE ────────────────────────────────────────────────────────
const InstituteProfile = ({ user, onSave }) => {
  const [form, setForm] = useState({ instituteName: user?.name || "", type: "School", location: "", website: "", phone: "", about: "", established: "" });
  const [saved, setSaved] = useState(false);

  return (
    <div className="max-w-7xl space-y-5">
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 p-7 flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-4xl flex-shrink-0">🏫</div>
        <div><p className="text-xl font-black text-white">{form.instituteName || "Your Institution"}</p><p className="text-sm text-blue-100 mt-1">{form.type} · {form.location || "Location"}</p></div>
      </div>
      <Card className="p-6">
        <h3 className="font-bold text-slate-900 mb-5">Institution Details</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Field label="Institution Name" value={form.instituteName} onChange={e => setForm(f => ({ ...f, instituteName: e.target.value }))} required />
          <Sel label="Type" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} options={["School", "College", "University", "Coaching Institute", "Online Platform"].map(v => ({ value: v, label: v }))} />
          <Field label="Location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} icon="📍" />
          <Field label="Website" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} icon="🌐" />
          <Field label="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} icon="📞" />
          <Field label="Established Year" value={form.established} onChange={e => setForm(f => ({ ...f, established: e.target.value }))} placeholder="e.g. 1995" />
        </div>
        <TArea label="About Institution" value={form.about} onChange={e => setForm(f => ({ ...f, about: e.target.value }))} placeholder="Tell teachers about your institution..." rows={4} />
      </Card>
      <Btn size="lg" onClick={() => { onSave(form); setSaved(true); setTimeout(() => setSaved(false), 2000); }}>{saved ? "✓ Saved!" : "Save Profile"}</Btn>
    </div>
  );
};

// ─── LANDING ──────────────────────────────────────────────────────────────────
const Landing = ({ onLogin, onRegister }) => {
  const features = [
    { icon: "💼", title: "Smart Job Matching", desc: "AI-powered recommendations connect the right teachers with the right institutions.", bg: "bg-blue-50" },
    { icon: "🛡", title: "Verified Profiles", desc: "Credibility badges and verification ensure trust and transparency.", bg: "bg-emerald-50" },
    { icon: "📖", title: "Portfolio Builder", desc: "Showcase your teaching expertise with a beautiful digital portfolio.", bg: "bg-violet-50" },
    { icon: "👥", title: "Faculty Showcase", desc: "Institutions can highlight their team quality and attract top talent.", bg: "bg-amber-50" },
    { icon: "🌐", title: "Network & Grow", desc: "Connect with peers, get endorsements, and build your professional reputation.", bg: "bg-rose-50" },
    { icon: "⭐", title: "Ratings & Reviews", desc: "Transparent rating system helps both teachers and institutions make informed decisions.", bg: "bg-cyan-50" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-100 px-10 h-16 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-lg">🎓</div>
          <span className="font-black text-xl text-slate-900 tracking-tight">EduFlow</span>
        </div>
        <div className="flex gap-6 text-sm font-medium text-slate-600">
          {["Features", "For Teachers", "For Institutions"].map(l => <span key={l} className="hover:text-slate-900 cursor-pointer">{l}</span>)}
        </div>
        <div className="flex gap-2">
          <Btn variant="ghost" onClick={onLogin}>Log In</Btn>
          <Btn onClick={onRegister}>Get Started →</Btn>
        </div>
      </nav>

      <section className="text-center px-10 pt-20 pb-16 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 text-sm font-semibold text-slate-600 mb-8">
          ✨ The #1 Platform for Educators
        </div>
        <h1 className="text-6xl font-black text-slate-900 leading-tight tracking-tight mb-5">
          Connecting Educators,<br /><span className="text-blue-600">Empowering Institutions</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed">
          Build your professional teaching profile, discover opportunities, and connect with top institutions — all in one elegant platform.
        </p>
        <div className="flex gap-3 justify-center">
          <Btn size="lg" onClick={onRegister}>Start for Free →</Btn>
          <Btn variant="ghost" size="lg">Explore Features ›</Btn>
        </div>
        <div className="grid grid-cols-4 gap-8 max-w-2xl mx-auto mt-16">
          {[["10K+", "Educators"], ["500+", "Institutions"], ["2K+", "Jobs Posted"], ["95%", "Success Rate"]].map(([v, l]) => (
            <div key={l}><p className="text-3xl font-black text-slate-900">{v}</p><p className="text-sm text-slate-500 mt-0.5">{l}</p></div>
          ))}
        </div>
      </section>

      <section className="px-10 py-16 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Why EduFlow</p>
          <h2 className="text-4xl font-black text-slate-900 mb-3">Everything You Need</h2>
          <p className="text-slate-500">A complete ecosystem designed exclusively for the education sector</p>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {features.map(f => (
            <div key={f.title} className="bg-white rounded-2xl p-7 border border-slate-100">
              <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center text-2xl mb-4`}>{f.icon}</div>
              <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-10 mb-16 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 p-14 text-center">
        <h2 className="text-3xl font-black text-white mb-3">Ready to Transform Your Teaching Career?</h2>
        <p className="text-blue-100 mb-8">Join 10,000+ educators who've found their dream positions through EduFlow.</p>
        <Btn variant="secondary" size="lg" onClick={onRegister}>Get Started for Free →</Btn>
      </section>
    </div>
  );
};

// ─── AUTH ─────────────────────────────────────────────────────────────────────
const AuthPage = ({ mode, onAuth, onSwitch }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "teacher" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = () => {
    if (!form.email || !form.password) { setError("Please fill all fields"); return; }
    if (mode === "register" && !form.name) { setError("Name is required"); return; }
    setLoading(true); setError("");
    setTimeout(() => { setLoading(false); onAuth({ name: form.name || form.email.split("@")[0], email: form.email, role: form.role, profile: {} }); }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-[420px] bg-white rounded-2xl p-10 shadow-xl shadow-slate-200/80">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-2xl mx-auto mb-4">🎓</div>
          <h2 className="text-2xl font-black text-slate-900">{mode === "login" ? "Welcome Back" : "Create Account"}</h2>
          <p className="text-sm text-slate-500 mt-1">{mode === "login" ? "Sign in to your account" : "Join the EduFlow community"}</p>
        </div>

        {mode === "register" && (
          <div className="mb-5 space-y-4">
            <Field label="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your full name" required />
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {["teacher", "institute"].map(r => (
                  <button key={r} onClick={() => setForm(f => ({ ...f, role: r }))}
                    className={`py-3 rounded-xl border-2 text-sm font-semibold transition-all ${form.role === r ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:border-blue-200"}`}>
                    {r === "teacher" ? "👨‍🏫 Teacher" : "🏫 Institution"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4 mb-4">
          <Field label="Email Address" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" icon="✉️" />
          <Field label="Password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" icon="🔒" />
        </div>

        {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 mb-4">{error}</div>}

        <Btn onClick={handle} disabled={loading} size="lg" className="w-full justify-center">
          {loading ? "Please wait..." : mode === "login" ? "Sign In →" : "Create Account →"}
        </Btn>

        <p className="text-center text-sm text-slate-500 mt-5">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button onClick={onSwitch} className="text-blue-600 font-semibold hover:underline">{mode === "login" ? "Sign Up" : "Sign In"}</button>
        </p>
      </div>
    </div>
  );
};

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("landing");
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [applications, setApplications] = useState(MOCK_APPLICATIONS);
  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [showNotifs, setShowNotifs] = useState(false);

  // --- AUTH LOGIC ---
  const handleAuth = (u) => { 
    const authenticatedUser = { ...u, id: u.id || 101 }; 
    setUser(authenticatedUser); 
    setScreen("app"); 
    setPage("dashboard"); 
  };

  const handleLogout = () => { setUser(null); setScreen("landing"); };

  // --- APPLICATION STATUS LOGIC ---
  const handleUpdateStatus = (appId, newStatus) => {
    setApplications(prev => prev.map(app => 
      app.id === appId ? { ...app, status: newStatus } : app
    ));
    
    setNotifications(n => [{ 
      id: Date.now(), 
      type: newStatus, 
      message: `Application status updated to ${newStatus}`, 
      time: "Just now", 
      read: false 
    }, ...n]);
  };

  const handleApply = (job) => {
  const newApp = { 
    id: Date.now(), 
    jobId: job.id, 
    teacherId: user?.id || 1, 
    userName: user?.name,
    jobTitle: job.title, 
    institution: job.institution, 
    location: job.location, 
    appliedDate: new Date().toISOString().split("T")[0], 
    status: "applied",
    // FIXED: Using a real sample PDF URL instead of "#"
    resumeUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" 
  };
  setApplications(a => [newApp, ...a]);
  // ... rest of the notification logic
};

  const handlePostJob = (data) => {
    const newJob = { 
      ...data,
      id: Date.now(), 
      postedBy: user?.id, 
      applicants: 0, 
      postedDate: new Date().toISOString().split("T")[0], 
      status: "active" 
    };
    setJobs(j => [newJob, ...j]);
  };

  const markRead = (id) => setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x));

  // --- PAGE METADATA (FIXES THE pageTitle ERROR) ---
  const META = {
    dashboard: ["Dashboard", user?.role === "institute" ? "Manage your institution" : `Welcome back, ${user?.name} 👋`],
    profile: user?.role === "institute" ? ["Institute Profile", "Manage your institution's profile"] : ["Teacher Profile", "Build your professional teaching profile"],
    jobs: ["Explore Jobs", "Find the perfect teaching opportunity"],
    applications: ["My Applications", "Track your job applications"],
    portfolio: ["My Portfolio", "Showcase your teaching documents and achievements"],
    inbox: ["Inbox", "Messages"],
    "post-job": ["Post a Job", "Create a new job listing"],
    "manage-jobs": ["Manage Jobs", "View and manage your job postings"],
    applicants: ["Applicants", "Review candidates for your positions"],
    teachers: ["Find Teachers", "Browse verified teacher profiles"],
  };

  const [pageTitle, pageSub] = META[page] || ["Dashboard", ""];

  // --- ROUTING LOGIC ---
  const renderPage = () => {
    if (user?.role === "institute") {
      const pages = {
        dashboard: <InstituteDashboard jobs={jobs} setPage={setPage} />,
        profile: <InstituteProfile user={user} onSave={(d) => setUser(u => ({ ...u, ...d }))} />,
        "post-job": <PostJob onPost={handlePostJob} user={user} />,
        "manage-jobs": <ManageJobs jobs={jobs} user={user} onDelete={(id) => setJobs(j => j.filter(x => x.id !== id))} onToggle={(id) => setJobs(j => j.map(x => x.id === id ? { ...x, status: x.status === "active" ? "closed" : "active" } : x))} />,
        applicants: <Applicants jobs={jobs} applications={applications} teachers={MOCK_TEACHERS} user={user} onUpdateStatus={handleUpdateStatus} />,
        teachers: <FindTeachers teachers={MOCK_TEACHERS} applications={applications} jobs={jobs} user={user} />,
        inbox: <Inbox />,
      };
      return pages[page] || pages.dashboard;
    }

    const pages = {
      dashboard: <TeacherDashboard user={user} applications={applications} jobs={jobs} setPage={setPage} />,
      profile: <TeacherProfile user={user} onSave={(d) => setUser(u => ({ ...u, profile: d }))} />,
      jobs: <ExploreJobs jobs={jobs} applications={applications} onApply={handleApply} user={user} />,
      applications: <MyApplications applications={applications} />,
      portfolio: <Portfolio />,
      inbox: <Inbox />,
    };
    return pages[page] || pages.dashboard;
  };

  // --- SCREEN CONTROLS ---
  if (screen === "landing") return <Landing onLogin={() => setScreen("login")} onRegister={() => setScreen("register")} />;
  if (screen === "login") return <AuthPage mode="login" onAuth={handleAuth} onSwitch={() => setScreen("register")} />;
  if (screen === "register") return <AuthPage mode="register" onAuth={handleAuth} onSwitch={() => setScreen("login")} />;

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar user={user} activePage={page} setPage={setPage} onLogout={handleLogout} notifications={notifications} />
      <main className="ml-60 px-8 py-7 min-h-screen">
        <TopBar title={pageTitle} subtitle={pageSub} user={user} notifications={notifications} onNotifClick={() => setShowNotifs(s => !s)} />
        {renderPage()}
      </main>
      {showNotifs && <NotifPanel notifications={notifications} onClose={() => setShowNotifs(false)} onMarkRead={markRead} />}
    </div>
  );
}