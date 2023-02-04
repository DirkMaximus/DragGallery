<?php
/**
 * Plugin Name:       Drag Gallery
 * Description:       A Gallery block with Drag and Drop functionality to lay out images in rows while retaining aspect ratio.
 * Version:           0.1.1
 * Requires at least: 5.8
 * Requires PHP:      7.0
 * Author:            Developub
 * License:           
 * License URI:       
 * Text Domain:       drag-gallery
 *
 * @package           create-block
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_drag_gallery_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'create_block_drag_gallery_block_init' );
