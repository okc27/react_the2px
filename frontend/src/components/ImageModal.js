import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Form } from 'react-bootstrap';
import ColorPicker from './ColorPicker';
import './ImageModal.css';

const ImageModal = ({ show, handleClose, image, title }) => {
  const [colors, setColors] = useState([]);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff'); // Default background color set to white
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [svgContent, setSvgContent] = useState(image);
  const [resolution, setResolution] = useState('500'); // Default resolution 500x500

  const extractColors = (svgString) => {
    const colorRegex = /#([0-9A-Fa-f]{3,6})\b/g;
    const foundColors = new Set(svgString.match(colorRegex));
    return Array.from(foundColors);
  };

  const updateSvgColor = (oldColor, newColor) => {
    const updatedSvg = svgContent.replace(new RegExp(oldColor, 'g'), newColor);
    setSvgContent(updatedSvg);
    setCurrentColor(newColor);
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
      const size = parseInt(resolution, 10); // Convert selected resolution to integer
      canvas.width = size;
      canvas.height = size;

      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Generate PNG URL
      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `${title}.png`;
      a.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgContent)}`; // Convert SVG to base64
  };

  const convertSvgToJpeg = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.onload = () => {
      const size = parseInt(resolution, 10); // Convert selected resolution to integer
      canvas.width = size;
      canvas.height = size;

      // Set the background color to white by default
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const jpegUrl = canvas.toDataURL('image/jpeg');
      const a = document.createElement('a');
      a.href = jpegUrl;
      a.download = `${title}.jpeg`;
      a.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgContent)}`; // Convert SVG to base64
  };

  useEffect(() => {
    if (show) {
      const extractedColors = extractColors(image);
      setColors(extractedColors);
      setSvgContent(image);
    }
  }, [show, image]);

  const handleColorChange = (newColor) => {
    updateSvgColor(currentColor, newColor.hex);
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
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          </div>
          <div className="download-section col-4">
            <h2>Let's Download Image for your project.</h2>

            <Form.Group controlId="resolutionSelect">
              <Form.Label>Select Resolution:</Form.Label>
              <Form.Control as="select" value={resolution} onChange={handleResolutionChange}>
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
                  setCurrentColor(color);
                  setShowColorPicker(true);
                }}
              />
            ))}
          </div>
        </div>
        {showColorPicker && (
          <ColorPicker
            color={currentColor}
            onChange={handleColorChange}
            onClose={() => setShowColorPicker(false)}
          />
        )}
        <div className="bg-color-container">
          <h3>Background Color:</h3>
          <div 
            className="bg-color-circle" 
            style={{ backgroundColor: backgroundColor }} 
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
