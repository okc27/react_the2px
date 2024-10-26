import React, { useEffect, useState } from 'react'; 
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
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

const ImageModal = ({ show, handleClose, image, title, tags, otherImages }) => {
  const [colors, setColors] = useState([]);
  const [currentColorIndex, setCurrentColorIndex] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [svgContent, setSvgContent] = useState(image);
  const [temporarySvgContent, setTemporarySvgContent] = useState(image);
  const [resolution, setResolution] = useState('original');
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });
  const [modalTitle, setModalTitle] = useState(title); // State for the modal title
  const [currentTags, setCurrentTags] = useState(tags);
  const [currentIndex, setCurrentIndex] = useState(0); 



  // Set default value for otherImages
  const filteredOtherImages = Array.isArray(otherImages) ? otherImages.filter(img => img.svg_image_file !== image) : [];
  const handleLeftArrowClick = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      // Wrap around to the end
      setCurrentIndex(filteredOtherImages.length - imagesToShow);
    }
  };
  
  const handleRightArrowClick = () => {
    if (currentIndex < filteredOtherImages.length - imagesToShow) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Wrap around to the start
      setCurrentIndex(0);
    }
  };
  
  
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
  const imagesToShow = 5;
  const renderOtherImages = () => {
    // Calculate the range of images to display
    const imagesToDisplay = filteredOtherImages.slice(currentIndex, currentIndex + imagesToShow);
    
    return (
      <div className="other-images-container" style={{ display: 'flex', overflow: 'hidden' }}>
        {imagesToDisplay.map((img, index) => (
          <div key={index} className="other-image-container" style={{
            margin: '5px', 
            cursor: 'pointer', 
            width: '70px', 
            height: '70px',
            overflow: 'hidden',
            border: '1px solid #ccc',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
          }}>
            <img
              src={img.svg_image_file}
              alt={`SVG Preview ${currentIndex + index}`} 
              style={{
                width: '70px',
                height: '70px',
                objectFit: 'contain',
              }}
              onClick={() => {
                fetch(img.svg_image_file)
                  .then(response => response.text())
                  .then(svgContent => {
                    setTemporarySvgContent(svgContent);
                    setModalTitle(img.title.rendered || 'New SVG Image');
                    setCurrentTags(img.tags || []);
                  })
                  .catch(error => {
                    console.error('Error fetching SVG:', error);
                  });
              }}
            />
          </div>
        ))}
      </div>
    );
  };
  

  const renderTags = () => {
    if (!currentTags || !Array.isArray(currentTags)) return null; // Return null if no tags or not an array
    return currentTags.map((tag, index) => (
      <span key={index} className="tag">
        {tag.trim()} {/* Trim whitespace around each tag */}
      </span>
    ));
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title> {/* Update title display */}
      </Modal.Header>
      <Modal.Body>
        <div className="image-modal-container">
          <div className="image-preview-container" style={{ width: '37%', marginRight: '3%' }}>
            <div
              className="image-preview"
              style={{ height: '100%', overflow: 'hidden', backgroundColor, borderRadius: '15px' }}
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
              <button className="button-29" onClick={downloadSvg}>Download SVG</button>
              <button className="button-29" onClick={convertSvgToPng}>Download PNG</button>
              <button className="button-29" onClick={convertSvgToJpeg}>Download JPEG</button>
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

            <div className="or-spacer">
              <div className="mask"></div>
            </div>

            <div className="other-images-footer">
              <h3>Other SVG Images:</h3>
              <div className="slider-container" style={{ display: 'flex', alignItems: 'center' }}>
                <button className="arrow left-arrow" onClick={handleLeftArrowClick}>&#10094;</button>
                {renderOtherImages()} {/* Render the other SVG images here */}
                <button className="arrow right-arrow" onClick={handleRightArrowClick}>&#10095;</button>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

ImageModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
  otherImages: PropTypes.arrayOf(PropTypes.shape({
    svg_image_file: PropTypes.string.isRequired
  })),
};

ImageModal.defaultProps = {
  otherImages: [], // Provide a default value to avoid TypeError
};

export default ImageModal;
