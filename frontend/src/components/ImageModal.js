import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Form } from 'react-bootstrap';
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

const ImageModal = ({ show, handleClose, image, title }) => {
  const [colors, setColors] = useState([]);
  const [currentColorIndex, setCurrentColorIndex] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff'); // Default background color set to white
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [svgContent, setSvgContent] = useState(image);
  const [temporarySvgContent, setTemporarySvgContent] = useState(image); // Temporary SVG for live changes
  const [resolution, setResolution] = useState('original'); // Default resolution set to 'original'

  const extractColors = (svgString) => {
    const colorRegex = /#([0-9A-Fa-f]{3,6})\b/g;
    const foundColors = new Set(svgString.match(colorRegex));
    return Array.from(foundColors);
  };

  // Throttled color update function
  const updateColor = throttle((index, newColor) => {
    const updatedColors = [...colors];
    updatedColors[index] = newColor;
    setColors(updatedColors);

    // Update the temporary SVG with the new color
    const oldColor = colors[index];
    const updatedSvg = temporarySvgContent.replace(new RegExp(oldColor, 'g'), newColor);
    setTemporarySvgContent(updatedSvg);
  }, 50); // Throttle updates every 50ms

  const applyChangesToOriginal = () => {
    setSvgContent(temporarySvgContent); // Update the original SVG content with the temporary changes
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
        // Get the intrinsic size of the SVG
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

      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Generate PNG URL
      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `${title}.png`;
      a.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(temporarySvgContent)}`; // Convert temporary SVG to base64
  };

  const convertSvgToJpeg = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.onload = () => {
      let size;
      if (resolution === 'original') {
        // Get the intrinsic size of the SVG
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

      // Set the background color to white by default
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const jpegUrl = canvas.toDataURL('image/jpeg', 1.0); // Use maximum quality
      const a = document.createElement('a');
      a.href = jpegUrl;
      a.download = `${title}.jpeg`;
      a.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(temporarySvgContent)}`; // Convert temporary SVG to base64
  };

  useEffect(() => {
    if (show) {
      const extractedColors = extractColors(image);
      setColors(extractedColors);
      setSvgContent(image);
      setTemporarySvgContent(image); // Reset temporary SVG content when modal opens
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

  const handleResolutionChange = (e) => {
    setResolution(e.target.value);
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="image-modal-container">
          <div className="image-preview-container col-8" style={{ backgroundColor }}>
            <div
              className="image-preview"
              style={{ height: '100%', overflow: 'hidden' }}
              dangerouslySetInnerHTML={{ __html: temporarySvgContent }} // Use temporary SVG for live updates
            />
          </div>
          <div className="download-section col-4">
            <h2>Let's Download Image for your project.</h2>

            <Form.Group controlId="resolutionSelect">
              <Form.Label>Select Resolution:</Form.Label>
              <Form.Control as="select" value={resolution} onChange={handleResolutionChange}>
                <option value="original">Original</option>
                <option value="500">500 x 500</option>
                <option value="1000">1000 x 1000</option>
                <option value="2000">2000 x 2000</option>
              </Form.Control>
            </Form.Group>

            <Button variant="primary" onClick={downloadSvg}>Download SVG</Button>
            <Button variant="success" onClick={convertSvgToPng}>Download PNG</Button>
            <Button variant="warning" onClick={convertSvgToJpeg}>Download JPEG</Button>
          </div>
        </div>
        <div className="color-container">
          <h3>Colors Used in This SVG:</h3>
          <div className="colors">
            {colors.map((color, index) => (
              <div 
                key={index} 
                className="color-circle" 
                style={{ backgroundColor: color }} 
                onClick={() => {
                  setCurrentColorIndex(index); // Store index of clicked color
                  setShowColorPicker(true);
                }}
              />
            ))}
          </div>
        </div>
        {showColorPicker && (
          <ColorPicker
            color={colors[currentColorIndex]} // Pass the current color to the ColorPicker
            onChange={handleColorChange}
            onClose={() => {
              applyChangesToOriginal(); // Update original SVG when closing color picker
              setShowColorPicker(false);
              setCurrentColorIndex(null); // Reset index when closing
            }}
          />
        )}
        <div className="bg-color-container">
          <h3>Background Color:</h3>
          <div 
            className="bg-color-circle" 
            style={{ backgroundColor }} 
            onClick={() => setShowBgColorPicker(true)}
          />
          {showBgColorPicker && (
            <ColorPicker
              color={backgroundColor}
              onChange={handleBgColorChange}
              onClose={() => setShowBgColorPicker(false)}
            />
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

ImageModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default ImageModal;
