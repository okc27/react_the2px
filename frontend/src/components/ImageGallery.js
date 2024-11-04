import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ImageCard from './ImageCard';

const ImageGallery = ({ bgColor, searchInput }) => {
  const [images, setImages] = useState([]);
  const noImageFoundUrl = "https://react.the2px.com//wp-content/uploads/2024/10/image-not-found-1.svg";

  useEffect(() => {
    // Preload the "no images found" image
    const preloadImage = new Image();
    preloadImage.src = noImageFoundUrl;

    const fetchImages = async () => {
      try {
        let allImages = [];
        let page = 1;
        let totalPages;

        do {
          const response = await fetch(`https://react.the2px.com//wp-json/wp/v2/svg_images?per_page=100&page=${page}`);
          if (!response.ok) {
            throw new Error(`Error fetching images: ${response.statusText}`);
          }

          const data = await response.json();
          allImages = allImages.concat(data);
          totalPages = response.headers.get('X-WP-TotalPages');
          page++;
        } while (page <= totalPages);

        const otherImages = allImages.map(image => {
          const fileUrl = image.svg_image_file || '';
          return {
            ...image,
            file: fileUrl.startsWith('http') ? fileUrl : `https://react.the2px.com//${fileUrl}`,
            tags: image.svg_image_tags ? image.svg_image_tags.split(',') : [],
          };
        });

        setImages(otherImages);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  const filteredImages = images.filter(image => {
    const searchValue = searchInput.toLowerCase();
    const tags = image.tags ? image.tags.join(' ') : '';
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
            <div className="col-4 mb-4" key={image.id}>
              <ImageCard
                title={image.title.rendered}
                description={image.description}
                svgUrl={image.file}
                tags={image.tags}
                backgroundColor={bgColor}
                otherImages={images}
                ids={image.id}
              />
            </div>
          ))
        ) : (
          searchInput && (
            <div className="col-12 d-flex flex-column align-items-center justify-content-center" style={{ height: '60vh' }}>
              <img
                src={noImageFoundUrl}
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

ImageGallery.propTypes = {
  bgColor: PropTypes.string,
  searchInput: PropTypes.string.isRequired,
};

export default ImageGallery;
