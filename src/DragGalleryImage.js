import { useEffect, createRef, useState } from '@wordpress/element';

const { Component, Fragment } = wp.element;
const { MediaUpload, MediaUploadCheck } = wp.blockEditor;
const { Button, IconButton, Toolbar, ToolbarGroup, ToolbarButton } = wp.components;

export default class DragGalleryImage extends Component {
	
	constructor(props) {
		super(props);
		
		this.el = createRef();
		
		this.imageDown = this.imageDown.bind(this);
		this.imageClick = this.imageClick.bind(this);
		this.replaceImage = this.replaceImage.bind(this);
		this.linkClick = this.linkClick.bind(this);
		this.linkCancel = this.linkCancel.bind(this);
		this.linkUpdate = this.linkUpdate.bind(this);
	}
	getArrayCopy(arr) {
		return arr.map((x) => x);
	}
	getObjectCopy(obj) {
		return Object.assign({}, obj);
	}
	
	
	
	
	
	
	
	
	
	//TO DO: fix right click
	imageDown(e) {

		window.dragGalleryEdit.setAttributeObject(this.props.parentprops);

		window.dragGalleryEdit.startDrag(e);
	}
	imageClick(e) {
		const gallery = jQuery(e.currentTarget).parents('.drag-gallery')[0];
		
		const images = jQuery(gallery).find('.image');
		images.removeClass('selected');
		
		images.not(e.currentTarget).find('.linksettings').removeClass('open');
		
		jQuery(e.currentTarget).addClass('selected');
	}
	
	replaceImage(media) {
		
		const selected = this.el.current;
		
		const gallery = jQuery(selected).parents('.drag-gallery')[0];
		const index = jQuery(gallery).find('.image').index(selected);
		
		const att_img = this.getObjectCopy(this.props.parentprops.attributes.images[index]);
		att_img.id = media.id;
		att_img.url = media.url;
		
		const att_images = this.getArrayCopy(this.props.parentprops.attributes.images);
		att_images[index] = att_img;
		
		this.props.parentprops.setAttributes({images: att_images});
		
		window.dragGallery.waitForImages();
	}
	
	linkClick(e) {
		const image = jQuery(e.currentTarget).parents('.image')[0];
		const linksettings = jQuery(image).find('.linksettings')[0];
		
		//Set the checked status
		//TO DO: move this to componentDidMount?
		let linkoption_none_checked = false;
		let linkoption_image_checked = false;
		let linkoption_custom_checked = false;
		
		switch(this.props.data.linktype) {
			case 'image':
				linkoption_image_checked = 'checked';
			break;
			case 'url':
				linkoption_custom_checked = 'checked';
			break;
			case 'none':
			default:
				linkoption_none_checked = 'checked';
			break;
		}
		const fieldIds = this.getFieldIds();
		const linkoption_none_input = jQuery(linksettings).find('input#'+fieldIds.linkoption_none_id)[0];
		const linkoption_image_input = jQuery(linksettings).find('input#'+fieldIds.linkoption_image_id)[0];
		const linkoption_custom_input = jQuery(linksettings).find('input#'+fieldIds.linkoption_custom_id)[0];
		jQuery(linkoption_none_input).prop('checked', linkoption_none_checked);
		jQuery(linkoption_image_input).prop('checked', linkoption_image_checked);
		jQuery(linkoption_custom_input).prop('checked', linkoption_custom_checked);
		
		if(jQuery(linksettings).hasClass('open')) {
			jQuery(linksettings).removeClass('open');
		}else{
			jQuery(linksettings).addClass('open');
		}
	}
	linkCancel(e) {
		jQuery(e.currentTarget).parents('.linksettings').removeClass('open');
	}
	linkUpdate(e) {
		
		const item = this.getObjectCopy(this.props.data);
		
		const image = jQuery(e.currentTarget).parents('.image')[0];
		const gallery = jQuery(image).parents('.drag-gallery')[0];
		const index = jQuery(gallery).find('.image').index(image);
		
		const linksettings = jQuery(image).find('.linksettings')[0];
		
		const fieldIds = this.getFieldIds();
		const selected_input = jQuery(linksettings).find('input[name='+fieldIds.linkoption_group_id+']:checked')[0];
		const customurl_input = jQuery(linksettings).find('input#'+fieldIds.customlink_id)[0];
		
		if(selected_input) {
			
			const val = jQuery(selected_input).val();
			item.linktype = val;
			
			switch(val) {
				case 'url':
					item.link = jQuery(customurl_input).val();
				break;
			}
		}else{
			
		}
		
		//Save changes
		const images = this.getArrayCopy(this.props.parentprops.attributes.images);
		images[index] = item;
		this.props.parentprops.setAttributes({images: images});
		
		//Close popup
		jQuery(e.currentTarget).parents('.linksettings').removeClass('open');
	}
	
	
	
	
	
	
	
