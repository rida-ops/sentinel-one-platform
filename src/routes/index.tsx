import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { AlertTriangle, ArrowRight, Camera, CheckCircle2, Droplets, Flame, MapPin, ShieldCheck, Siren, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const categories = [
  { label: 'Fire', icon: Flame, tone: 'bg-destructive/10 text-destructive border-destructive/20' },
  { label: 'Water leak', icon: Droplets, tone: 'bg-primary/10 text-primary border-primary/20' },
  { label: 'Road damage', icon: AlertTriangle, tone: 'bg-accent/30 text-accent-foreground border-accent/50' },
  { label: 'Electricity', icon: Zap, tone: 'bg-secondary text-secondary-foreground border-border' },
  { label: 'Emergency', icon: Siren, tone: 'bg-destructive/10 text-destructive border-destructive/20' },
  { label: 'Other issue', icon: MapPin, tone: 'bg-muted text-muted-foreground border-border' },
]

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'Sentinel ONE · Public Service Response' },
    { name: 'description', content: 'Report municipal incidents and help your community respond faster.' },
  ] }),
  component: CitizenHome,
})

function CitizenHome() {
  const [category, setCategory] = useState('Water leak')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [reference, setReference] = useState('')

  const submit = () => {
    if (!description.trim() || !location.trim()) return
    setReference(`S1-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`)
    setSubmitted(true)
  }

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border/80 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm"><ShieldCheck className="size-5" /></div><div><p className="font-semibold tracking-tight">SENTINEL ONE</p><p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Public service response</p></div></div>
          <div className="flex items-center gap-2"><Link to="/app"><Button variant="ghost" size="sm">Operations portal</Button></Link><Button size="sm" onClick={() => window.location.href = '#report'}>Report an incident <ArrowRight className="size-4" /></Button></div>
        </div>
      </header>
      <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:pt-20">
        <div className="space-y-7"><div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground"><span className="size-2 rounded-full bg-chart-2" /> Response network online</div><h1 className="max-w-2xl font-serif text-5xl leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">Report it. <span className="text-primary">Route it.</span> Resolve it.</h1><p className="max-w-xl text-lg leading-8 text-muted-foreground">One clear channel for water leaks, road hazards, fire incidents, power outages, and the issues that keep a city moving.</p><div className="flex flex-wrap gap-3"><a href="#report"><Button size="lg">Start a report <ArrowRight className="size-4" /></Button></a><Link to="/app"><Button size="lg" variant="outline">View response center</Button></Link></div><div className="flex items-center gap-6 border-t border-border pt-5 text-xs text-muted-foreground"><span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-chart-2" /> Reference number included</span><span className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" /> Privacy-first</span></div></div>
        <ReportCard category={category} setCategory={setCategory} description={description} setDescription={setDescription} location={location} setLocation={setLocation} submitted={submitted} reference={reference} submit={submit} />
      </section>
      <section className="border-y border-border bg-secondary/45"><div className="mx-auto grid max-w-7xl gap-5 px-5 py-8 sm:grid-cols-3 lg:px-8"><InfoItem icon={ShieldCheck} title="One connected system" body="Your report reaches the right department with a trackable history." /><InfoItem icon={MapPin} title="Location matters" body="Share a precise address so crews can respond with context." /><InfoItem icon={Camera} title="Evidence helps" body="Add a photo when it is safe and useful to do so." /></div></section>
    </main>
  )
}

function ReportCard({ category, setCategory, description, setDescription, location, setLocation, submitted, reference, submit }: { category: string; setCategory: (value: string) => void; description: string; setDescription: (value: string) => void; location: string; setLocation: (value: string) => void; submitted: boolean; reference: string; submit: () => void }) {
  return <Card id="report" className="overflow-hidden border-primary/15 shadow-lg shadow-primary/5"><CardHeader className="border-b border-border bg-card pb-5"><div className="flex items-center justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">Citizen intake</p><CardTitle className="mt-1 text-2xl">What needs attention?</CardTitle></div><span className="rounded-md bg-secondary px-2 py-1 font-mono text-[10px] text-secondary-foreground">2 min</span></div></CardHeader><CardContent className="space-y-5 pt-6">{submitted ? <div className="rounded-xl border border-chart-2/30 bg-chart-2/10 p-5"><CheckCircle2 className="size-8 text-chart-2" /><h2 className="mt-3 text-xl font-semibold">Report received</h2><p className="mt-1 text-sm text-muted-foreground">Keep this reference number to track updates with your municipality.</p><p className="mt-4 rounded-lg bg-card px-4 py-3 font-mono text-lg font-semibold tracking-wider">{reference}</p><Button className="mt-4" variant="outline" onClick={() => window.location.reload()}>Submit another report</Button></div> : <><div><p className="mb-3 text-sm font-medium">Choose a category</p><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{categories.map(({ label, icon: Icon, tone }) => <button key={label} type="button" onClick={() => setCategory(label)} className={`flex min-h-20 flex-col items-start justify-between rounded-lg border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${tone} ${category === label ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}><Icon className="size-5" /><span className="text-xs font-medium">{label}</span></button>)}</div></div><div><label htmlFor="description" className="mb-2 block text-sm font-medium">Describe the problem</label><Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="What happened? Include anything responders should know." className="min-h-24 resize-none" /></div><div><label htmlFor="location" className="mb-2 block text-sm font-medium">Where is it?</label><Input id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="Street address, landmark, or intersection" /></div><div className="flex items-center justify-between gap-4 rounded-lg border border-dashed border-border bg-muted/40 p-3"><div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-md bg-background"><Camera className="size-4 text-muted-foreground" /></div><div><p className="text-sm font-medium">Add evidence</p><p className="text-xs text-muted-foreground">Photos and video can be attached after sign-in.</p></div></div><Button type="button" variant="outline" size="sm" disabled>Attach</Button></div><Button className="w-full" size="lg" disabled={!description.trim() || !location.trim()} onClick={submit}>Submit report <ArrowRight className="size-4" /></Button><p className="text-center text-xs text-muted-foreground">For immediate danger, call your local emergency number first.</p></>}</CardContent></Card>
}

function InfoItem({ icon: Icon, title, body }: { icon: typeof ShieldCheck; title: string; body: string }) { return <div className="flex gap-3"><div className="grid size-9 shrink-0 place-items-center rounded-md bg-background text-primary"><Icon className="size-4" /></div><div><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{body}</p></div></div> }
