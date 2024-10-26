import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for prop validation
import ImageCard from './ImageCard';

const ImageGallery = ({ bgColor, searchInput }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        let allImages = [];
        let page = 1;
        let totalPages;

        do {
          const response = await fetch(`http://localhost/headlesswp/the2px/wp-json/wp/v2/svg_images?per_page=100&page=${page}`); // Fetch 100 images per page
          if (!response.ok) {
            throw new Error(`Error fetching images: ${response.statusText}`);
          }

          const data = await response.json();
          allImages = allImages.concat(data); // Combine the new images with existing images
          totalPages = response.headers.get('X-WP-TotalPages'); // Get the total pages
          page++;
        } while (page <= totalPages);

        // Process the images here and store in otherImages
        const otherImages = allImages.map(image => {
          const fileUrl = image.svg_image_file || '';
          return {
            ...image,
            file: fileUrl.replace(/\/\//g, '/'),
            file: fileUrl.startsWith('http') ? fileUrl : `http://localhost/headlesswp/the2px${fileUrl}`, // Updated to use the live server URL
            tags: image.svg_image_tags ? image.svg_image_tags.split(',') : [], // Split tags into an array
          };
        });

        console.log('Other images (decodedData):', otherImages); // Log otherImages data

        setImages(otherImages);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  // Filter images based on search input
  const filteredImages = images.filter(image => {
    const searchValue = searchInput.toLowerCase();
    const tags = image.tags ? image.tags.join(' ') : ''; // Use the tags array to check for matches
    return (
      tags.toLowerCase().includes(searchValue) ||
      (image.description && image.description.toLowerCase().includes(searchValue)) ||
      (image.title.rendered && image.title.rendered.toLowerCase().includes(searchValue))
    );
  });

  return (
    <div className="image-gallery container">
      <div className="row">
        {filteredImages.length > 0 ? (
          filteredImages.map((image) => (
            <div className="col-4 mb-4" key={image.id}> {/* Custom column class for 3 cards in a row */}
              <ImageCard
                title={image.title.rendered}
                description={image.description}
                svgUrl={image.file}
                tags={image.tags}
                backgroundColor={bgColor}
                otherImages={images} // Passing the full data as props to ImageCard
              />
            </div>
          ))
        ) : (
          searchInput && ( // Display the image and message only if there's input in the search bar
            <div className="col-12 d-flex flex-column align-items-center justify-content-center" style={{ height: '60vh' }}>
              <img
                src="http://localhost/headlesswp/the2px/http://localhost/headlesswp/the2px/wp-content/uploads/2024/10/image-not-found-1.svg"
                alt="No images found logo"
                style={{ width: '50%', marginBottom: '15px' }}
              />
              <h5>It seems we can’t find what you’re looking for.</h5>
            </div>
          )
        )}
      </div>
    </div>
  );
};

// Adding prop types for validation
ImageGallery.propTypes = {
  bgColor: PropTypes.string,
  searchInput: PropTypes.string.isRequired,
};

export default ImageGallery;
