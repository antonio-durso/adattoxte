import { useAuth } from '../context/AuthContext';

/**
 * Videochiamata tramite Jitsi Meet (gratuita, senza chiavi API).
 * Capitolo 4.1 BP: "Comunicazione in tempo reale" (WebRTC / videoconferenza).
 */
export default function VideoRoom({ roomName, onClose }) {
  const { user } = useAuth();
  const displayName = user?.name || 'Utente';
  const url = `https://meet.jit.si/${roomName}#userInfo.displayName=${encodeURIComponent(displayName)}&config.prejoinPageEnabled=false`;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal video-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <strong>Sala: {roomName}</strong>
          <button className="btn btn-outline btn-sm" onClick={onClose}>Chiudi</button>
        </div>
        <iframe
          src={url}
          title="Videochiamata Adatto x Te"
          allow="camera; microphone; fullscreen; display-capture; autoplay"
          className="video-frame"
        />
        <p className="muted small">
          La videochiamata è protetta e crittografata (WebRTC/Jitsi). Consenti l’accesso a microfono e fotocamera quando richiesto.
        </p>
      </div>
    </div>
  );
}
