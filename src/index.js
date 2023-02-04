/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor. All other files
 * get applied to the editor only.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.css';
import './editor.css';

/**
 * Internal dependencies
 */
import Edit from './edit.js';
import DragGalleryEdit from './DragGalleryEdit.js';
import save from './save.js';

document.addEventListener('DOMContentLoaded', function() {
	window.dragGalleryEdit = new DragGalleryEdit();
}, false);

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
registerBlockType('create-block/drag-gallery', {
	/**
	 * Used to construct a preview for the block to be shown in the block inserter.
	 */
	example: {
		attributes: {
			message: 'Drag Gallery',
		},
	},
	/**
	 * @see ./edit.js
	 */
	edit: Edit,
	/**
	 * @see ./save.js
	 */
	save,
});