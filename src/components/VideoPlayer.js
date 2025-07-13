// /src/components/VideoPlayer.js

export default function VideoPlayer({ src, title }) {
  return (
    <div style={{ 
      position: 'relative', 
      paddingBottom: '56.25%', // 16:9 aspect ratio
      height: 0, 
      overflow: 'hidden',
      borderRadius: '8px', // Optional: adds rounded corners
      marginBottom: '0.5rem' // Optional: space below the player
    }}>
      <iframe 
        src={src} 
        title={title || 'Embedded Video'}
        frameBorder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%' 
        }}>
      </iframe>
    </div>
  );
}
