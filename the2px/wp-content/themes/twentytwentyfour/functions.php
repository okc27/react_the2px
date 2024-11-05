<?php
/**
 * Twenty Twenty-Four functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package Twenty Twenty-Four
 * @since Twenty Twenty-Four 1.0
 */

// Existing block styles and other functions...

// Register custom fields for SVG Images
function register_custom_fields() {
    // Check if the ACF plugin is activated
    if (function_exists('register_rest_field')) {
        // Register custom fields for SVG Images
        register_rest_field('svg_images', 'svg_image_name', [
            'get_callback' => function($data) {
                return get_field('svg_image_name', $data['id']);
            }
        ]);
        register_rest_field('svg_images', 'svg_image_description', [
            'get_callback' => function($data) {
                return get_field('svg_image_description', $data['id']);
            }
        ]);
        register_rest_field('svg_images', 'svg_image_tags', [
            'get_callback' => function($data) {
                return get_field('svg_image_tags', $data['id']);
            }
        ]);
        register_rest_field('svg_images', 'svg_file_categorie', [
            'get_callback' => function($data) {
                return get_field('svg_file_categorie', $data['id']);
            }
        ]);
        register_rest_field('svg_images', 'svg_image_file', [
            'get_callback' => function($data) {
                return get_field('svg_image_file', $data['id']);
            }
        ]);
    }
}
add_action('rest_api_init', 'register_custom_fields');

// Allow SVG uploads
function allow_svg_uploads($mimes) {
    $mimes['svg'] = 'image/svg+xml';
    return $mimes;
}
add_filter('upload_mimes', 'allow_svg_uploads');

// Fix for SVG preview in the Media Library
function fix_svg_media_library($response, $attachment_id) {
    $response['type'] = 'image/svg+xml';
    return $response;
}
add_filter('wp_prepare_attachment_for_js', 'fix_svg_media_library', 10, 2);