	getFieldIds() {
		
		const clientId = this.props.parentprops.clientId;
		const imageId = this.props.data.imageID;
		
		return {
			linkoption_group_id: 'linkoption_'+clientId+'_'+imageId,
			linkoption_none_id: 'linkoption_'+clientId+'_'+imageId+'_none',
			linkoption_image_id: 'linkoption_'+clientId+'_'+imageId+'_image',
			linkoption_custom_id: 'linkoption_'+clientId+'_'+imageId+'_custom',
			customlink_id: 'customlink_'+clientId+'_'+imageId
		}
	}
	
	renderToolbar() {
		
		const clientId = this.props.parentprops.clientId;
		const imageId = this.props.data.imageID;
		
		const fieldIds = this.getFieldIds();
		
		return (
			<div className="imagetoolbar">
				<Toolbar>
					<ToolbarButton 
						label="Link"
						icon={() => (
							<span className="dashicons dashicons-admin-links"></span>
						)}
						className="link"
						onClick={this.linkClick}
					/>
					
					<MediaUploadCheck>
						<MediaUpload
							allowedTypes={['image']}
							multiple={false}
							gallery={false}
							onSelect={this.replaceImage}
							render={({open}) => (
								<ToolbarButton
									label="Change Image"
									icon={() => (
										<span className="dashicons dashicons-format-image"></span>
									)}
									className="change"
									onClick={open}
								/>
							)}
						/>
					</MediaUploadCheck>
				</Toolbar>
				
				<div className="linksettings">
					<div className="item">
						<div className="content">
							<input
								type="radio"
								id={fieldIds.linkoption_none_id}
								name={fieldIds.linkoption_group_id}
								defaultValue="none"
							/>
							<label
								for={fieldIds.linkoption_none_id}
							>No link</label>
						</div>
					</div>
					<div className="item">
						<div className="content">
							<input
								type="radio"
								id={fieldIds.linkoption_image_id}
								name={fieldIds.linkoption_group_id}
								defaultValue="image"
							/>
							<label
								for={fieldIds.linkoption_image_id}
							>Link to image</label>
						</div>
					</div>
					<div className="item">
						<div className="content grow">
							<input
								type="radio"
								id={fieldIds.linkoption_custom_id}
								name={fieldIds.linkoption_group_id}
								defaultValue="url"
							/>
							<input
								type="text"
								id={fieldIds.customlink_id}
								name={fieldIds.customlink_id}
								value={this.props.link}
								placeholder="Custom URL"
							/>
						</div>
					</div>
					<div className="item right">
						<div className="content">
							<button
								onClick={this.linkUpdate}
							>Update link</button>
							<button
								onClick={this.linkCancel}
							>Cancel</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
	
	render() {
		return (
			<div
				ref={this.el}
				className="image"
				data-imageid={this.props.data.imageID}
				data-row={this.props.data.row}
				onMouseDown={this.imageDown}
				onClick={this.imageClick}
			>
				{this.renderToolbar()}
				
				<img src={this.props.data.url} data-id={this.props.data.id} />
			</div>
		);
	}
}