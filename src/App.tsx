import { FormEvent, useEffect, useMemo, useState } from 'react'
import { divIcon } from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const EVENT = {
  child: 'Arsha',
  age: 3,
  date: '2026-12-12T15:00:00+07:00',
  endTime: '18:00',
  venue: 'VENUE TO BE ANNOUNCED',
  address: 'Full party address will be added here',
  mapsUrl: 'https://maps.google.com',
  whatsapp: '6280000000000',
  bank: 'BANK NAME',
  accountHolder: 'ACCOUNT HOLDER NAME',
  accountNumber: '0000 0000 0000',
  qrisImage: '',
  schedule: [
    ['15:00', 'Hero check-in'],
    ['15:30', 'Games & missions'],
    ['16:30', 'Cake ceremony'],
    ['17:00', 'Food & refreshments'],
    ['17:45', 'Squad photo & closing'],
  ],
  gallery: ['', '', '', '', '', ''],
}

function PixelHero({ small = false }: { small?: boolean }) {
  return (
    <svg className={`pixel-hero ${small ? 'small' : ''}`} viewBox="0 0 64 96" role="img" aria-label="Pixel art web-slinging superhero">
      <g shapeRendering="crispEdges">
        <rect x="22" y="2" width="20" height="5" fill="#111827"/><rect x="17" y="7" width="30" height="22" fill="#ef3340"/>
        <rect x="12" y="12" width="5" height="12" fill="#ef3340"/><rect x="47" y="12" width="5" height="12" fill="#ef3340"/>
        <rect x="21" y="11" width="8" height="10" fill="#f7f2da"/><rect x="35" y="11" width="8" height="10" fill="#f7f2da"/>
        <rect x="24" y="14" width="5" height="7" fill="#a8dff2"/><rect x="35" y="14" width="5" height="7" fill="#a8dff2"/>
        <rect x="27" y="29" width="10" height="5" fill="#111827"/><rect x="17" y="34" width="30" height="30" fill="#ef3340"/>
        <rect x="12" y="37" width="5" height="25" fill="#ef3340"/><rect x="7" y="58" width="10" height="8" fill="#ef3340"/>
        <rect x="47" y="37" width="5" height="25" fill="#ef3340"/><rect x="47" y="58" width="10" height="8" fill="#ef3340"/>
        <rect x="17" y="51" width="30" height="18" fill="#1856a5"/><rect x="27" y="39" width="10" height="18" fill="#101826"/>
        <rect x="30" y="42" width="4" height="4" fill="#f7f2da"/><rect x="26" y="46" width="12" height="3" fill="#f7f2da"/>
        <rect x="18" y="67" width="12" height="22" fill="#1856a5"/><rect x="34" y="67" width="12" height="22" fill="#1856a5"/>
        <rect x="13" y="86" width="17" height="8" fill="#ef3340"/><rect x="34" y="86" width="17" height="8" fill="#ef3340"/>
        <path d="M20 8h24M18 16h28M19 24h26M24 34v29M40 34v29M18 43h28M19 52h28" stroke="#141c2c" strokeWidth="1"/>
      </g>
    </svg>
  )
}

function ComicHero() {
  return (
    <svg className="comic-hero" viewBox="0 0 380 560" role="img" aria-label="Detailed red and blue web-slinging superhero">
      <defs>
        <linearGradient id="suitRed" x1="0" x2="1"><stop stopColor="#7f0d1b"/><stop offset=".45" stopColor="#ef3340"/><stop offset="1" stopColor="#8a101d"/></linearGradient>
        <linearGradient id="suitBlue" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#071b42"/><stop offset=".5" stopColor="#1768b4"/><stop offset="1" stopColor="#06152e"/></linearGradient>
        <filter id="heroShadow"><feDropShadow dx="12" dy="14" stdDeviation="8" floodColor="#000" floodOpacity=".55"/></filter>
      </defs>
      <g filter="url(#heroShadow)" stroke="#050914" strokeWidth="7" strokeLinejoin="round">
        <path d="M210 112c-46-8-79 13-83 61-3 39 20 76 62 79 43 3 75-30 73-75-2-35-19-59-52-65z" fill="url(#suitRed)"/>
        <path d="M211 252c-46 1-80 27-91 80l-18 104 64 18 23-106 19 1 34 102 62-25-42-121c-11-34-29-53-51-53z" fill="url(#suitRed)"/>
        <path d="M150 286c-25 13-43 31-55 56L31 455l46 31 88-112zM261 280c32 12 53 36 69 65l40 74-48 25-77-99z" fill="url(#suitRed)"/>
        <path d="M166 369l-12 88-32 93h67l35-132 24 132h69l-36-128-3-62z" fill="url(#suitBlue)"/>
        <path d="M102 434l-28 52-44-29 28-52zM321 414l48 7-8 54-55-9zM121 550h68v10h-79zM248 550h69l14 10h-83z" fill="url(#suitRed)"/>
        <path d="M143 170c14-25 33-34 49-35l-14 65c-22 1-34-10-35-30zM245 165c-10-23-26-31-41-31l12 64c20 2 31-10 29-33z" fill="#eefcff" strokeWidth="5"/>
        <path d="M190 253c-10 35-11 68 8 93 17-16 21-16 35 0 13-29 9-59-1-92z" fill="#0a1120"/>
        <path d="M214 273v52m-20-36h40m-31-9l11-16 11 16m-22 30l11 16 11-16" fill="none" stroke="#edf5df" strokeWidth="5"/>
      </g>
      <g fill="none" stroke="#2b0710" strokeWidth="2" opacity=".8"><path d="M194 116v134M161 126c30 24 66 23 91-1M139 151c35 27 87 31 119 2M129 181c39 27 92 32 132 2M134 214c36 20 83 23 122 1"/><path d="M194 116l-50 112M194 116l53 112M194 116l-2 136M194 116l-30 130M194 116l30 132"/></g>
      <path d="M29 455C4 315 74 201 133 171" fill="none" stroke="#dff8ff" strokeWidth="4"/>
    </svg>
  )
}

