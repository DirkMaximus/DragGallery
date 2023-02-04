import { useBlockProps } from '@wordpress/block-editor';
import DragGalleryImage from './DragGalleryImage.js';

const { Component, Fragment } = wp.element;
const { MediaUpload, MediaUploadCheck } = wp.blockEditor;
const { Button } = wp.components;

export default function Edit(props) {
	
	//const [selected, setSelected] = useState(null);
	//props.setAttributes({el: createRef()});
	
	function getArrayCopy(arr) {
		return arr.map((x) => x);
	}
	function getObjectCopy(obj) {
		return Object.assign({}, obj);
	}
	
	
	
	
	
	
	
	
	
	
	function selectImage(media) {
        
        var newImages = new Array();
        let imageID = getNextAvailableID();
        let row = getNextAvailableRow();
        
        if(media.length) {//Array of images
            
            /*
            BUG: Function is called twice.
            For now, see if the last media.length items in attributes.images match the media items.
            If so, skip the operation.
            */
            let match = true;
            const offset = props.attributes.images.length - media.length;
            if(offset >= 0) {
                for(let i = props.attributes.images.length-(1+media.length); i < props.attributes.images-1; i++) {
                    if(props.attributes.images[i].id != media[i-offset].id) {
                        match = false;
                        break;
                    }
                }
            }else{
                match = false;
            }
            
            if(!match) {
                
                for(let i = 0; i < media.length; i++) {
                    newImages.push({
                        id: media[i].id,
                        url: media[i].url,
                        imageID: imageID+i,
                        row: row+i,
                        linktype: 'image',
                        link: null
                    });
                }
            }
        }else{//Single image
            
            if(lastImage.id != media.id) {
                newImages.push({
                    id: media.id,
                    url: media.url,
                    imageID: imageID,
                    row: row,
                    linktype: 'image',
                    link: null
                });
            }
        }
        
        const images = props.attributes.images.concat(newImages);
        props.setAttributes({images: images});
        
        window.dragGallery.waitForImages();
    }
    
    
    
    
    
    
    
    
    
    function getNextAvailableID() {
        
        let next = 1;
        for(let i = 0; i < props.attributes.images.length; i++) {
            if(props.attributes.images[i].imageID >= next) next = props.attributes.images[i].imageID+1;
        }
        return next;
    }
    
    function getNextAvailableRow() {
        
        let next = 1;
        for(let i = 0; i < props.attributes.images.length; i++) {
            if(props.attributes.images[i].row >= next) next = props.attributes.images[i].row+1;
        }
        return next;
    }
    
    
    
    
    
    
    
    
    
    //window.dragGalleryEdit.setAttributeObject(this.props);

	setTimeout(function() {
		window.dragGallery.waitForImages();
	}, 0);
    
	return(
        <div{...useBlockProps()}>
        
            <div className="drag-gallery" data-blockid={props.clientId}>
                <div className="wrapper">
                    {props.attributes.images.map(function(item, i) {
	                    return <DragGalleryImage key={i} data={item} parentprops={props} />;
                    })}
                </div>
            </div>
            
			<MediaUploadCheck>
				<MediaUpload
					allowedTypes={['image']}
					multiple={true}
					gallery={true}
					onSelect={selectImage}
					render={({open}) => (
						<Button
							className="addmedia"
							onClick={open}
						>Add Images</Button>
					)}
				/>
			</MediaUploadCheck>
        </div>
    );
}