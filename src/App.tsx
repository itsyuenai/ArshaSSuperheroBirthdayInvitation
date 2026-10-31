import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { divIcon } from 'leaflet'
import { supabase } from './lib/supabase'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const EVENT = {
  child: 'Arsha',
  age: 3,
  date: '2026-11-14T15:00:00+07:00',
  endTime: 'Selesai',
  venue: 'LOKASI PERTEMUAN · BOGOR',
  address: 'Perumahan Rasamala Blok i9, Cimanggis, Kecamatan Bojonggede, Kabupaten Bogor 16310',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=-6.514710%2C106.765333',
  gallery: [
    'gallery/foto1.jpeg',
    'gallery/foto2.jpeg',
    'gallery/foto3.jpeg',
    'gallery/foto4.jpeg',
    'gallery/foto5.jpeg',
    'gallery/foto6.jpeg',
  ],
}

const PIXEL_ART = [
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0], [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0], [0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0],
  [0, 1, 2, 2, 1, 1, 1, 2, 2, 1, 1, 1, 2, 2, 1, 0], [0, 1, 4, 4, 4, 4, 1, 2, 2, 1, 4, 4, 4, 4, 1, 0], [1, 4, 4, 4, 4, 4, 1, 2, 2, 1, 4, 4, 4, 4, 4, 1], [1, 4, 4, 4, 4, 4, 1, 2, 2, 1, 4, 4, 4, 4, 4, 1],
  [0, 1, 4, 4, 4, 4, 1, 2, 2, 1, 4, 4, 4, 4, 1, 0], [0, 1, 4, 4, 4, 1, 1, 2, 2, 1, 1, 4, 4, 4, 1, 0], [0, 0, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 0, 0], [0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0],
  [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0], [0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 1, 1, 0, 0, 0, 0], [0, 1, 1, 1, 1, 3, 2, 1, 1, 2, 3, 1, 1, 1, 1, 0], [1, 2, 2, 1, 3, 3, 2, 1, 1, 2, 3, 3, 1, 2, 2, 1],
  [1, 2, 2, 1, 3, 3, 2, 1, 1, 2, 3, 3, 1, 2, 2, 1], [0, 1, 1, 1, 3, 3, 2, 2, 2, 2, 3, 3, 1, 1, 1, 0], [0, 0, 0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 1, 0, 0, 0], [0, 0, 0, 1, 3, 3, 3, 1, 1, 3, 3, 3, 1, 0, 0, 0],
  [0, 0, 0, 1, 3, 3, 1, 0, 0, 1, 3, 3, 1, 0, 0, 0], [0, 0, 1, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 1, 0, 0], [0, 1, 2, 2, 2, 2, 1, 0, 0, 1, 2, 2, 2, 2, 1, 0], [0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0],
] as const

const PIXEL_COLORS = { 1: '#000000', 2: '#d82828', 3: '#2563eb', 4: '#ffffff' } as const

function PixelHero({ small = false }: { small?: boolean }) {
  return (
    <div className={`pixel-hero ${small ? 'small' : ''}`} role="img" aria-label="Pahlawan laba-laba pixel-art">
      <div className="pixel-grid">
        {PIXEL_ART.flatMap((row, rowIndex) => row.map((value, columnIndex) => <i key={`${rowIndex}-${columnIndex}`} style={{ backgroundColor: value === 0 ? 'transparent' : PIXEL_COLORS[value] }} />))}
      </div>
    </div>
  )
}

type PartyLocation = { name: string; lat: number; lng: number }
const PARTY_LOCATION: PartyLocation = {
  name: 'Lokasi pertemuan Arsha · Bogor',
  lat: -6.514710,
  lng: 106.765333,
}
const heroMarker = divIcon({ className: 'hero-map-marker', html: '<span></span>', iconSize: [34, 34], iconAnchor: [17, 17] })

function SectionTitle({ kicker, children }: { kicker: string; children: React.ReactNode }) {
  return <div className="section-title"><span>{kicker}</span><h2>{children}</h2></div>
}

