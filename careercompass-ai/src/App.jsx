
import { useState } from 'react'
import {
  LayoutDashboard, Compass, Target, Map, Bot, FolderKanban,ClipboardList,
  Bell, Search, ArrowUpRight, Code2, Brain, BarChart3,FileSearch,
  ShieldCheck, ChevronRight, Sparkles, Clock, CheckCircle2,
  Send, Menu, X, BriefcaseBusiness, GraduationCap, Zap
} from 'lucide-react'
import './App.css'
import * as pdfjsLib from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

const initialCareers = [
  { title: 'AI / ML Engineer', category: 'Artificial Intelligence', match: 94, icon: Brain, color: '#a78bfa', skills: ['Python', 'Machine Learning', 'Statistics', 'SQL'] },
  { title: 'Software Developer', category: 'Software Engineering', match: 89, icon: Code2, color: '#67e8f9', skills: ['C++', 'DSA', 'JavaScript', 'Git'] },
  { title: 'Data Analyst', category: 'Data & Analytics', match: 86, icon: BarChart3, color: '#6ee7b7', skills: ['SQL', 'Python', 'Excel', 'Data Visualization'] },
  { title: 'Cybersecurity Analyst', category: 'Cybersecurity', match: 78, icon: ShieldCheck, color: '#fbbf24', skills: ['Networking', 'Linux', 'Security Basics', 'Python'] },
  { title: 'Data Scientist', category: 'Data & Analytics', match: 85, icon: BarChart3, color: '#6ee7b7', skills: ['Python', 'Statistics', 'Machine Learning', 'SQL'] },
  { title: 'Frontend Developer', category: 'Web Development', match: 87, icon: Code2, color: '#67e8f9', skills: ['HTML', 'CSS', 'JavaScript', 'React'] },
  { title: 'Backend Developer', category: 'Software Engineering', match: 84, icon: Code2, color: '#67e8f9', skills: ['Java', 'APIs', 'Databases', 'Git'] },
  { title: 'Full Stack Developer', category: 'Web Development', match: 83, icon: Code2, color: '#67e8f9', skills: ['HTML', 'CSS', 'React', 'Node.js'] },
  { title: 'Cloud Engineer', category: 'Cloud & Infrastructure', match: 80, icon: Zap, color: '#fbbf24', skills: ['Linux', 'Networking', 'Cloud', 'Docker'] },
  { title: 'DevOps Engineer', category: 'Cloud & Infrastructure', match: 79, icon: Zap, color: '#fbbf24', skills: ['Linux', 'Docker', 'CI/CD', 'Cloud'] },
  { title: 'UI/UX Designer', category: 'Design', match: 82, icon: Sparkles, color: '#f0abfc', skills: ['Figma', 'Wireframing', 'Prototyping', 'User Research'] },
  { title: 'Product Manager', category: 'Product & Business', match: 77, icon: BriefcaseBusiness, color: '#fbbf24', skills: ['Communication', 'Strategy', 'Analytics', 'Planning'] },
  { title: 'Business Analyst', category: 'Product & Business', match: 81, icon: BarChart3, color: '#6ee7b7', skills: ['SQL', 'Excel', 'Communication', 'Analytics'] },
  { title: 'Game Developer', category: 'Game Development', match: 76, icon: Code2, color: '#f0abfc', skills: ['C++', 'Unity', 'Programming', 'Maths'] },
  { title: 'Mobile App Developer', category: 'App Development', match: 80, icon: Code2, color: '#67e8f9', skills: ['Flutter', 'Java', 'APIs', 'UI Design'] },
  { title: 'QA Automation Engineer', category: 'Software Engineering', match: 78, icon: CheckCircle2, color: '#6ee7b7', skills: ['Testing', 'Python', 'Automation', 'Git'] },
]

const initialSkills = [
  { name: 'Python', level: 75 },
  { name: 'C++ & DSA', level: 60 },
  { name: 'Web Development', level: 55 },
  { name: 'Machine Learning', level: 30 },
]

const roadmap = [
  { title: 'Build your foundations', detail: 'Strengthen programming, Git and problem-solving.', time: 'Weeks 1–2' },
  { title: 'Learn your target skills', detail: 'Study Python, statistics and machine learning basics.', time: 'Weeks 3–5' },
  { title: 'Build a real project', detail: 'Create a project that demonstrates your new skills.', time: 'Weeks 6–8' },
  { title: 'Prepare for opportunities', detail: 'Polish your portfolio and practise interview questions.', time: 'Weeks 9–10' },
]

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Discover Careers', icon: Compass },
  { label: 'Skill Gap', icon: Target },
  { label: 'Career Roadmap', icon: Map },
  { label: 'Career Mentor', icon: Bot },
  { label: 'Project Hub', icon: FolderKanban },
  { label: 'Career Assessment', icon: ClipboardList },
  { label: 'Resume Analyzer', icon: FileSearch },
]