type LocationPoint = { name: string; lat: number; lng: number }
const DKI_LOCATIONS: LocationPoint[] = [
  { name: 'Jakarta Pusat — Monas', lat: -6.1754, lng: 106.8272 },
  { name: 'Jakarta Selatan — Blok M', lat: -6.2447, lng: 106.8007 },
  { name: 'Jakarta Utara — Ancol', lat: -6.1256, lng: 106.8364 },
  { name: 'Jakarta Barat — Kota Tua', lat: -6.1352, lng: 106.8133 },
  { name: 'Jakarta Timur — TMII', lat: -6.3024, lng: 106.8951 },
]
const heroMarker = divIcon({ className: 'hero-map-marker', html: '<span></span>', iconSize: [34, 34], iconAnchor: [17, 17] })

function LocationPicker({ onPick }: { onPick: (point: LocationPoint) => void }) {
  useMapEvents({ click(event) { onPick({ name: 'Titik pilihan Anda', lat: event.latlng.lat, lng: event.latlng.lng }) } })
  return null
}

function SectionTitle({ kicker, children }: { kicker: string; children: React.ReactNode }) {
  return <div className="section-title"><span>{kicker}</span><h2>{children}</h2></div>
}

function App() {
  const target = useMemo(() => new Date(EVENT.date).getTime(), [])
  const [now, setNow] = useState(Date.now())
  const [opened, setOpened] = useState(false)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const [wish, setWish] = useState('')
  const [demoWishes, setDemoWishes] = useState<{name:string; text:string}[]>([])
  const [location, setLocation] = useState<LocationPoint>(DKI_LOCATIONS[0])

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  const delta = Math.max(0, target - now)
  const countdown = [
    ['DAYS', Math.floor(delta / 86400000)],
    ['HRS', Math.floor(delta / 3600000) % 24],
    ['MIN', Math.floor(delta / 60000) % 60],
    ['SEC', Math.floor(delta / 1000) % 60],
  ]
  const dateText = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(EVENT.date))

  const openInvite = () => {
    setOpened(true)
    window.setTimeout(() => document.querySelector('#greeting')?.scrollIntoView({ behavior: 'smooth' }), 550)
  }
  const submitRsvp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const text = `RSVP for Arsha's birthday\nGuardian: ${data.get('guardian')}\nChild: ${data.get('child')}\nAttendance: ${data.get('attendance')}\nGuests: ${data.get('guests')}\nMessage: ${data.get('message') || '-'}`
    window.open(`https://wa.me/${EVENT.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
  }
  const submitWish = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    setDemoWishes((w) => [{ name: String(data.get('name')), text: wish }, ...w])
    setWish('')
    e.currentTarget.reset()
  }

  return (
    <main className={opened ? 'opened' : ''}>
      <nav aria-label="Main navigation"><a href="#top" className="brand">AR<span>3</span>HA</a><div><a href="#details">DETAILS</a><a href="#tracker">TRACKER</a><a href="#rsvp">RSVP</a></div></nav>
      <section className="hero" id="top">
        <div className="web web-a"/><div className="web web-b"/><div className="moon"/>
        <div className="skyline" aria-hidden="true">{Array.from({length: 18}).map((_,i)=><i key={i}/>)}</div>
        <div className="swinger realistic"><span className="rope"/><ComicHero /></div>
        {opened && <div className="confetti" aria-hidden="true">{Array.from({length:24}).map((_,i)=><i key={i}/>)}</div>}
        <div className="hero-copy">
          <p className="eyebrow">INCOMING HERO TRANSMISSION</p>
          <h1><span>HAPPY</span><strong>BIRTHDAY!</strong></h1>
          <div className="turning">{EVENT.child.toUpperCase()} IS TURNING <b>{EVENT.age}</b></div>
          <p className="date">{dateText} · 3:00 PM</p>
          <div className="actions"><button className="btn primary" onClick={openInvite}>OPEN INVITATION <span>→</span></button><a className="btn ghost" href="#rsvp">RSVP NOW</a></div>
        </div>
        <div className="scroll-note">SCROLL TO ENTER <span>↓</span></div>
      </section>

      <section className="greeting split" id="greeting">
        <div><SectionTitle kicker="A NEW MISSION BEGINS">Calling all little heroes!</SectionTitle><p>Our tiny neighborhood hero is leveling up. Join us for an action-packed afternoon of games, cake, and city-sized fun as Arsha turns three.</p><a href="#details" className="text-link">VIEW MISSION DETAILS →</a></div>
        <div className="comic-burst"><b>3!</b><span>YEARS OF<br/>AWESOME</span></div>
      </section>

      <section className="star-section">
        <div className="star-card"><div className="halftone"/><ComicHero /><div><span>PLAYER ONE</span><h2>MEET<br/>ARSHA</h2><p>Brave. Curious. Always ready for the next adventure.</p><div className="stats"><b>LEVEL {EVENT.age}</b><b>POWER: ∞</b></div></div></div>
      </section>

      <section id="details" className="details">
        <SectionTitle kicker="CLASSIFIED PARTY INTEL">Mission details</SectionTitle>
        <div className="detail-grid">
          <article><span>01 / DATE</span><h3>{dateText}</h3><p>Save the date, heroes.</p></article>
          <article><span>02 / TIME</span><h3>15:00—{EVENT.endTime}</h3><p>Local hero time.</p></article>
          <article><span>03 / BASE</span><h3>{EVENT.venue}</h3><p>{EVENT.address}</p></article>
        </div>
        <a className="btn primary" href={EVENT.mapsUrl} target="_blank" rel="noreferrer">GET DIRECTIONS →</a>
      </section>

      <section className="count-section"><SectionTitle kicker="TIME UNTIL LAUNCH">The countdown is on</SectionTitle>
        <div className="countdown">{delta === 0 ? <div className="live">THE PARTY HAS BEGUN!</div> : countdown.map(([label,value])=><div key={label}><b>{String(value).padStart(2,'0')}</b><span>{label}</span></div>)}</div>
      </section>

      <section className="theme split"><div className="theme-art"><div className="mask-eyes"><i/><i/></div><span>WEB<br/>WARRIORS</span></div><div><SectionTitle kicker="SUIT UP">Party theme</SectionTitle><p>Come dressed as your favorite friendly hero, comic character, or in bold red and blue. Costumes are encouraged, never required.</p><div className="dress-code"><b>DRESS CODE</b><span>RED / BLUE / HERO READY</span></div></div></section>

      <section className="schedule"><SectionTitle kicker="MISSION TIMELINE">Party schedule</SectionTitle><div className="timeline">{EVENT.schedule.map(([time,title],i)=><div key={time}><b>{time}</b><i>{String(i+1).padStart(2,'0')}</i><h3>{title}</h3></div>)}</div></section>

      <section id="tracker" className="tracker-section"><SectionTitle kicker="SIGNAL ACQUIRED">Spider tracker</SectionTitle>
        <div className="tracker live-map">
          <div className="tracker-head"><span>SPIDER TRACKER / ARCADE NETWORK</span><b>BIRTHDAY SIGNAL DETECTED</b></div>
          <div className="map">
            <MapContainer center={[location.lat, location.lng]} zoom={11} scrollWheelZoom className="leaflet-map">
              <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
              <LocationPicker onPick={setLocation}/>
              {DKI_LOCATIONS.map(point => <Marker key={point.name} position={[point.lat, point.lng]} icon={heroMarker} eventHandlers={{click:()=>setLocation(point)}}><Popup>{point.name}</Popup></Marker>)}
              <Marker position={[location.lat, location.lng]} icon={heroMarker}><Popup>Lokasi pesta: {location.name}</Popup></Marker>
            </MapContainer>
            <div className="coordinates">{location.lat.toFixed(5)} · {location.lng.toFixed(5)}</div>
          </div>
          <div className="tracker-foot"><span>ZOOM, GESER, ATAU KLIK PETA UNTUK MEMILIH TITIK</span><span className="signal">● MAP ONLINE</span></div>
        </div>
        <div className="location-presets">{DKI_LOCATIONS.map(point=><button className={location.name === point.name ? 'active' : ''} onClick={()=>setLocation(point)} key={point.name}>{point.name.split(' — ')[0]}</button>)}</div>
        <div className="real-location"><div><span>LOKASI TERPILIH</span><h3>{location.name}</h3><p>{location.lat.toFixed(5)}, {location.lng.toFixed(5)} · Klik peta untuk memilih titik lain</p></div><a className="btn primary" href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`} target="_blank" rel="noreferrer">OPEN GOOGLE MAPS →</a></div>
      </section>

      <section className="gallery"><SectionTitle kicker="MEMORY ARCHIVE">Hero gallery</SectionTitle><p className="intro">Photo slots are ready for Arsha’s favorite moments.</p><div className="gallery-grid">{EVENT.gallery.map((src,i)=><button key={i} onClick={()=>setLightbox(i)} aria-label={`Enlarge photo placeholder ${i+1}`} className={`photo p${i+1}`}>{src ? <img src={src} alt={`Arsha memory ${i+1}`}/> : <><span>PHOTO {String(i+1).padStart(2,'0')}</span><b>ADD FAVORITE<br/>MEMORY</b></>}</button>)}</div></section>

      <section className="gift split"><div><SectionTitle kicker="A LITTLE SOMETHING">Digital gift</SectionTitle><p>Your presence is the greatest gift. If you’d still like to send a little surprise for Arsha, the editable details are below.</p><div className="account"><span>{EVENT.bank} · PLACEHOLDER</span><b>{EVENT.accountNumber}</b><p>{EVENT.accountHolder}</p><button onClick={()=>{navigator.clipboard.writeText(EVENT.accountNumber);setCopied(true);setTimeout(()=>setCopied(false),1800)}}>{copied ? 'COPIED!' : 'COPY ACCOUNT NUMBER'}</button></div></div><button className="qris" aria-label="QRIS placeholder, click to zoom" onClick={()=>setLightbox(99)}><span>QRIS</span><b>PAYMENT QR<br/>PLACEHOLDER</b><small>Real code not yet provided</small></button></section>

      <section id="rsvp" className="forms-section"><div><SectionTitle kicker="CONFIRM YOUR SQUAD">RSVP via WhatsApp</SectionTitle><p>Submitting opens WhatsApp with your details. No data is stored on this site.</p></div>
        <form onSubmit={submitRsvp}><label>Parent / guardian name<input required name="guardian" placeholder="Your name"/></label><label>Child's name<input required name="child" placeholder="Little hero's name"/></label><div className="field-row"><label>Attendance<select required name="attendance" defaultValue=""><option value="" disabled>Select one</option><option>Yes, we’ll be there!</option><option>Sorry, can’t make it</option></select></label><label>Number of guests<input required name="guests" type="number" min="1" max="10" defaultValue="1"/></label></div><label>Message (optional)<textarea name="message" placeholder="Leave a note for Arsha"/></label><button className="btn primary" type="submit">SEND RSVP ON WHATSAPP →</button></form>
      </section>

      <section className="wishes"><SectionTitle kicker="DEMO GUESTBOOK">Send birthday wishes</SectionTitle><p className="intro">Messages appear only on this device and are not sent to the host.</p><form onSubmit={submitWish}><input name="name" required placeholder="Your name" aria-label="Your name"/><textarea required value={wish} onChange={e=>setWish(e.target.value)} placeholder="Write your birthday wish…" aria-label="Birthday wish"/><button className="btn ghost" type="submit">ADD DEMO WISH</button></form>{demoWishes.map((w,i)=><blockquote key={i}><p>“{w.text}”</p><cite>— {w.name}</cite></blockquote>)}</section>

      <section className="closing"><div className="closing-web"/><PixelHero small/><p>MISSION BRIEFING COMPLETE</p><h2>SEE YOU AT<br/>THE PARTY!</h2><strong>{EVENT.child.toUpperCase()} · LEVEL {EVENT.age}</strong><a className="btn primary" href="#top">BACK TO THE TOP ↑</a></section>
      {lightbox !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Image preview" onClick={()=>setLightbox(null)}><button aria-label="Close">×</button><div>{lightbox === 99 ? <><b>QRIS PLACEHOLDER</b><p>A real payment image has not been provided.</p></> : <><b>PHOTO {String(lightbox+1).padStart(2,'0')}</b><p>Replace this slot in the EVENT gallery configuration.</p></>}</div></div>}
    </main>
  )
}

export default App