function App() {
  const target = useMemo(() => new Date(EVENT.date).getTime(), [])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const hasStartedAudioRef = useRef(false)
  const [now, setNow] = useState(Date.now())
  const [opened, setOpened] = useState(false)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [wish, setWish] = useState('')
  const [wishTab, setWishTab] = useState<'kirim' | 'baca'>('kirim')
  const [wishes, setWishes] = useState<{ id: string; guest_name: string; message: string }[]>([])
  const [wishError, setWishError] = useState('')
  const [wishLoading, setWishLoading] = useState(true)


  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    return () => audioRef.current?.pause()
  }, [])

  useEffect(() => {
    const loadWishes = async () => {
      const { data, error } = await supabase
        .from('birthday_wishes')
        .select('id, guest_name, message')
        .order('created_at', { ascending: false })

      if (error) setWishError('Pesan belum bisa dimuat. Coba lagi sebentar lagi.')
      else setWishes(data ?? [])
      setWishLoading(false)
    }

    void loadWishes()
  }, [])
  const delta = Math.max(0, target - now)
  const countdown = [
    ['HARI', Math.floor(delta / 86400000)],
    ['JAM', Math.floor(delta / 3600000) % 24],
    ['MENIT', Math.floor(delta / 60000) % 60],
    ['DETIK', Math.floor(delta / 1000) % 60],
  ]
  const dateText = new Intl.DateTimeFormat('id-ID', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(EVENT.date))
  const submitWish = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const guestName = String(data.get('name') ?? '').trim()
    const message = wish.trim()
    setWishError('')

    const { data: savedWish, error } = await supabase
      .from('birthday_wishes')
      .insert({ guest_name: guestName, message })
      .select('id, guest_name, message')
      .maybeSingle()

    if (error || !savedWish) {
      setWishError('Pesan belum terkirim. Periksa koneksi lalu coba lagi.')
      return
    }

    setWishes((current) => [savedWish, ...current])
    setWishTab('kirim')
    setWish('')
    form.reset()
  }

  const getAudio = () => {
    if (!audioRef.current) {
      const audio = new Audio('/musik.mp3')
      audio.autoplay = true
      audio.loop = true
      audio.addEventListener('playing', () => { hasStartedAudioRef.current = true })
      audio.addEventListener('error', () => console.error('Gagal memuat musik undangan.'))
      audioRef.current = audio
    }

    return audioRef.current
  }

  const playMusic = () => {
    void getAudio().play().catch((error: unknown) => {
      console.error('Browser tidak dapat memutar musik undangan.', error)
    })
  }

  useEffect(() => {
    playMusic()
  }, [])

  useEffect(() => {
    const startMusicOnInteraction = () => {
      if (!hasStartedAudioRef.current) playMusic()
    }

    window.addEventListener('pointerdown', startMusicOnInteraction)
    window.addEventListener('wheel', startMusicOnInteraction, { passive: true })

    return () => {
      window.removeEventListener('pointerdown', startMusicOnInteraction)
      window.removeEventListener('wheel', startMusicOnInteraction)
    }
  }, [])

  const openInvite = () => {
    setOpened(true)
    window.setTimeout(() => document.querySelector('#greeting')?.scrollIntoView({ behavior: 'smooth' }), 550)
  }

  return (
    <div className="app-container">
      <style>{`
       @media (max-width: 768px) {
          .moon { display: none !important; }
          .hero-copy h1 {
            font-size: 80px !important;
            line-height: 0.8 !important;
          }
          .hero-copy .date { 
            font-size: 12px !important; 
            margin-top: 15px !important; 
          }
            .theme-art span {
            font-size: 60px !important; 
            line-height: 1.1 !important;
        }
          .detail-grid h3 { 
            font-size: 12px !important; 
          }
        }
      `}</style>

      <main className={opened ? 'opened' : ''}>
        <nav aria-label="Navigasi utama"><a href="#top" className="brand">AR<span>3</span>HA</a><div><a href="#details">DETAIL</a><a href="#tracker">PELACAK</a></div></nav>
        <section className="hero" id="top">
          <div className="web web-a" /><div className="web web-b" /><div className="moon" />
          <div className="skyline" aria-hidden="true">{Array.from({ length: 18 }).map((_, i) => <i key={i} />)}</div>
          <div className="swinger realistic"><span className="rope" /><PixelHero /></div>
          {opened && <div className="confetti" aria-hidden="true">{Array.from({ length: 24 }).map((_, i) => <i key={i} />)}</div>}

          <div className="hero-copy" style={{ marginTop: '90px' }}>
            <p className="eyebrow">PESAN RAHASIA DARI SANG PAHLAWAN</p>
            <h1><span>HAPPY</span><strong>BIRTHDAY!</strong></h1>
            <div className="turning">{EVENT.child.toUpperCase()} IS TURNING <b>{EVENT.age}</b></div>
            <p className="date">{dateText} · 13.00 WIB</p>

            {/* Penyesuaian Flexbox agar tombol sejajar atas-bawah dan penuh di HP */}
            <div className="actions" style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', width: '100%', padding: '0 20px' }}>
              <button className="btn primary" style={{ width: '100%', maxWidth: '300px' }} onClick={openInvite}>BUKA UNDANGAN <span className="invite-arrow">→</span></button>
            </div>

          </div>
          <div className="scroll-note">GULIR UNTUK MASUK <span>↓</span></div>
        </section>

        <section className="greeting split" id="greeting">
          <div><SectionTitle kicker="MISI BARU DIMULAI">Panggilan untuk para pahlawan kecil!</SectionTitle><p>Pahlawan kecil kita naik level. Mari bergabung dalam sore penuh permainan, kue, dan keseruan saat Arsha merayakan ulang tahunnya yang ketiga.</p><a href="#details" className="text-link">LIHAT DETAIL MISI →</a></div>
          <div className="comic-burst"><b>3!</b><span>TAHUN<br />LUAR BIASA</span></div>
        </section>

        <section className="star-section">
          <div className="star-card"><div className="halftone" /><PixelHero /><div><span>PEMAIN SATU</span><h2>KENALAN<br />DENGAN ARSHA</h2><p>Berani, ingin tahu, dan selalu siap untuk petualangan berikutnya.</p><div className="stats"><b>TINGKAT {EVENT.age}</b><b>KEKUATAN: <span className="infinity-stat">∞</span></b></div></div></div>
        </section>

        <section id="details" className="details">
          <SectionTitle kicker="INFO RAHASIA SANG PAHLAWAN">Detail Misi</SectionTitle>
          <div className="detail-grid">
            <article><span>01 / TANGGAL</span><h3>{dateText}</h3><p>Simpan tanggalnya, pahlawan.</p></article>
            <article><span>02 / WAKTU</span><h3>13.00—{EVENT.endTime}</h3><p>Waktu setempat.</p></article>
            <article><span>03 / LOKASI</span><h3>{EVENT.venue}</h3><p>{EVENT.address}</p></article>
          </div>
          <a className="btn primary" href={EVENT.mapsUrl} target="_blank" rel="noreferrer">BUKA PETUNJUK ARAH →</a>
        </section>

        <section className="count-section"><SectionTitle kicker="WAKTU MENUJU MISI">Hitung mundur dimulai</SectionTitle>
          <div className="countdown">{delta === 0 ? <div className="live">MISI SUDAH DIMULAI!</div> : countdown.map(([label, value]) => <div key={label}><b>{String(value).padStart(2, '0')}</b><span>{label}</span></div>)}</div>
        </section>

        <section className="theme split"><div className="theme-art"><div className="mask-eyes"><i /><i /></div><span>{EVENT.child.toUpperCase()}<br />SPIDERMAN</span></div><div><SectionTitle kicker="SIAPKAN KOSTUM">Tema acara</SectionTitle><p>Gunakan kostum favoritmu atau pakaian merah dan biru (pakai pakaian yang nyaman). Kostum tidak wajib, tetapi sangat seru.</p><div className="dress-code"><b>PAKAIAN</b><span>MERAH / BIRU / SIAP BERAKSI</span></div></div></section>

        <section id="tracker" className="tracker-section"><SectionTitle kicker="SINYAL DITEMUKAN">Pelacak misi</SectionTitle>
          <div className="tracker live-map">
            <div className="tracker-head"><span>PELACAK SPIDER / JARINGAN BOGOR</span><b>SINYAL ULANG TAHUN AKTIF</b></div>
            <div className="map">
              <MapContainer center={[PARTY_LOCATION.lat, PARTY_LOCATION.lng]} zoom={13} scrollWheelZoom className="leaflet-map">
                <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[PARTY_LOCATION.lat, PARTY_LOCATION.lng]} icon={heroMarker}><Popup>{PARTY_LOCATION.name}</Popup></Marker>
              </MapContainer>
              <div className="coordinates">{PARTY_LOCATION.lat.toFixed(5)} · {PARTY_LOCATION.lng.toFixed(5)}</div>
            </div>
            <div className="tracker-foot"><span>PETA LANGSUNG · TITIK MENUNJUKKAN LOKASI PERTEMUAN</span><span className="signal">● PETA AKTIF</span></div>
          </div>
          <div className="real-location"><div><span>KOORDINAT MISI</span><h3>{PARTY_LOCATION.name}</h3><p>{EVENT.address} · {PARTY_LOCATION.lat.toFixed(5)}, {PARTY_LOCATION.lng.toFixed(5)}</p></div><a className="btn primary" href={EVENT.mapsUrl} target="_blank" rel="noreferrer">BUKA GOOGLE MAPS →</a></div>
        </section>

        <section className="gallery"><SectionTitle kicker="ARSIP KENANGAN">Galeri Arsha</SectionTitle><p className="intro">Tempat untuk foto-foto favorit Arsha.</p><div className="gallery-grid">{EVENT.gallery.map((src, i) => <button key={i} onClick={() => setLightbox(i)} aria-label={`Perbesar foto ${i + 1}`} className={`photo p${i + 1}`}>{src ? <img src={src} alt={`Kenangan Arsha ${i + 1}`} /> : <><span>FOTO {String(i + 1).padStart(2, '0')}</span><b>TAMBAHKAN<br />KENANGAN</b></>}</button>)}</div></section>

        <section className="wishes"><SectionTitle kicker="BUKU UCAPAN BERSAMA">Kirim ucapan ulang tahun</SectionTitle><p className="intro">Ucapan yang dikirim langsung tersimpan dan bisa dibaca kembali oleh semua tamu.</p><div className="wish-tabs" role="tablist" aria-label="Menu buku ucapan"><button className={wishTab === 'kirim' ? 'active' : ''} role="tab" aria-selected={wishTab === 'kirim'} onClick={() => setWishTab('kirim')}>KIRIM UCAPAN</button><button className={wishTab === 'baca' ? 'active' : ''} role="tab" aria-selected={wishTab === 'baca'} onClick={() => setWishTab('baca')}>BACA SEMUA UCAPAN ({wishes.length})</button></div>{wishTab === 'kirim' ? <><form onSubmit={submitWish}><input name="name" required maxLength={80} placeholder="Nama kamu" aria-label="Nama kamu" /><textarea required maxLength={500} value={wish} onChange={e => setWish(e.target.value)} placeholder="Tulis ucapan untuk Arsha…" aria-label="Ucapan ulang tahun" /><button className="btn ghost" type="submit">KIRIM UCAPAN →</button></form>{wishError && <p className="form-error" role="alert">{wishError}</p>}<div className="wish-list recent-wishes"><h3>UCAPAN TERBARU</h3>{wishLoading ? <p className="loading-note">MEMUAT UCAPAN...</p> : wishes.slice(0, 5).map((item) => <blockquote key={item.id}><p>“{item.message}”</p><cite>— {item.guest_name}</cite></blockquote>)}</div></> : <div className="wish-list all-wishes"><h3>SEMUA UCAPAN UNTUK ARSHA</h3>{wishLoading ? <p className="loading-note">MEMUAT UCAPAN...</p> : wishes.length === 0 ? <p>Belum ada ucapan. Jadilah yang pertama.</p> : wishes.map((item) => <blockquote key={item.id}><p>“{item.message}”</p><cite>— {item.guest_name}</cite></blockquote>)}</div>}</section>

        <section className="closing"><div className="closing-web" /><PixelHero small /><p style={{ marginTop: '15px' }}>MISI SELESAI</p><h2>SAMPAI JUMPA<br />DI PERTEMUAN MISI!</h2><strong>{EVENT.child.toUpperCase()} · TINGKAT {EVENT.age}</strong><a className="btn primary" href="#top">KEMBALI KE ATAS ↑</a></section>

        {/* Tambahkan bagian footer ini */}
        <footer style={{
          textAlign: 'center',
          padding: '30px 20px',
          marginTop: '20px',
          borderTop: '2px dashed #ff2e4c',
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '10px',
          color: '#888',
          lineHeight: '1.8'
        }}>
          SYSTEM ENGINEERED BY <br />
          <span style={{ color: '#00ffff' }}>itsyuenai</span>
        </footer>
        {/* Akhir bagian footer */}

        {lightbox !== null && (
          <div className="lightbox" role="dialog" aria-modal="true" aria-label="Pratinjau gambar" onClick={() => setLightbox(null)}><button aria-label="Tutup">×</button><div onClick={e => e.stopPropagation()}>
            <img src={EVENT.gallery[lightbox]} alt={`Kenangan Arsha ${lightbox + 1} diperbesar`} />
          </div>
          </div>
        )}
      </main>
    </div>
  )
}


export default App
