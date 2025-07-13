// /src/components/PdfViewer.js

export default function PdfViewer({ src, title }) {
  return (
    <div style={{ 
      position: 'relative', 
      paddingBottom: '100%', // Creates a 1:1 aspect ratio container
      height: 0, 
      overflow: 'hidden',
      border: '1px solid #e2e8f0', // A light border to frame the PDF
      borderRadius: '8px',
      marginBottom: '1rem'
    }}>
      <iframe 
        src={src} 
        title={title || 'Embedded PDF Document'}
        frameBorder="0" 
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
