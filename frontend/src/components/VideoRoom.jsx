import { useAuth } from '../context/AuthContext';

/**
 * Videochiamata tramite Jitsi Meet (gratuita, senza chiavi API).
 * Capitolo 4.1 BP: "Comunicazione in tempo reale" (WebRTC / videoconferenza).
 * Base URL configurabile: per migrare a JaaS o a un'istanza self-hosted
 * (con DPA e infrastruttura dedicata) basta cambiare VITE_JITSI_BASE_URL.
 * E2EE attivo: crittografia end-to-end tra i partecipanti alla seduta.
 */
const JITSI_BASE = (import.meta.env.VITE_JITSI_BASE_URL || 'https://meet.jit.si').replace(/\/$/, '');

export default function VideoRoom({ roomName, onClose }) {
  const { user } = useAuth();
  const displayName = user?.name || 'Utente';
  const url = `${JITSI_BASE}/${roomName}#userInfo.displayName=${encodeURIComponent(displayName)}&config.prejoinPageEnabled=false&config.e2ee.enabled=true`;

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
          La videochiamata è protetta con crittografia end-to-end (WebRTC/Jitsi). Consenti l’accesso a microfono e fotocamera quando richiesto.
        </p>
      </div>
    </div>
  );
}