async function extractResumeText(file) {
  const buffer = await file.arrayBuffer()

  const pdf = await pdfjsLib.getDocument({
    data: new Uint8Array(buffer)
  }).promise

  const pages = []

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber)
    const content = await page.getTextContent()

    let pageText = ''
    let lastY = null

    for (const item of content.items) {
      if (!('str' in item)) continue

      const text = item.str.trim()
      if (!text) continue

      const y = item.transform[5]

      if (lastY !== null && Math.abs(y - lastY) > 3) {
        pageText += '\n'
      } else if (pageText && !pageText.endsWith('\n')) {
        pageText += ' '
      }

      pageText += text
      lastY = y
    }

    pages.push(pageText)
  }

  return pages.join('\n\n').trim()
}


function analyzeResumeText(resumeText) {
  const text = resumeText.toLowerCase()

  const allSkills = [
    'C++',
    'Python',
    'JavaScript',
    'HTML',
    'CSS',
    'React',
    'Node.js',
    'SQL',
    'Git',
    'Data Structures and Algorithms',
    'OOP',
    'Machine Learning',
    'scikit-learn',
    'FastAPI',
    'Communication',
    'Problem Solving'
  ]

  const detectedSkills = allSkills.filter(skill =>
    text.includes(skill.toLowerCase())
  )

  const careerOptions = [
    {
      title: 'Frontend Developer Intern',
      required: ['HTML', 'CSS', 'JavaScript', 'React', 'Git'],
      reason: 'The resume mentions React projects and core web technologies.'
    },
    {
      title: 'Software Developer Intern',
      required: ['C++', 'Python', 'Data Structures and Algorithms', 'OOP', 'SQL', 'Git'],
      reason: 'The resume includes programming, DSA, OOP and database concepts.'
    },
    {
      title: 'Junior Machine Learning Intern',
      required: ['Python', 'Machine Learning', 'scikit-learn', 'FastAPI'],
      reason: 'The Iris classification project provides relevant introductory ML experience.'
    }
  ]

  const roles = careerOptions
    .map(role => {
      const found = role.required.filter(skill =>
        text.includes(skill.toLowerCase())
      )

      const missing = role.required.filter(skill =>
        !text.includes(skill.toLowerCase())
      )

      return {
        ...role,
        found,
        missing,
        coverage: Math.round(
          (found.length / role.required.length) * 100
        )
      }
    })
    .sort((a, b) => b.coverage - a.coverage)

  return { detectedSkills, roles }
}


export default function App() {
  const [page, setPage] = useState('Overview')
  const [careers, setCareers] = useState(initialCareers)
  const [careerSearch, setCareerSearch] = useState('')
  const [customCareerName, setCustomCareerName] = useState('')
  const [customCareerSkills, setCustomCareerSkills] = useState('')
  const [showAddCareer, setShowAddCareer] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [completed, setCompleted] = useState([])
  const [skills, setSkills] = useState(initialSkills)
  const [goal, setGoal] = useState('AI / ML Engineer')
  const [interest, setInterest] = useState('AI & Data')
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! I’m your Career Mentor. Ask me about careers, skills, projects, or interview preparation.' }
  ])
  const [question, setQuestion] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [resumeText, setResumeText] = useState('')
  const [resumeLoading, setResumeLoading] = useState(false)
  const [resumeError, setResumeError] = useState('')

  
  const [profile, setProfile] = useState({
    name: '',
    education: "Bachelor's Degree",
    year: '2nd Year',
    interests: [],
    skills: [],
    goal: 'AI / ML Engineer',
    hours: '1–2 hours'
  })

  const [assessmentDone, setAssessmentDone] = useState(false)
  const matchedCareers = careers
  .map(career => {
    let score = 0

    if (profile.goal === career.title) {
      score += 3
    }

    if (
      profile.interests.some(interest =>
        career.title.toLowerCase().includes(
          interest.toLowerCase().replace('artificial intelligence', 'ai')
        )
      )
    ) {
      score += 2
    }

    return { ...career, matchScore: score }
  })
  .sort((a, b) => b.matchScore - a.matchScore)
  .slice(0, 3)

  const sendMessage = (event) => {
    event.preventDefault()
    if (!question.trim()) return
    const q = question.trim()
    let answer = 'Start with one small step: choose a target role, learn its core skills, and build a project to demonstrate what you know.'
    if (/skill|learn|roadmap/i.test(q)) answer = `For ${goal}, begin with the fundamentals, practise regularly, then build a project. Your current roadmap has ${roadmap.length} milestones. Open Career Roadmap to explore them.`
    else if (/project/i.test(q)) answer = 'Try a project that solves a real problem: a career recommendation tool, a student performance dashboard, or an AI-powered study planner. Document the problem, solution and results.'
    else if (/resume|interview|internship|job/i.test(q)) answer = 'Build a focused portfolio with 2–3 complete projects, explain your contribution clearly, practise common DSA questions, and tailor your resume to each opportunity.'
    else if (/hello|hi\b|hey/i.test(q)) answer = 'Hey there! Tell me your target career and I’ll help you plan your next learning steps.'
    setMessages(old => [...old, { from: 'user', text: q }, { from: 'bot', text: answer }])
    setQuestion('')
  }

  const toggleMilestone = (i) => setCompleted(old =>
    old.includes(i) ? old.filter(x => x !== i) : [...old, i]
  )

 
