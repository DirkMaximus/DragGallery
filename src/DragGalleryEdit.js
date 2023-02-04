export default class DragGalleryEdit {

	constructor() {
		/*
	    {
	        int: (integer),
	        speed: (number)
	    }
	    */
		this.dragScrollObj = {
			int: null,
			speed: null
		};
		
		this.MIN_DRAG = 3;

		this.scrollSelector = '.interface-interface-skeleton__content';

		this.imageMove = this.imageMove.bind(this);
		this.imageUp = this.imageUp.bind(this);
		this.dragScroll = this.dragScroll.bind(this);
	}

	setAttributeObject(props) {
		this.props = props;
	}
	
	
	
	
	
	
	
	
	getClientPos(e, referencePos) {
		var clientX = e.clientX;
		var clientY = e.clientY;

		if(!clientX) {

			var touches;

			if(e.touches && e.touches.length > 0) {
				touches = e.touches;
			} else if(e.originalEvent.touches && e.originalEvent.touches.length > 0) {
				touches = e.originalEvent.touches;
			}

			if(touches) {
				if(referencePos) {
					var closest = touches[0];
					var closest_dist = getDistance(referencePos, {
						x: touches[0].clientX,
						y: touches[0].clientY
					});
					for(var i = 1; i < touches.length; i++) {
						var dist = getDistance(referencePos, {
							x: touches[i].clientX,
							y: touches[i].clientY
						});
						if(dist < closest_dist) {
							closest = touches[i];
							closest_dist = dist;
						}
					}
					clientX = closest.clientX;
					clientY = closest.clientY;
				} else {
					clientX = touches[0].clientX;
					clientY = touches[0].clientY;
				}
			}
		}

		var pos = {
			x: clientX,
			y: clientY
		};

		return pos;
	}

	anim_scroll(locY, time) {
		if(time == null) time = 600;

		jQuery(this.scrollSelector).animate({
			scrollTop: locY
		}, time);
	}




	
	
	
	
	
	/*
	Get an array of all image elements in a row
	@param gallery(element): .drag-gallery element
	@param row_num(int): if row_image is null, row_num can be used instead
	*/
	getRow(gallery, row_num) {

		let row_image_arr = new Array();

		//let images = jQuery(gallery).find('.image, .placeholder.current');
		let images = jQuery(gallery).find('.image');

		for(let i = 0; i < images.length; i++) {
			const image = images[i];

			if(parseFloat(jQuery(image).attr('data-row')) == row_num) {
				row_image_arr.push(image);
			}
		}

		return row_image_arr;
	}
	removeFromRow(arr, image) {
		for(let i = 0; i < arr.length; i++) {
			if(image === arr[i]) {
				arr.splice(i, 1);
				break;
			}
		}
		return arr;
	}
	getNextAvailableRow(gallery) {
		let next = 1;

		const self = this;
		jQuery(gallery).find('.image').each(function(index) {
			const rowNum = parseFloat(jQuery(this).attr('data-row'));
			if(rowNum >= next) next = rowNum + 1;
		});

		return next;
	}




	getAttImagesCopy() {
		return this.props.attributes.images.map((x) => x);
	}
	getAttImgCopy(att_images, index) {
		let att_img = att_images[index];
		att_img = Object.assign({}, att_img);
		return att_img;
	}




	dragScroll() {
		const scrollTop = jQuery(this.scrollSelector).scrollTop();
		jQuery(this.scrollSelector).scrollTop(scrollTop + this.dragScrollObj.speed);
	}
	getOverImage() {
		let over_image;

		const drag = jQuery('.drag-image');
		const gallery = jQuery(drag).data('gallery');
		let images = jQuery(gallery).find('.image');

		let overY_image;
		for(let i = 0; i < images.length; i++) {

			const image = images[i];
			const image_rect = image.getBoundingClientRect();

			if(this.clientPos.y < image_rect.bottom &&
				this.clientPos.y > image_rect.top) {
				overY_image = image;
				break;
			}

			//See if drag is above this image / between this image and the previous one
			if(!overY_image) {

				if(this.clientPos.y < image_rect.top) {
					if(i == 0) {
						overY_image = image;
						break;
					} else {
						const prev_image = images[i - 1];
						const prev_rect = prev_image.getBoundingClientRect();
						const dist_prev = this.clientPos.y - prev_rect.bottom;
						const dist = image_rect.top - this.clientPos.y;

						if(Math.abs(dist_prev) < Math.abs(dist)) {
							overY_image = prev_image;
						} else {
							overY_image = image;
						}
						break;
					}
				}
			}

			//If this is the last image, see if drag is below
			if(!overY_image) {
				if(i == images.length - 1) {
					overY_image = image;
					break;
				}
			}
		}

		const row = window.dragGallery.getRow(gallery, parseFloat(jQuery(overY_image).attr('data-row')));
		for(let i = 0; i < row.length; i++) {

			const image = row[i];
			const image_rect = image.getBoundingClientRect();

			if(this.clientPos.x < image_rect.right &&
				this.clientPos.x > image_rect.left) {
				over_image = image;
				break;
			}

			//See if drag is left of this image / between this image and the previous one
			if(!over_image) {

				if(this.clientPos.x < image_rect.left) {
					if(i == 0) {
						over_image = image;
						break;
					} else {
						const prev_image = row[i - 1];
						const prev_rect = prev_image.getBoundingClientRect();
						const dist_prev = this.clientPos.x - prev_rect.right;
						const dist = image_rect.left - this.clientPos.x;

						if(Math.abs(dist_prev) < Math.abs(dist)) {
							over_image = prev_image;
						} else {
							over_image = image;
						}
						break;
					}
				}
			}

			//If this is the last image, see if drag is below
			if(!over_image) {
				if(i == row.length - 1) {
					over_image = image;
					break;
				}
			}
		}
		
		return over_image;
	}
	
	//TO DO: change direc so that it only returns value at edges.
	getOverDirec(over_image) {
		
		const over_rect = over_image.getBoundingClientRect();

		const dist_top = this.clientPos.y - over_rect.top;
		const dist_bottom = over_rect.bottom - this.clientPos.y;
		const dist_left = this.clientPos.x - over_rect.left;
		const dist_right = over_rect.right - this.clientPos.x;

		let closestY = {
			loc: 'top',
			dist: dist_top
		};
		if(Math.abs(dist_bottom) < Math.abs(dist_top)) {
			closestY = {
				loc: 'bottom',
				dist: dist_bottom
			}
		}

		let closestX = {
			loc: 'left',
			dist: dist_left
		};
		if(Math.abs(dist_right) < Math.abs(dist_left)) {
			closestX = {
				loc: 'right',
				dist: dist_right
			}
		}

		let direc;
		if(closestY.dist < 0 && closestX.dist < 0) {
			//outside
			
			if(closestY.dist < closestX.dist) {
				direc = closestY.loc;
			} else {
				direc = closestX.loc;
			}
		}else if(closestY.dist < 0) {
			//outside
			
			direc = closestY.loc;
			
		}else if(closestX.dist < 0) {
			//outside
			
			direc = closestX.loc;
			
		}else{
			//inside
			
			if(Math.abs(closestY.dist) < Math.abs(closestX.dist)) {
				direc = closestY.loc;
			} else {
				direc = closestX.loc;
			}
		}

		return direc;
	}




	/*
	@param e(MouseEvent)
	@param attributes(object): Gutenberg Block instance attributes object
	*/
	startDrag(e) {
		
		//Set the gallery down state
		const gallery = jQuery(e.currentTarget).parents('.drag-gallery')[0];
		jQuery(gallery).addClass('dg-dragging');
		jQuery(gallery).data('dragready', true).data('dragging', false);
		
		//Record the clicked item
		this.dragging = e.currentTarget;
		
		//Save the click position
		const clientPos = this.getClientPos(e);
		jQuery(gallery).data('downClientPos', clientPos);

		jQuery(document).on('mousemove', this.imageMove);
		jQuery(document).on('mouseup', this.imageUp);
	}

	imageMove(e) {
		
		const gallery = jQuery('.drag-gallery.dg-dragging')[0];
		
		this.clientPos = this.getClientPos(e);
		
		let drag;
		
		if(jQuery(gallery).data('dragready')
		&& !jQuery(gallery).data('dragging')) {
			
			this.downClientPos = jQuery(gallery).data('downClientPos');
			const distX = this.clientPos.x - this.downClientPos.x;
			const distY = this.clientPos.y - this.downClientPos.y;
			let dist = distX;
			if(Math.abs(distY) > Math.abs(distX)) dist = distY;
			
			if(Math.abs(dist) > this.MIN_DRAG) {
			
				jQuery(gallery).data('dragging', true);
				
				//Create drag image
				drag = document.createElement('div');
				jQuery(drag).data('gallery', gallery);
				jQuery(drag).addClass('drag-image');
				//jQuery(drag).css('width', jQuery(e.currentTarget).outerWidth() / 2 + 'px');
				jQuery(drag).append(jQuery(this.dragging).find('img').clone());
				jQuery('body').append(drag);
				
				//Fade the dragging image
				jQuery(this.dragging).addClass('dragging');
			}
		}
			
		if(jQuery(gallery).data('dragging')) {
			
			const drag = jQuery('.drag-image');
			
			jQuery(drag).offset({
				top: this.clientPos.y - jQuery(drag).outerHeight() / 2,
				left: this.clientPos.x - jQuery(drag).outerWidth() / 2
			});
			
			//Scroll the page if dragged to top or bottom
			const screenHeight = window.innerHeight;
			let speed = 0;
			const screenMarginPercent = .15
			if(this.clientPos.y < screenHeight * screenMarginPercent) {
				speed = this.clientPos.y - screenHeight * screenMarginPercent;
			} else if(this.clientPos.y > screenHeight * (1 - screenMarginPercent)) {
				speed = this.clientPos.y - screenHeight * (1 - screenMarginPercent);
			}
			clearInterval(this.dragScrollObj.int);
			if(speed) {
				this.dragScrollObj = {
					int: setInterval(this.dragScroll, 10),
					speed: speed / 2
				}
			}

			//insert the dragging image into the appropriate grid location
			//const gallery = jQuery(drag).data('gallery');
			const images = jQuery(gallery).find('.image');

			const over_image = this.getOverImage();
			const overImageIndex = jQuery(images).index(over_image);
			const overImageRowNum = parseFloat(jQuery(over_image).attr('data-row'));
			const overImageRow = this.getRow(gallery, overImageRowNum);
			const overImageRowIndex = overImageRow.indexOf(over_image);
			
			jQuery(images).removeClass('over-image over-image-row');
			jQuery(over_image).addClass('over-image');
			/*for(let i = 0; i < overImageRow.length; i++) {
				jQuery(overImageRow[i]).addClass('over-image-row');
			}*/
			
			//If no value and over_image hasn't changed, do not try to place a placeholder.
			const direc = this.getOverDirec(over_image);
			
			if(over_image == this.dragging
			&& (
				overImageRow.length == 1
				|| (
					direc == 'right'
					|| direc == 'left'
				)
			)) {
				//Ignore this dragover IF:
				//over_image is also this.dragging
				//AND over_image is in its own row
				//OR over_image shares its row AND direc is left/right
				
				jQuery(images).css('transform', '');
			}else{
				
				switch(direc) {
					case 'top':
						
						jQuery(images).each(function(index) {
							
							if(overImageRow.includes(this)) {
								jQuery(this).css('transform', 'translate3d(0, '+(window.dragGallery.getREM())+'px, 0)');
							}else if(index < overImageIndex) {
								jQuery(this).css('transform', 'translate3d(0, '+(window.dragGallery.getREM()*-1)+'px, 0)');
							}else{
								jQuery(this).css('transform', 'translate3d(0, '+(window.dragGallery.getREM())+'px, 0)');
							}
						});
						
					break;
					case 'bottom':
						
						jQuery(images).each(function(index) {
							if(overImageRow.includes(this)) {
								jQuery(this).css('transform', 'translate3d(0, '+(window.dragGallery.getREM()*-1)+'px, 0)');
							}else if(index <= overImageIndex) {
								jQuery(this).css('transform', 'translate3d(0, '+(window.dragGallery.getREM()*-1)+'px, 0)');
							}else{
								jQuery(this).css('transform', 'translate3d(0, '+(window.dragGallery.getREM())+'px, 0)');
							}
						});
						
					break;
					case 'right':
						
						jQuery(images).each(function(index) {
							if(!overImageRow.includes(this)) {
								jQuery(this).css('transform', '');
							}
						});
						
						for(let i = 0; i < overImageRow.length; i++) {
							if(i <= overImageRowIndex) {
								jQuery(overImageRow[i]).css('transform', 'translate3d('+(window.dragGallery.getREM()*-2)+'px, 0, 0)');
							}else{
								jQuery(overImageRow[i]).css('transform', 'translate3d('+(window.dragGallery.getREM()*2)+'px, 0, 0)');
							}
						}
						
					break;
					case 'left':
						
						jQuery(images).each(function(index) {
							if(!overImageRow.includes(this)) {
								jQuery(this).css('transform', '');
							}
						});
						
						for(let i = 0; i < overImageRow.length; i++) {
							if(i < overImageRowIndex) {
								jQuery(overImageRow[i]).css('transform', 'translate3d('+(window.dragGallery.getREM()*-2)+'px, 0, 0)');
							}else{
								jQuery(overImageRow[i]).css('transform', 'translate3d('+(window.dragGallery.getREM()*2)+'px, 0, 0)');
							}
						}
						
					break;
				}
			}
		}
	}

	imageUp(e) {

		const gallery = jQuery('.drag-gallery.dg-dragging')[0];
		const dragging = jQuery(gallery).data('dragging');
		const images = jQuery(gallery).find('.image');
		
		if(dragging) {
		
			const drag = jQuery('.drag-image');
			
			const over_image = this.getOverImage();
			const overImageIndex = jQuery(images).index(over_image);
			const overImageRowNum = parseFloat(jQuery(over_image).attr('data-row'));
			const overImageRow = this.getRow(gallery, overImageRowNum);
			const overImageRowIndex = overImageRow.indexOf(over_image);
			
			const direc = this.getOverDirec(over_image);
			
			jQuery(drag).remove();
		
			if(over_image == this.dragging
			&& (
				overImageRow.length == 1
				|| (
					direc == 'right'
					|| direc == 'left'
				)
			)) {
				//no drop
			}else{
				
				let rowNum;
				let rowIndex;
				let insertIndex;
				
				switch(direc) {
					case 'top':
						rowNum = window.dragGalleryEdit.getNextAvailableRow(gallery);
						
						rowIndex = jQuery(images).index(overImageRow[0]);
						insertIndex = rowIndex;
					break;
					case 'bottom':
						rowNum = window.dragGalleryEdit.getNextAvailableRow(gallery);
						
						rowIndex = jQuery(images).index(overImageRow[overImageRow.length-1]);
						insertIndex = rowIndex+1;
					break;
					case 'left':
						rowNum = parseFloat(jQuery(over_image).attr('data-row'));
						
						insertIndex = overImageIndex;
					break;
					case 'right':
						rowNum = parseFloat(jQuery(over_image).attr('data-row'));
						
						insertIndex = overImageIndex+1;
					break;
				}
				
				const removeIndex = jQuery(images).index(this.dragging);
				if(removeIndex < insertIndex) insertIndex--;
				
				const att_images = this.getAttImagesCopy();
				let att_img = this.getAttImgCopy(att_images, removeIndex);
				att_img.row = rowNum;
				
				att_images.splice(removeIndex, 1);
				att_images.splice(insertIndex, 0, att_img);
				
				this.props.setAttributes({
				    images: att_images
				});
			}
		
			window.dragGallery.renderRows();
			
			//Scroll the page to dragging image
			const self = this;
			const scrollTarget = this.dragging;
			let scrollOffset = jQuery(scrollTarget).position().top;
			jQuery(scrollTarget).parents().each(function(index) {
			    
			    const scrollerclass = self.scrollSelector.slice(1);
			    const el = jQuery(this);
			    
			    if(el.hasClass(scrollerclass)
			    || el.parent().hasClass(scrollerclass)) {
			        return false;
			    }else{
			        scrollOffset += el.position().top;
			    }
			});
			this.anim_scroll(Math.abs(scrollOffset));
		}
		
		clearInterval(this.dragScrollObj.int);
		
		jQuery(document).off('mousemove', this.imageMove);
		jQuery(document).off('mouseup', this.imageUp);
		
		jQuery('.drag-gallery').removeClass('dg-dragging').removeData('dragready').removeData('dragging');
		
		jQuery(images)
		.removeClass('dragging over-image over-image-row')
		.css('transform', '');
	}

}