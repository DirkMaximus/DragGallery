/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 *
 * @param {Object} props            Properties passed to the function.
 * @param {Object} props.attributes Available block attributes.
 * @return {WPElement} Element to render.
 */
export default function save({ attributes }) {
	const blockProps = useBlockProps.save();
	
    setTimeout(function() {
        window.dragGallery.waitForImages();
    }, 0);
    
    return (
        <div className="drag-gallery loading">
            <div className="wrapper">
                {attributes.images.map(function(item, i) {
                    
					let image;
                    
					switch(item.linktype) {
						case 'image':
							image = <a href={item.url}><img src={item.url} data-id={item.id} /></a>;
						break;
						case 'url':
							image = <a href={item.link}><img src={item.url} data-id={item.id} /></a>;
						break;
						case 'none':
						default:
							image = <img src={item.url} data-id={item.id} />;
						break;
					}
                    
                    return <div
                        className="image"
                        key={item.imageID}
                        data-imageid={item.imageID}
                        data-row={item.row}
                    >
                        {image}
                    </div>;
                })}
            </div>
        </div>
    );
    
}
