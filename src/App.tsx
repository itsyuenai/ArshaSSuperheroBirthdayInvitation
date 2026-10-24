import { FormEvent, useEffect, useMemo, useState } from 'react'
import { divIcon } from 'leaflet'
import { supabase } from './lib/supabase'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const EVENT = {
  child: 'Arsha',
  age: 3,
  date: '2026-12-12T15:00:00+07:00',
  endTime: '18:00',
  venue: 'LOKASI PESTA · BOGOR',
  address: 'Alamat lengkap akan ditambahkan di sini',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=-6.5971%2C106.8060',
  whatsapp: '6280000000000',
  bank: 'NAMA BANK',
  accountHolder: 'NAMA PEMILIK REKENING',
  accountNumber: '0000 0000 0000',
  qrisImage: '',
  schedule: [
    ['15:00', 'Kedatangan tamu'],
    ['15:30', 'Permainan & misi'],
    ['16:30', 'Tiup lilin & potong kue'],
    ['17:00', 'Makan & minum bersama'],
    ['17:45', 'Foto bersama & penutup'],
  ],
  gallery: [
    'https://images.pexels.com/photos/27175743/pexels-photo-27175743.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'https://images.pexels.com/photos/8104206/pexels-photo-8104206.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'https://images.pexels.com/photos/19117843/pexels-photo-19117843.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'https://images.pexels.com/photos/8104212/pexels-photo-8104212.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'https://images.pexels.com/photos/6651864/pexels-photo-6651864.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'https://images.pexels.com/photos/27175741/pexels-photo-27175741.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  ],
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

type PartyLocation = { name: string; lat: number; lng: number }
const PARTY_LOCATION: PartyLocation = {
  name: 'Lokasi pesta Arsha · Bogor',
  lat: -6.5971,
  lng: 106.8060,
}
const heroMarker = divIcon({ className: 'hero-map-marker', html: '<span></span>', iconSize: [34, 34], iconAnchor: [17, 17] })

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
  const [wishes, setWishes] = useState<{ id: string; guest_name: string; message: string }[]>([])
  const [wishError, setWishError] = useState('')
  const [wishLoading, setWishLoading] = useState(true)


  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const loadWishes = async () => {
      const { data, error } = await supabase
        .from('birthday_wishes')
        .select('id, guest_name, message')
        .order('created_at', { ascending: false })
        .limit(12)

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

  const openInvite = () => {
    setOpened(true)
    window.setTimeout(() => document.querySelector('#greeting')?.scrollIntoView({ behavior: 'smooth' }), 550)
  }
  const submitRsvp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const text = `RSVP ulang tahun Arsha\nNama orang tua: ${data.get('guardian')}\nNama anak: ${data.get('child')}\nKehadiran: ${data.get('attendance')}\nJumlah tamu: ${data.get('guests')}\nPesan: ${data.get('message') || '-'}`
    window.open(`https://wa.me/${EVENT.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
  }
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

    setWishes((current) => [savedWish, ...current].slice(0, 12))
    setWish('')
    form.reset()
  }

  return (
    <main className={opened ? 'opened' : ''}>
      <nav aria-label="Navigasi utama"><a href="#top" className="brand">AR<span>3</span>HA</a><div><a href="#details">DETAIL</a><a href="#tracker">PELACAK</a><a href="#rsvp">KONFIRMASI</a></div></nav>
      <section className="hero" id="top">
        <div className="web web-a"/><div className="web web-b"/><div className="moon"/>
        <div className="skyline" aria-hidden="true">{Array.from({length: 18}).map((_,i)=><i key={i}/>)}</div>
        <div className="swinger realistic"><span className="rope"/><PixelHero /></div>
        {opened && <div className="confetti" aria-hidden="true">{Array.from({length:24}).map((_,i)=><i key={i}/>)}</div>}
        <div className="hero-copy">
          <p className="eyebrow">PESAN RAHASIA DARI SANG PAHLAWAN</p>
          <h1><span>SELAMAT</span><strong>ULANG TAHUN!</strong></h1>
          <div className="turning">{EVENT.child.toUpperCase()} BERUSIA <b>{EVENT.age}</b> TAHUN</div>
          <p className="date">{dateText} · 15.00 WIB</p>
          <div className="actions"><button className="btn primary" onClick={openInvite}>BUKA UNDANGAN <span>→</span></button><a className="btn ghost" href="#rsvp">KONFIRMASI HADIR</a></div>
        </div>
        <div className="scroll-note">GULIR UNTUK MASUK <span>↓</span></div>
      </section>

      <section className="greeting split" id="greeting">
        <div><SectionTitle kicker="MISI BARU DIMULAI">Panggilan untuk para pahlawan kecil!</SectionTitle><p>Pahlawan kecil kita naik level. Mari bergabung dalam sore penuh permainan, kue, dan keseruan saat Arsha merayakan ulang tahunnya yang ketiga.</p><a href="#details" className="text-link">LIHAT DETAIL PESTA →</a></div>
        <div className="comic-burst"><b>3!</b><span>TAHUN<br/>LUAR BIASA</span></div>
      </section>

      <section className="star-section">
        <div className="star-card"><div className="halftone"/><PixelHero /><div><span>PEMAIN SATU</span><h2>KENALAN<br/>DENGAN ARSHA</h2><p>Berani, ingin tahu, dan selalu siap untuk petualangan berikutnya.</p><div className="stats"><b>TINGKAT {EVENT.age}</b><b>KEKUATAN: ∞</b></div></div></div>
      </section>

      <section id="details" className="details">
        <SectionTitle kicker="INFO RAHASIA PESTA">Detail pesta</SectionTitle>
        <div className="detail-grid">
          <article><span>01 / TANGGAL</span><h3>{dateText}</h3><p>Simpan tanggalnya, pahlawan.</p></article>
          <article><span>02 / WAKTU</span><h3>15.00—{EVENT.endTime}</h3><p>Waktu setempat.</p></article>
          <article><span>03 / LOKASI</span><h3>{EVENT.venue}</h3><p>{EVENT.address}</p></article>
        </div>
        <a className="btn primary" href={EVENT.mapsUrl} target="_blank" rel="noreferrer">BUKA PETUNJUK ARAH →</a>
      </section>

      <section className="count-section"><SectionTitle kicker="WAKTU MENUJU PESTA">Hitung mundur dimulai</SectionTitle>
        <div className="countdown">{delta === 0 ? <div className="live">PESTA SUDAH DIMULAI!</div> : countdown.map(([label,value])=><div key={label}><b>{String(value).padStart(2,'0')}</b><span>{label}</span></div>)}</div>
      </section>

      <section className="theme split"><div className="theme-art"><div className="mask-eyes"><i/><i/></div><span>PAHLAWAN<br/>JARINGAN</span></div><div><SectionTitle kicker="SIAPKAN KOSTUM">Tema pesta</SectionTitle><p>Gunakan kostum pahlawan favoritmu, karakter komik, atau pakaian merah dan biru. Kostum tidak wajib, tetapi sangat seru.</p><div className="dress-code"><b>PAKAIAN</b><span>MERAH / BIRU / SIAP BERAKSI</span></div></div></section>

      <section className="schedule"><SectionTitle kicker="URUTAN MISI">Jadwal pesta</SectionTitle><div className="timeline">{EVENT.schedule.map(([time,title],i)=><div key={time}><b>{time}</b><i>{String(i+1).padStart(2,'0')}</i><h3>{title}</h3></div>)}</div></section>

      <section id="tracker" className="tracker-section"><SectionTitle kicker="SINYAL DITEMUKAN">Pelacak pesta</SectionTitle>
        <div className="tracker live-map">
          <div className="tracker-head"><span>PELACAK SPIDER / JARINGAN BOGOR</span><b>SINYAL ULANG TAHUN AKTIF</b></div>
          <div className="map">
            <MapContainer center={[PARTY_LOCATION.lat, PARTY_LOCATION.lng]} zoom={13} scrollWheelZoom className="leaflet-map">
              <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
              <Marker position={[PARTY_LOCATION.lat, PARTY_LOCATION.lng]} icon={heroMarker}><Popup>{PARTY_LOCATION.name}</Popup></Marker>
            </MapContainer>
            <div className="coordinates">{PARTY_LOCATION.lat.toFixed(5)} · {PARTY_LOCATION.lng.toFixed(5)}</div>
          </div>
          <div className="tracker-foot"><span>PETA LANGSUNG · TITIK MENUNJUKKAN LOKASI PESTA</span><span className="signal">● PETA AKTIF</span></div>
        </div>
        <div className="real-location"><div><span>KOORDINAT PESTA</span><h3>{PARTY_LOCATION.name}</h3><p>{EVENT.address} · {PARTY_LOCATION.lat.toFixed(5)}, {PARTY_LOCATION.lng.toFixed(5)}</p></div><a className="btn primary" href={EVENT.mapsUrl} target="_blank" rel="noreferrer">BUKA GOOGLE MAPS →</a></div>
      </section>

      <section className="gallery"><SectionTitle kicker="ARSIP KENANGAN">Galeri Arsha</SectionTitle><p className="intro">Tempat untuk foto-foto favorit Arsha.</p><div className="gallery-grid">{EVENT.gallery.map((src,i)=><button key={i} onClick={()=>setLightbox(i)} aria-label={`Perbesar foto ${i+1}`} className={`photo p${i+1}`}>{src ? <img src={src} alt={`Kenangan Arsha ${i+1}`}/> : <><span>FOTO {String(i+1).padStart(2,'0')}</span><b>TAMBAHKAN<br/>KENANGAN</b></>}</button>)}</div></section>

      <section className="gift split"><div><SectionTitle kicker="TANDA KASIH">Hadiah digital</SectionTitle><p>Kehadiranmu adalah hadiah terbaik. Jika ingin mengirim tanda kasih untuk Arsha, detailnya tersedia di bawah ini.</p><div className="account"><span>{EVENT.bank} · CONTOH</span><b>{EVENT.accountNumber}</b><p>{EVENT.accountHolder}</p><button onClick={()=>{navigator.clipboard.writeText(EVENT.accountNumber);setCopied(true);setTimeout(()=>setCopied(false),1800)}}>{copied ? 'TERSALIN!' : 'SALIN NOMOR REKENING'}</button></div></div><button className="qris" aria-label="QRIS contoh, klik untuk memperbesar" onClick={()=>setLightbox(99)}><span>QRIS</span><b>QR PEMBAYARAN<br/>CONTOH</b><small>Kode asli belum tersedia</small></button></section>

      <section id="rsvp" className="forms-section"><div><SectionTitle kicker="KONFIRMASI KEHADIRAN">Konfirmasi lewat WhatsApp</SectionTitle><p>Setelah dikirim, WhatsApp akan terbuka dengan data konfirmasi. Data tidak disimpan di halaman ini.</p></div>
        <form onSubmit={submitRsvp}><label>Nama orang tua / wali<input required name="guardian" placeholder="Nama kamu"/></label><label>Nama anak<input required name="child" placeholder="Nama pahlawan kecil"/></label><div className="field-row"><label>Kehadiran<select required name="attendance" defaultValue=""><option value="" disabled>Pilih jawaban</option><option>Ya, kami akan hadir!</option><option>Maaf, kami tidak bisa hadir</option></select></label><label>Jumlah tamu<input required name="guests" type="number" min="1" max="10" defaultValue="1"/></label></div><label>Pesan (opsional)<textarea name="message" placeholder="Tulis pesan untuk Arsha"/></label><button className="btn primary" type="submit">KIRIM KONFIRMASI VIA WHATSAPP →</button></form>
      </section>

      <section className="wishes"><SectionTitle kicker="BUKU UCAPAN BERSAMA">Kirim ucapan ulang tahun</SectionTitle><p className="intro">Tulis pesan untuk Arsha. Ucapanmu akan terlihat oleh tamu lainnya.</p><form onSubmit={submitWish}><input name="name" required maxLength={80} placeholder="Nama kamu" aria-label="Nama kamu"/><textarea required maxLength={500} value={wish} onChange={e=>setWish(e.target.value)} placeholder="Tulis ucapan untuk Arsha…" aria-label="Ucapan ulang tahun"/><button className="btn ghost" type="submit">KIRIM UCAPAN →</button></form>{wishError && <p className="form-error" role="alert">{wishError}</p>}{wishLoading ? <p className="loading-note">MEMUAT UCAPAN...</p> : wishes.map((item)=><blockquote key={item.id}><p>“{item.message}”</p><cite>— {item.guest_name}</cite></blockquote>)}</section>

      <section className="closing"><div className="closing-web"/><PixelHero small/><p>MISI SELESAI</p><h2>SAMPAI JUMPA<br/>DI PESTA!</h2><strong>{EVENT.child.toUpperCase()} · TINGKAT {EVENT.age}</strong><a className="btn primary" href="#top">KEMBALI KE ATAS ↑</a></section>
      {lightbox !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Pratinjau gambar" onClick={()=>setLightbox(null)}><button aria-label="Tutup">×</button><div onClick={e=>e.stopPropagation()}>{lightbox === 99 ? <><b>QRIS CONTOH</b><p>Gambar QRIS asli belum tersedia.</p></> : <img src={EVENT.gallery[lightbox]} alt={`Kenangan Arsha ${lightbox + 1} diperbesar`} />}</div></div>}
    </main>
  )
}

export default App