const filteredCareers = careers.filter(c => {
  const matchesSearch =
    c.title.toLowerCase().includes(careerSearch.toLowerCase()) ||
    c.category.toLowerCase().includes(careerSearch.toLowerCase()) ||
    c.skills.some(skill =>
      skill.toLowerCase().includes(careerSearch.toLowerCase())
    )

  const matchesInterest =
    interest === 'All fields' ||
    (interest === 'AI & Data' && /AI|Data/i.test(c.title)) ||
    (interest === 'Software' && /Software|Developer|QA/i.test(c.title)) ||
    (interest === 'Security' && /Security|Cybersecurity/i.test(c.title))

  return matchesSearch && matchesInterest
})


const pageIntro = {
  Overview: [
    'Your career journey starts here.',
    'Here’s your personalised career snapshot.'
  ],

  'Discover Careers': [
    'Find your direction.',
    'Explore roles that align with your interests.'
  ],

    'Resume Analyzer': [
    'Turn your resume into a career plan.',
    'Discover your strengths, skill gaps, and suitable career paths.'
  ],

  'Career Assessment': [
    'Discover your career direction.',
    'Tell us about your interests, skills, and goals.'
  ],

  'Skill Gap': [
    'Turn gaps into strengths.',
    'Compare your skills and plan what to learn next.'
  ],

  'Career Roadmap': [
    'Your goals, broken into steps.',
    'Follow your learning journey one milestone at a time.'
  ],

  'Career Mentor': [
    'Your personal career guide.',
    'Ask questions and get practical next steps.'
  ],

  'Project Hub': [
    'Build proof of your skills.',
    'Explore projects that make your portfolio stronger.'
  ]
};

