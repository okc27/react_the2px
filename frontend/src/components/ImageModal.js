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
  const [imagesToShow, setImagesToShow] = useState(window.innerWidth < 440 ? 3 : 5);



  // Set default value for otherImages
  const filteredOtherImages = Array.isArray(otherImages) ? otherImages.filter(img => img.svg_image_file !== image) : [];
  const handleLeftArrowClick = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(filteredOtherImages.length - imagesToShow);
    }
  };

  const handleRightArrowClick = () => {
    if (currentIndex < filteredOtherImages.length - imagesToShow) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setImagesToShow(window.innerWidth < 440 ? 3 : 5);
    };
    
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  
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

  
  // Format date as YYYYMMDD without dashes
  const getFormattedDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };

  // Get download file name in the required format
  const getDownloadFileName = (format) => {
    const date = getFormattedDate();
    return `the2px-${title}-${date}.${format}`;
  };

  const downloadSvg = () => {
    const websiteComment = `<!-- Downloaded from the2px.com -->\n`;
    const updatedSvgContent = websiteComment + svgContent; // Prepend the comment to the SVG content
  
    const svgBlob = new Blob([updatedSvgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
  
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', getDownloadFileName('svg'));
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };




  const convertSvgToPng = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.onload = () => {
        let width, height;
        if (resolution === 'original') {
            const svgElement = new DOMParser().parseFromString(svgContent, "image/svg+xml").documentElement;
            width = svgElement.getAttribute('width') ? parseInt(svgElement.getAttribute('width'), 10) : 500; // Default width
            height = svgElement.getAttribute('height') ? parseInt(svgElement.getAttribute('height'), 10) : 500; // Default height
        } else {
            const size = parseInt(resolution, 10);
            width = height = size; // For fixed resolutions, width and height will be the same
        }

        // Set canvas width and height
        canvas.width = width;
        canvas.height = height;

        // Calculate aspect ratio
        const aspectRatio = img.width / img.height;

        // Adjusting the drawImage parameters to keep aspect ratio
        if (aspectRatio > 1) {
            // Wider than tall
            ctx.drawImage(img, 0, (height - (width / aspectRatio)) / 2, width, width / aspectRatio);
        } else {
            // Taller than wide
            ctx.drawImage(img, (width - (height * aspectRatio)) / 2, 0, height * aspectRatio, height);
        }

        const pngUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = getDownloadFileName('png');
        a.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(temporarySvgContent)}`;
};
  const convertSvgToJpeg = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.onload = () => {
        let width, height;
        if (resolution === 'original') {
            const svgElement = new DOMParser().parseFromString(svgContent, "image/svg+xml").documentElement;
            width = svgElement.getAttribute('width') ? parseInt(svgElement.getAttribute('width'), 10) : 500; // Default width
            height = svgElement.getAttribute('height') ? parseInt(svgElement.getAttribute('height'), 10) : 500; // Default height
        } else {
            const size = parseInt(resolution, 10);
            width = height = size; // For fixed resolutions, width and height will be the same
        }

        // Set canvas width and height
        canvas.width = width;
        canvas.height = height;

        // Fill background with selected color
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Calculate aspect ratio
        const aspectRatio = img.width / img.height;

        // Adjusting the drawImage parameters to keep aspect ratio
        if (aspectRatio > 1) {
            // Wider than tall
            ctx.drawImage(img, 0, (height - (width / aspectRatio)) / 2, width, width / aspectRatio);
        } else {
            // Taller than wide
            ctx.drawImage(img, (width - (height * aspectRatio)) / 2, 0, height * aspectRatio, height);
        }

        const jpegUrl = canvas.toDataURL('image/jpeg', 1.0);
        const a = document.createElement('a');
        a.href = jpegUrl;
        a.download = getDownloadFileName('jpeg');
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
  const renderOtherImages = () => {
    const imagesToDisplay = filteredOtherImages.slice(currentIndex, currentIndex + imagesToShow);

    return (
      <div className="other-images-container" style={{ display: 'flex', overflow: 'hidden' }}>
        {imagesToDisplay.map((img, index) => (
          <div key={index} className="other-image-container">
            <img
              src={img.svg_image_file}
              alt={`SVG Preview ${currentIndex + index}`}
              style={{ width: '70px', height: '70px', objectFit: 'contain' }}
              onClick={() => {
                fetch(img.svg_image_file)
                  .then(response => response.text())
                  .then(svgContent => {
                    setTemporarySvgContent(svgContent);
                    setModalTitle(img.title.rendered || 'New SVG Image');
                    setCurrentTags(img.tags || []);
                    setColors(extractColors(svgContent)); // Update colors for the selected image
                  })
                  .catch(error => console.error('Error fetching SVG:', error));
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
              style={{ height: 'auto', overflow: 'hidden', backgroundColor, borderRadius: '15px' }}
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
              <h3  style={{ marginLeft: '10px' }}><span>Select Resolution:</span></h3>
              <div className='b-35'>
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
              <h3>Tags:</h3>
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

export default ImageModal;
