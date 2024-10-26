import React, { useEffect, useState } from 'react'; 
import PropTypes from 'prop-types';
import { Modal} from 'react-bootstrap';
import ColorPicker from './ColorPicker';
import './ImageModal.css';

const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;

  return (...args) => {
    if (!lastRan) {
      func(...args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if ((Date.now() - lastRan) >= limit) {
          func(...args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

const ImageModal = ({ show, handleClose, image, title, tags }) => {
  const [colors, setColors] = useState([]);
  const [currentColorIndex, setCurrentColorIndex] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [svgContent, setSvgContent] = useState(image);
  const [temporarySvgContent, setTemporarySvgContent] = useState(image);
  const [resolution, setResolution] = useState('original');
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });

  const extractColors = (svgString) => {
    const colorRegex = /#([0-9A-Fa-f]{3,6})\b/g;
    const foundColors = new Set(svgString.match(colorRegex));
    return Array.from(foundColors);
  };

  const updateColor = throttle((index, newColor) => {
    const updatedColors = [...colors];
    updatedColors[index] = newColor;
    setColors(updatedColors);

    const oldColor = colors[index];
    const updatedSvg = temporarySvgContent.replace(new RegExp(oldColor, 'g'), newColor);
    setTemporarySvgContent(updatedSvg);
  }, 50);

  const applyChangesToOriginal = () => {
    setSvgContent(temporarySvgContent);
  };

  const downloadSvg = () => {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const convertSvgToPng = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.onload = () => {
      let size;
      if (resolution === 'original') {
        const svgElement = new DOMParser().parseFromString(svgContent, "image/svg+xml").documentElement;
        size = {
          width: svgElement.getAttribute('width') ? parseInt(svgElement.getAttribute('width'), 10) : 500,
          height: svgElement.getAttribute('height') ? parseInt(svgElement.getAttribute('height'), 10) : 500,
        };
      } else {
        size = parseInt(resolution, 10);
      }
      canvas.width = size.width || size;
      canvas.height = size.height || size;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `${title}.png`;
      a.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(temporarySvgContent)}`;
  };

  const convertSvgToJpeg = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.onload = () => {
      let size;
      if (resolution === 'original') {
        const svgElement = new DOMParser().parseFromString(svgContent, "image/svg+xml").documentElement;
        size = {
          width: svgElement.getAttribute('width') ? parseInt(svgElement.getAttribute('width'), 10) : 500,
          height: svgElement.getAttribute('height') ? parseInt(svgElement.getAttribute('height'), 10) : 500,
        };
      } else {
        size = parseInt(resolution, 10);
      }
      canvas.width = size.width || size;
      canvas.height = size.height || size;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const jpegUrl = canvas.toDataURL('image/jpeg', 1.0);
      const a = document.createElement('a');
      a.href = jpegUrl;
      a.download = `${title}.jpeg`;
      a.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(temporarySvgContent)}`;
  };

  useEffect(() => {
    if (show) {
      const extractedColors = extractColors(image);
      setColors(extractedColors);
      setSvgContent(image);
      setTemporarySvgContent(image);
    }
  }, [show, image]);

  const handleColorChange = (newColor) => {
    if (currentColorIndex !== null) {
      updateColor(currentColorIndex, newColor.hex);
    }
  };

  const handleBgColorChange = (newColor) => {
    setBackgroundColor(newColor.hex);
  };

  const handleResolutionChange = (resolution) => {
    setResolution(resolution);
  };
  
  const handleColorCircleClick = (index, event) => {
    setCurrentColorIndex(index);
    const rect = event.target.getBoundingClientRect();
    setPickerPosition({ top: rect.bottom + window.scrollY + 10, left: rect.left + window.scrollX });
    setShowColorPicker(true);
  };

  const handleBgColorClick = (event) => {
    const rect = event.target.getBoundingClientRect();
    setPickerPosition({
      top: rect.bottom + window.scrollY + 10,
      left: rect.left + window.scrollX,
    });
    setShowBgColorPicker(true);
  };

  const renderTags = () => {
    if (!tags || !Array.isArray(tags)) return null; // Return null if no tags or not an array
    return tags.map((tag, index) => (
      <span key={index} className="tag">
        {tag.trim()} {/* Trim whitespace around each tag */}
      </span>
    ));
};

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="image-modal-container">
          <div className="image-preview-container" style={{ width: '37%', marginRight: '3%'}}>
            <div
              className="image-preview"
              style={{ height: '100%', overflow: 'hidden',backgroundColor ,borderradius: '15px'}}
              dangerouslySetInnerHTML={{ __html: temporarySvgContent }}
            />
          </div>

          <div className='content-section' style={{ width: '60%' }}>
          <div className="color-container">
              <h3>Colors Used in This SVG:</h3>
              <div className="colors">
                {colors.map((color, index) => (
                  <div 
                    key={index} 
                    className="color-circle" 
                    style={{ backgroundColor: color }} 
                    onClick={(event) => handleColorCircleClick(index, event)}
                  />
                ))}
              </div>
            </div>
            
            <div className="or-spacer">
              <div className="mask"></div>
            </div>


            {showColorPicker && (
              <ColorPicker
                color={colors[currentColorIndex]}
                onChange={handleColorChange}
                onClose={() => {
                  applyChangesToOriginal();
                  setShowColorPicker(false);
                  setCurrentColorIndex(null);
                }}
                position={pickerPosition}
              />
            )}
            <div className="bg-color-container">
              <h3>Background Color:</h3>
              <div 
                className="bg-color-circle" 
                style={{ backgroundColor }} 
                onClick={handleBgColorClick}
              />
            </div>
            {showBgColorPicker && (
              <ColorPicker
                color={backgroundColor}
                onChange={handleBgColorChange}
                onClose={() => {
                  setShowBgColorPicker(false);
                }}
                position={pickerPosition}
              />
            )}

            <div className="or-spacer">
              <div className="mask"></div>
            </div>
            <div className="res-sec">
              <h3><span>Select Resolution:</span></h3>
              <button className={`button-35 ${resolution === 'original' ? 'active' : ''}`} onClick={() => handleResolutionChange('original')}>
                Original
              </button>
              <button className={`button-35 ${resolution === '500' ? 'active' : ''}`} onClick={() => handleResolutionChange('500')}>
                500 x 500
              </button>
              <button className={`button-35 ${resolution === '1000' ? 'active' : ''}`} onClick={() => handleResolutionChange('1000')}>
                1000 x 1000
              </button>
              <button className={`button-35 ${resolution === '2000' ? 'active' : ''}`} onClick={() => handleResolutionChange('2000')}>
                2000 x 2000
              </button>
            </div>

            <div className="or-spacer">
              <div className="mask"></div>
            </div>
            
            <div className="download-section">
              <button className="button-29" onClick={downloadSvg} >Download SVG</button>
              <button className="button-29" onClick={convertSvgToPng} >Download PNG</button>
              <button className="button-29" onClick={convertSvgToJpeg} >Download JPEG</button>
            </div>


            <div className="or-spacer">
              <div className="mask"></div>
            </div>

            <div className='tag-sec'>
              <h5>Tags:</h5>
              <div className="tags-container">
                {renderTags()} {/* Render the tags here */}
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
  
};

ImageModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,tags: PropTypes.arrayOf(PropTypes.string), // Change this line
};

export default ImageModal;