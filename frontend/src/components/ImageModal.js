import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap'; // Importing necessary components from react-bootstrap
import './ImageModal.css'; // Importing the updated CSS

const ImageModal = ({ show, handleClose, image, title, downloadSvg, convertSvgToPng, convertSvgToJpeg }) => {
  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title> {/* Show the name of the image */}
      </Modal.Header>
      <Modal.Body>
        <div className="image-modal-container">
          <div className="image-preview-container col-8"> {/* Image container with updated styling */}
            <div
              className="image-preview"
              style={{ height: '100%', overflow: 'hidden' }}
              dangerouslySetInnerHTML={{ __html: image }} // Show the clicked image
            />
          </div>
          <div className="download-section col-4">
            <h2>Let's Download Image for your project.</h2> {/* Show the name of the image */}
            <Button variant="primary" onClick={downloadSvg}>Download SVG</Button>
            <Button variant="success" onClick={convertSvgToPng}>Download PNG</Button>
            <Button variant="warning" onClick={convertSvgToJpeg}>Download JPEG</Button>
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
  title: PropTypes.string.isRequired,
  downloadSvg: PropTypes.func.isRequired,
  convertSvgToPng: PropTypes.func.isRequired,
  convertSvgToJpeg: PropTypes.func.isRequired,
};

export default ImageModal;