const intro = pageIntro[page] || [
  'Your career journey starts here.',
  'Explore your next steps.'
];

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><Sparkles size={22} /></div>
          <div><strong>CareerCompass</strong><span>AI CAREER INTELLIGENCE</span></div>
          <button className="mobile-close" onClick={() => setMenuOpen(false)}><X /></button>
        </div>

        <div className="workspace-label">WORKSPACE</div>
        <nav className="nav-list">
          {navItems.map(({ label, icon: Icon }) => (
            <button key={label} className={`nav-item ${page === label ? 'active' : ''}`}
              onClick={() => { setPage(label); setMenuOpen(false) }}>
              <Icon size={19} /><span>{label}</span>
              {label === 'Career Mentor' && <span className="nav-new">NEW</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon"><Zap size={19} /></div>
            <strong>Your future is built daily.</strong>
            <p>Small steps today. Bigger possibilities tomorrow.</p>
            <button onClick={() => setPage('Career Roadmap')}>View my roadmap <ArrowUpRight size={15} /></button>
          </div>
          <div className="profile">
            <div className="avatar">S</div>
            <div><strong>Student Explorer</strong><span>Career explorer</span></div>
            <span className="profile-dots">•••</span>
          </div>
        </div>
      </aside>

      {menuOpen && <button className="mobile-overlay" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu /></button>
          <div className="breadcrumb">Workspace <ChevronRight size={15} /> <strong>{page}</strong></div>
          <div className="topbar-right">
            <div className="search-box"><Search size={17} /><input placeholder="Explore your future..." onKeyDown={e => { if (e.key === 'Enter') setPage('Discover Careers') }} /></div>
            <button className="icon-button" title="Notifications"><Bell size={19} /><i /></button>
            <div className="top-avatar">S</div>
          </div>
        </header>

        <div className="page-content">
          <section className="page-heading">
            <div><div className="eyebrow"><Sparkles size={14} /> YOUR PERSONAL CAREER SPACE</div>
              <h1>{intro[0]}</h1><p>{intro[1]}</p></div>
            <div className="heading-date"><span className="live-dot" /> YOUR JOURNEY, YOUR PACE</div>
          </section>

          {page === 'Overview' && <>
            <section className="hero-card">
              <div className="hero-copy">
                <div className="hero-pill"><Sparkles size={14} /> YOUR NEXT CHAPTER STARTS NOW</div>
                <h2>Discover your potential.<br /><span>Design your future.</span></h2>
                <p>Your skills are a starting point, not a limit. Find the right direction and build a plan that works for you.</p>
                <button className="primary-button" onClick={() => setPage('Discover Careers')}>Explore my career <ArrowUpRight size={17} /></button>
                <div className="hero-foot"><CheckCircle2 size={15} /> Personalised guidance · Actionable learning paths</div>
              </div>
              <div className="hero-art">
                <div className="orbit orbit-one" /><div className="orbit orbit-two" />
                <div className="planet"><Brain size={55} /></div>
                <div className="float-card float-top"><Sparkles size={16} /><div><strong>Potential unlocked</strong><span>One step at a time</span></div></div>
                <div className="float-card float-bottom"><Target size={18} /><div><strong>Clear direction</strong><span>Skills → Opportunities</span></div></div>
                <div className="orbit-dot dot-one" /><div className="orbit-dot dot-two" />
              </div>
            </section>

            <section className="stats-grid">
              <div className="stat-card"><div className="stat-top"><span>Career matches</span><span className="stat-icon purple"><Compass size={18} /></span></div><div className="stat-value">04 <span>pathways</span></div><div className="stat-foot">Explore your possibilities</div></div>
              <div className="stat-card"><div className="stat-top"><span>Skills to develop</span><span className="stat-icon cyan"><Target size={18} /></span></div><div className="stat-value">{skills.filter(s => s.level < 60).length.toString().padStart(2, '0')} <span>priority areas</span></div><div className="stat-foot">Focus on steady progress</div></div>
              <div className="stat-card"><div className="stat-top"><span>Roadmap progress</span><span className="stat-icon green"><Map size={18} /></span></div><div className="stat-value">{Math.round(completed.length / roadmap.length * 100)}<span>% complete</span></div><div className="progress-track"><div style={{ width: `${completed.length / roadmap.length * 100}%` }} /></div></div>
            </section>

            <section className="section-block">
              <div className="section-heading"><div><h3>Career paths for you</h3><p>Explore roles and the skills they need.</p></div><button className="text-button" onClick={() => setPage('Discover Careers')}>View all <ArrowUpRight size={16} /></button></div>
              <div className="career-grid">{careers.slice(0, 3).map(c => <CareerCard key={c.title} career={c} onClick={() => { setGoal(c.title); setPage('Skill Gap') }} />)}</div>
            </section>

            <section className="bottom-grid">
              <div className="panel"><div className="section-heading"><div><h3>Your skill snapshot</h3><p>Use the sliders to update your self-assessment.</p></div><Target size={19} className="muted-icon" /></div>
                {skills.map((s, i) => <div className="skill-row" key={s.name}><div className="skill-label"><span>{s.name}</span><strong>{s.level}%</strong></div><input aria-label={`${s.name} proficiency`} type="range" min="0" max="100" value={s.level} style={{ '--range-progress': `${s.level}%` }} onChange={e => setSkills(old => old.map((item, j) => j === i ? { ...item, level: Number(e.target.value) } : item))} /></div>)}
              </div>
              <div className="panel next-panel"><div className="section-heading"><div><h3>Your next steps</h3><p>Keep moving forward.</p></div><Zap size={19} className="muted-icon" /></div>
                {roadmap.slice(0, 3).map((r, i) => <button className="next-step" key={r.title} onClick={() => setPage('Career Roadmap')}><span className={`step-number step-${i}`}>{String(i + 1).padStart(2, '0')}</span><span><strong>{r.title}</strong><small>{r.time}</small></span><ChevronRight size={17} /></button>)}
              </div>
            </section>
          </>}


{page === 'Discover Careers' && <section className="section-block">
  <div className="career-toolbar">
    <input
      className="career-search"
      placeholder="Search careers, skills, or fields..."
      value={careerSearch}
      onChange={e => setCareerSearch(e.target.value)}
    />

    <select
      value={interest}
      onChange={e => setInterest(e.target.value)}
    >
      <option>All fields</option>
      <option>AI & Data</option>
      <option>Software</option>
      <option>Security</option>
    </select>

    <button
      className="primary-button"
      onClick={() => setShowAddCareer(!showAddCareer)}
    >
      {showAddCareer ? 'Cancel' : '+ Add Career'}
    </button>
  </div>

  {showAddCareer && (
    <form
      className="panel custom-career-form"
      onSubmit={e => {
        e.preventDefault()

        const title = customCareerName.trim()
        const skillList = customCareerSkills
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)

        if (!title || skillList.length === 0) return

        if (careers.some(c =>
          c.title.toLowerCase() === title.toLowerCase()
        )) {
          alert('This career already exists!')
          return
        }

        const newCareer = {
          title,
          category: 'Custom Career',
          match: 0,
          icon: BriefcaseBusiness,
          color: '#c4b5fd',
          skills: skillList,
        }

        setCareers(old => [...old, newCareer])
        setCareerSearch(title)
        setInterest('All fields')
        setCustomCareerName('')
        setCustomCareerSkills('')
        setShowAddCareer(false)
      }}
    >
      <h3>Add your own career</h3>
      <p>Enter a career title and the skills required for it.</p>

      <label>Career title</label>
      <input
        required
        placeholder="e.g. Robotics Engineer"
        value={customCareerName}
        onChange={e => setCustomCareerName(e.target.value)}
      />

      <label>Required skills (separate with commas)</label>
      <input
        required
        placeholder="Python, C++, Robotics, Mathematics"
        value={customCareerSkills}
        onChange={e => setCustomCareerSkills(e.target.value)}
      />

      <button className="primary-button" type="submit">
        Save Career
      </button>
    </form>
  )}

  <div className="filter-summary">
    <h3>Explore career paths</h3>
    <p>
      {filteredCareers.length} matching careers · Search by role, field, or skill.
    </p>
  </div>

  {filteredCareers.length > 0 ? (
    <div className="career-grid">
      {filteredCareers.map(c => (
        <CareerCard
          key={c.title}
          career={c}
          onClick={() => {
            setGoal(c.title)
            setPage('Skill Gap')
          }}
        />
      ))}
    </div>
  ) : (
    <div className="panel empty-state">
      <h3>No careers found</h3>
      <p>Try a different search or add your own career.</p>
    </div>
  )}

  <div className="info-banner">
    <Sparkles size={21} />
    <div>
      <strong>Explore beyond job titles</strong>
      <p>
        Search by career name, category, or skill. Custom careers are
        currently saved for this session and reset when the page reloads.
      </p>
    </div>
  </div>
</section>}

          {page === 'Career Assessment' && (
            <section className="section-block">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">PERSONALIZED GUIDANCE</span>
                  <h2>Let's discover your career path.</h2>
                  <p>Tell us about yourself to build your career profile.</p>
                </div>
              </div>

              <form
                className="panel assessment-form"
                onSubmit={e => {
                  e.preventDefault()
                  setAssessmentDone(true)
                }}
              >
                <h3>01 — About you</h3>

                <label htmlFor="student-name">Your name</label>
                <input
                  id="student-name"
                  required
                  placeholder="Enter your name"
                  value={profile.name}
                  onChange={e =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                />

                <div className="assessment-grid">
                  <div>
                    <label htmlFor="education">Education</label>
                    <select
                      id="education"
                      value={profile.education}
                      onChange={e =>
                        setProfile({ ...profile, education: e.target.value })
                      }
                    >
                      <option>School</option>
                      <option>Diploma</option>
                      <option>Bachelor's Degree</option>
                      <option>Master's Degree</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="year">Current year</label>
                    <select
                      id="year"
                      value={profile.year}
                      onChange={e =>
                        setProfile({ ...profile, year: e.target.value })
                      }
                    >
                      <option>School Student</option>
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>4th Year</option>
                      <option>Graduate</option>
                    </select>
                  </div>
                </div>

                <h3>02 — What interests you?</h3>
                <p className="assessment-hint">Select all areas you enjoy.</p>

                <div className="assessment-options">
                  {[
                    'Artificial Intelligence',
                    'Data & Analytics',
                    'Web Development',
                    'App Development',
                    'Cybersecurity',
                    'Cloud & DevOps',
                    'Design & Creativity',
                    'Business & Management',
                    'Gaming',
                    'Robotics'
                  ].map(item => (
                    <label className="assessment-option" key={item}>
                      <input
                        type="checkbox"
                        checked={profile.interests.includes(item)}
                        onChange={e =>
                          setProfile({
                            ...profile,
                            interests: e.target.checked
                              ? [...profile.interests, item]
                              : profile.interests.filter(x => x !== item)
                          })
                        }
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>

                <h3>03 — Skills you already have</h3>
                <p className="assessment-hint">
                  Select skills you have practised. You don't need to be an expert.
                </p>

                <div className="assessment-options">
                  {[
                    'C++',
                    'Java',
                    'Python',
                    'JavaScript',
                    'HTML & CSS',
                    'SQL',
                    'Data Structures',
                    'Machine Learning',
                    'Communication',
                    'UI/UX Design',
                    'Problem Solving',
                    'Git & GitHub'
                  ].map(item => (
                    <label className="assessment-option" key={item}>
                      <input
                        type="checkbox"
                        checked={profile.skills.includes(item)}
                        onChange={e =>
                          setProfile({
                            ...profile,
                            skills: e.target.checked
                              ? [...profile.skills, item]
                              : profile.skills.filter(x => x !== item)
                          })
                        }
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>

                <h3>04 — Your career goal</h3>

                <label htmlFor="assessment-goal">Preferred career</label>
                <select
                  id="assessment-goal"
                  value={profile.goal}
                  onChange={e =>
                    setProfile({ ...profile, goal: e.target.value })
                  }
                >
                  {careers.map(career => (
                    <option key={career.title} value={career.title}>
                      {career.title}
                    </option>
                  ))}
                </select>

                <label htmlFor="study-hours">Time available to learn daily</label>
                <select
                  id="study-hours"
                  value={profile.hours}
                  onChange={e =>
                    setProfile({ ...profile, hours: e.target.value })
                  }
                >
                  <option>Under 1 hour</option>
                  <option>1–2 hours</option>
                  <option>2–4 hours</option>
                  <option>4+ hours</option>
                </select>

                <button className="primary-button" type="submit">
                  Generate My Career Plan →
                </button>

                {assessmentDone && (
                  <div className="assessment-success" role="status">
                    <h3>Profile completed, {profile.name}!</h3>
                    
<p>
  Based on your selected goal, here are your top career matches.
</p>

<div className="career-match-list">
  {matchedCareers.map(career => (
    <div className="career-match-card" key={career.title}>
      <div>
        <h4>{career.title}</h4>
        <p>
          {career.matchScore >= 3
            ? 'Matches your selected career goal.'
            : career.matchScore > 0
            ? 'Matches some of your preferences.'
            : 'Explore this career as another option.'}
        </p>
      </div>

      <span>
        {career.matchScore >= 3 ? 'Goal match' : 'Explore'}
      </span>
    </div>
  ))}
</div>

                    <button
                      className="primary-button"
                      type="button"
                      onClick={() => {
                        setGoal(profile.goal)
                        setPage('Skill Gap')
                      }}
                    >
                      Explore My Skill Gap →
                    </button>
                  </div>
                )}
              </form>
            </section>
          )}


{page === 'Resume Analyzer' && (
  <section className="section-block">
    <div className="section-heading">
      <div>
        <span className="eyebrow">RESUME INTELLIGENCE</span>
        <h2>Turn your resume into opportunities.</h2>
        <p>
          Upload your resume to discover your strengths,
          skill gaps, and suitable career paths.
        </p>
      </div>
    </div>

    <div className="panel assessment-form">
      <h3>Upload your resume</h3>
      <p className="assessment-hint">
        Choose your resume in PDF format.
      </p>

      <label htmlFor="resume-file">Resume (PDF)</label>
      <input
        id="resume-file"
        type="file"
        accept=".pdf,application/pdf"
        
onChange={e => {
  const file = e.target.files?.[0]

  setResumeFile(file || null)
  setResumeText('')
  setResumeError('')

  if (file && file.type !== 'application/pdf') {
    setResumeError('Please select a PDF file.')
    setResumeFile(null)
  }
}}

      />
      
      {resumeFile && (
        <p className="assessment-hint">
          Selected: {resumeFile.name}
        </p>
      )}

      {resumeError && (
        <p role="alert">{resumeError}</p>
      )}
      
      <button
        className="primary-button"
        disabled={!resumeFile || resumeLoading}
        onClick={async () => {
          try {
            setResumeLoading(true)
            setResumeError('')

            const text = await extractResumeText(resumeFile)

            if (!text) {
              setResumeError('No readable text found. Please use a text-based PDF.')
              return
            }

            setResumeText(text)
          } catch (error) {
            console.error(error)
            setResumeError('Could not read this PDF. Please try another file.')
          } finally {
            setResumeLoading(false)
          }
        }}
      >
        {resumeLoading ? 'Reading Resume...' : 'Analyze Resume'}
      </button>

      

{resumeText && (
  <div className="resume-results">
    <h3>Resume Analysis Report</h3>
    <p className="assessment-hint">
      Career suggestions based on skills and projects mentioned in your resume.
    </p>

    <h3>Skills Identified</h3>
    <div className="project-tags">
      {analyzeResumeText(resumeText).detectedSkills.length > 0 ? (
        analyzeResumeText(resumeText).detectedSkills.map(skill => (
          <span key={skill}>{skill}</span>
        ))
      ) : (
        <p>No recognised skills found. Try a resume with a skills section.</p>
      )}
    </div>

    <h3>Recommended Career Paths</h3>

    {analyzeResumeText(resumeText).roles.map(role => (
      <div className="panel" key={role.title}>
        <h4>{role.title}</h4>
        <p>{role.reason}</p>

        <div className="analysis-skill">
          <div className="skill-label">
            <span>Resume keyword coverage</span>
            <strong>{role.coverage}%</strong>
          </div>
          <div className="progress-track">
            <div style={{ width: `${role.coverage}%` }} />
          </div>
        </div>

        <p>
          <strong>Skills found:</strong>{' '}
          {role.found.join(', ') || 'None identified'}
        </p>

        <p>
          <strong>Skills to learn or highlight:</strong>{' '}
          {role.missing.join(', ') || 'No missing keywords from this checklist'}
        </p>
      </div>
    ))}

    <div className="info-banner">
      <GraduationCap size={22} />
      <div>
        <strong>How to improve your resume</strong>
        <p>
          Highlight relevant projects, explain what you built,
          mention the technologies used, and include measurable results
          where accurate. Learn missing skills through practice projects.
        </p>
      </div>
    </div>

    <p className="assessment-hint">
      These recommendations use keyword matching, not a live job database
      or an AI model. Keyword coverage does not measure actual ability
      or guarantee job eligibility.
    </p>
  </div>
)}



    </div>
  </section>
)}


{page === 'Skill Gap' && <section className="section-block">
  <div className="panel goal-panel">
    <label htmlFor="career-goal">Choose your target career</label>
    <select
      id="career-goal"
      value={goal}
      onChange={e => setGoal(e.target.value)}
    >
      {careers.map(c => (
        <option key={c.title}>{c.title}</option>
      ))}
    </select>
    <p>Adjust your proficiency sliders on the Overview page to update your self-assessment.</p>
  </div>

  <div className="skill-analysis-grid">
    <div className="panel">
      <div className="section-heading">
        <div>
          <h3>Your current skills</h3>
          <p>Based on your self-assessment</p>
        </div>
      </div>
      {skills.map(s => (
        <div className="analysis-skill" key={s.name}>
          <div className="skill-label">
            <span>{s.name}</span>
            <strong>{s.level}%</strong>
          </div>
          <div className="progress-track">
            <div style={{ width: `${s.level}%` }} />
          </div>
        </div>
      ))}
    </div>

    <div className="panel">
      <div className="section-heading">
        <div>
          <h3>Skills to focus on</h3>
          <p>Suggested areas for {goal}</p>
        </div>
      </div>
      {(careers.find(c => c.title === goal)?.skills || []).map(s => {
        const current =
          skills.find(x =>
            x.name.toLowerCase().includes(s.toLowerCase())
          )?.level ?? 20

        return (
          <div className="gap-item" key={s}>
            <div className="gap-icon"><Target size={17} /></div>
            <div>
              <strong>{s}</strong>
              <span>
                {current >= 70
                  ? 'Keep practising'
                  : current >= 40
                    ? 'Build confidence'
                    : 'High learning priority'}
              </span>
            </div>
            <span className="gap-priority">
              {current >= 70
                ? 'Maintain'
                : current >= 40
                  ? 'Medium'
                  : 'Priority'}
            </span>
          </div>
        )
      })}
    </div>
  </div>

  <div className="info-banner">
    <GraduationCap size={22} />
    <div>
      <strong>Remember: skill scores are estimates.</strong>
      <p>
        Use them to plan learning, not as a formal measure of your ability.
        Each career can require different levels of proficiency.
      </p>
    </div>
  </div>
</section>}


          {page === 'Career Roadmap' && <section className="section-block">
            <div className="roadmap-summary panel"><div><span className="eyebrow">YOUR LEARNING JOURNEY</span><h2>Becoming a {goal}</h2><p>Illustrative 10-week roadmap — adapt it to your schedule.</p></div><div className="roadmap-score">{completed.length}/{roadmap.length}<span>milestones</span></div></div>
            <div className="timeline">{roadmap.map((r, i) => <div className="timeline-item" key={r.title}><div className={`timeline-marker ${completed.includes(i) ? 'done' : ''}`}>{completed.includes(i) ? <CheckCircle2 size={20} /> : i + 1}</div><div className="panel timeline-card"><div className="timeline-meta"><span>{r.time}</span><span className="duration"><Clock size={14} /> Flexible pace</span></div><h3>{r.title}</h3><p>{r.detail}</p><button className={`milestone-button ${completed.includes(i) ? 'is-done' : ''}`} onClick={() => toggleMilestone(i)}>{completed.includes(i) ? <><CheckCircle2 size={16} /> Completed</> : 'Mark as complete'}</button></div></div>)}</div>
          </section>}

          {page === 'Career Mentor' && <section className="chat-panel panel"><div className="chat-header"><div className="bot-avatar"><Bot size={25} /></div><div><h3>CareerCompass Mentor</h3><p><span className="live-dot" /> Demo career guidance assistant</p></div><span className="mentor-tag"><Sparkles size={14} /> GUIDE</span></div>
            <div className="chat-messages">{messages.map((m, i) => <div key={i} className={`message ${m.from}`}><div className="message-avatar">{m.from === 'bot' ? <Bot size={17} /> : 'S'}</div><div className="message-bubble">{m.text}</div></div>)}</div>
            <div className="suggested-prompts"><button onClick={() => setQuestion('What skills should I learn?')}>What skills should I learn?</button><button onClick={() => setQuestion('Suggest a project for me')}>Suggest a project</button><button onClick={() => setQuestion('How do I prepare for internships?')}>Internship preparation</button></div>
            <form className="chat-input" onSubmit={sendMessage}><input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask about your career journey..." /><button type="submit" aria-label="Send message"><Send size={18} /></button></form>
            <p className="chat-disclaimer">Demo assistant with predefined guidance — not a live AI model.</p>
          </section>}

          {page === 'Project Hub' && <section className="section-block">
            <div className="project-grid">
              {[{name:'Career Recommendation Engine',level:'INTERMEDIATE',desc:'Build a rule-based system that matches interests and skills to suitable careers.',tags:['JavaScript','Scoring Logic']},{name:'Student Skill Dashboard',level:'BEGINNER',desc:'Visualise self-assessed skills, learning goals and progress over time.',tags:['React','Charts']},{name:'AI Study Planner',level:'INTERMEDIATE',desc:'Create a study planner that suggests learning tasks based on career goals.',tags:['React','Recommendation']},{name:'Job Description Skill Extractor',level:'ADVANCED',desc:'Explore extracting required skills from job descriptions and comparing them to a profile.',tags:['NLP','Python'] }].map((p, i) => <div className="panel project-card" key={p.name}><div className="project-card-top"><div className="project-icon"><FolderKanban size={21} /></div><span>{p.level}</span></div><h3>{p.name}</h3><p>{p.desc}</p><div className="project-tags">{p.tags.map(t => <span key={t}>{t}</span>)}</div><button className="text-button" onClick={() => { setGoal(i === 3 ? 'AI / ML Engineer' : 'Software Developer'); setPage('Career Roadmap') }}>Add to learning plan <ArrowUpRight size={15} /></button></div>)}
            </div>
          </section>}
          <footer className="footer"><span><Sparkles size={14} /> CareerCompass AI</span><span>Explore with curiosity. Grow with intention.</span></footer>
        </div>
      </main>
    </div>
  )
}

function CareerCard({ career, onClick }) {
  const Icon = career.icon
  return <button className="career-card" onClick={onClick}><div className="career-card-top"><div className="career-icon" style={{ color: career.color, background: `${career.color}14` }}><Icon size={22} /></div><span className="match-badge">{career.match}% match <ArrowUpRight size={13} /></span></div><div className="career-category">{career.category}</div><h3>{career.title}</h3><div className="career-skills">{career.skills.slice(0, 3).map(s => <span key={s}>{s}</span>)}</div><div className="career-card-bottom"><span>Explore skill gaps</span><ChevronRight size={17} /></div></button>
}
