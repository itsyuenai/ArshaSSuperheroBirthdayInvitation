import { useState } from 'react'
import ReactPlayer from 'react-player'

type MusicPlayerProps = {
  isPlaying: boolean
  onToggle: () => void
  onPlaybackError: () => void
}

export default function MusicPlayer({ isPlaying, onToggle, onPlaybackError }: MusicPlayerProps) {
  const [hasError, setHasError] = useState(false)

  const toggleMusic = () => {
    setHasError(false)
    onToggle()
  }

  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: 200,
          height: 200,
          overflow: 'hidden',
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        <ReactPlayer
          src="https://youtu.be/We1uYIQhk2A?si=zRXjIehHkshUvmaV"
          width="200px"
          height="200px"
          playing={isPlaying}
          loop
          playsInline
          volume={0.5}
          onError={() => {
            setHasError(true)
            onPlaybackError()
          }}
          onPlaying={() => setHasError(false)}
        />
      </div>

      <button
        type="button"
        onClick={toggleMusic}
        aria-label={hasError ? 'Musik tidak tersedia, coba putar lagi' : isPlaying ? 'Jeda musik' : 'Putar musik'}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          background: '#ff2e4c',
          color: '#fff',
          border: '3px solid #000',
          padding: '10px 15px',
          borderRadius: '50px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '4px 4px 0px #000',
          fontFamily: 'inherit',
        }}
      >
        {hasError ? '⚠ Musik tidak tersedia' : isPlaying ? '🔊 Pause' : '🔇 Play'}
      </button>
    </>
  )
}
