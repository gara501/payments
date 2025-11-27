import React, { useState, useEffect } from 'react';

interface ImageTestProps {
  imageUrl: string;
  name: string;
}

export const ImageTest: React.FC<ImageTestProps> = ({ imageUrl, name }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.onload = () => {
      console.log(`✅ Image loaded successfully: ${imageUrl}`);
      setImageLoaded(true);
      setImageError(false);
    };
    img.onerror = () => {
      console.error(`❌ Image failed to load: ${imageUrl}`);
      setImageLoaded(false);
      setImageError(true);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  return (
    <div className="p-4 border rounded-lg mb-4">
      <h3 className="font-bold mb-2">{name}</h3>
      <div className="mb-2">
        <strong>URL:</strong> <span className="text-sm break-all">{imageUrl}</span>
      </div>
      <div className="mb-2">
        <strong>Status:</strong> 
        {imageLoaded && <span className="text-green-600 ml-2">✅ Loaded</span>}
        {imageError && <span className="text-red-600 ml-2">❌ Failed</span>}
        {!imageLoaded && !imageError && <span className="text-yellow-600 ml-2">⏳ Loading...</span>}
      </div>
      
      {/* Test with img tag */}
      <div className="mb-4">
        <strong>IMG tag test:</strong>
        <img 
          src={imageUrl} 
          alt="Test" 
          className="w-20 h-20 object-cover border rounded mt-2"
          onLoad={() => console.log('IMG tag loaded')}
          onError={() => console.log('IMG tag failed')}
        />
      </div>
      
      {/* Test with background image */}
      <div className="mb-4">
        <strong>Background image test:</strong>
        <div 
          className="w-20 h-20 border rounded mt-2 bg-gradient-to-br from-blue-500 to-purple-500"
          style={{
            backgroundImage: `url("${imageUrl}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
      </div>
    </div>
  );
};