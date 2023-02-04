/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/DragGalleryEdit.js":
/*!********************************!*\
  !*** ./src/DragGalleryEdit.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DragGalleryEdit)
/* harmony export */ });
class DragGalleryEdit {
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

    if (!clientX) {
      var touches;

      if (e.touches && e.touches.length > 0) {
        touches = e.touches;
      } else if (e.originalEvent.touches && e.originalEvent.touches.length > 0) {
        touches = e.originalEvent.touches;
      }

      if (touches) {
        if (referencePos) {
          var closest = touches[0];
          var closest_dist = getDistance(referencePos, {
            x: touches[0].clientX,
            y: touches[0].clientY
          });

          for (var i = 1; i < touches.length; i++) {
            var dist = getDistance(referencePos, {
              x: touches[i].clientX,
              y: touches[i].clientY
            });

            if (dist < closest_dist) {
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
    if (time == null) time = 600;
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
    let row_image_arr = new Array(); //let images = jQuery(gallery).find('.image, .placeholder.current');

    let images = jQuery(gallery).find('.image');

    for (let i = 0; i < images.length; i++) {
      const image = images[i];

      if (parseFloat(jQuery(image).attr('data-row')) == row_num) {
        row_image_arr.push(image);
      }
    }

    return row_image_arr;
  }

  removeFromRow(arr, image) {
    for (let i = 0; i < arr.length; i++) {
      if (image === arr[i]) {
        arr.splice(i, 1);
        break;
      }
    }

    return arr;
  }

  getNextAvailableRow(gallery) {
    let next = 1;
    const self = this;
    jQuery(gallery).find('.image').each(function (index) {
      const rowNum = parseFloat(jQuery(this).attr('data-row'));
      if (rowNum >= next) next = rowNum + 1;
    });
    return next;
  }

  getAttImagesCopy() {
    return this.props.attributes.images.map(x => x);
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

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const image_rect = image.getBoundingClientRect();

      if (this.clientPos.y < image_rect.bottom && this.clientPos.y > image_rect.top) {
        overY_image = image;
        break;
      } //See if drag is above this image / between this image and the previous one


      if (!overY_image) {
        if (this.clientPos.y < image_rect.top) {
          if (i == 0) {
            overY_image = image;
            break;
          } else {
            const prev_image = images[i - 1];
            const prev_rect = prev_image.getBoundingClientRect();
            const dist_prev = this.clientPos.y - prev_rect.bottom;
            const dist = image_rect.top - this.clientPos.y;

            if (Math.abs(dist_prev) < Math.abs(dist)) {
              overY_image = prev_image;
            } else {
              overY_image = image;
            }

            break;
          }
        }
      } //If this is the last image, see if drag is below


      if (!overY_image) {
        if (i == images.length - 1) {
          overY_image = image;
          break;
        }
      }
    }

    const row = window.dragGallery.getRow(gallery, parseFloat(jQuery(overY_image).attr('data-row')));

    for (let i = 0; i < row.length; i++) {
      const image = row[i];
      const image_rect = image.getBoundingClientRect();

      if (this.clientPos.x < image_rect.right && this.clientPos.x > image_rect.left) {
        over_image = image;
        break;
      } //See if drag is left of this image / between this image and the previous one


      if (!over_image) {
        if (this.clientPos.x < image_rect.left) {
          if (i == 0) {
            over_image = image;
            break;
          } else {
            const prev_image = row[i - 1];
            const prev_rect = prev_image.getBoundingClientRect();
            const dist_prev = this.clientPos.x - prev_rect.right;
            const dist = image_rect.left - this.clientPos.x;

            if (Math.abs(dist_prev) < Math.abs(dist)) {
              over_image = prev_image;
            } else {
              over_image = image;
            }

            break;
          }
        }
      } //If this is the last image, see if drag is below


      if (!over_image) {
        if (i == row.length - 1) {
          over_image = image;
          break;
        }
      }
    }

    return over_image;
  } //TO DO: change direc so that it only returns value at edges.


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

    if (Math.abs(dist_bottom) < Math.abs(dist_top)) {
      closestY = {
        loc: 'bottom',
        dist: dist_bottom
      };
    }

    let closestX = {
      loc: 'left',
      dist: dist_left
    };

    if (Math.abs(dist_right) < Math.abs(dist_left)) {
      closestX = {
        loc: 'right',
        dist: dist_right
      };
    }

    let direc;

    if (closestY.dist < 0 && closestX.dist < 0) {
      //outside
      if (closestY.dist < closestX.dist) {
        direc = closestY.loc;
      } else {
        direc = closestX.loc;
      }
    } else if (closestY.dist < 0) {
      //outside
      direc = closestY.loc;
    } else if (closestX.dist < 0) {
      //outside
      direc = closestX.loc;
    } else {
      //inside
      if (Math.abs(closestY.dist) < Math.abs(closestX.dist)) {
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
    jQuery(gallery).data('dragready', true).data('dragging', false); //Record the clicked item

    this.dragging = e.currentTarget; //Save the click position

    const clientPos = this.getClientPos(e);
    jQuery(gallery).data('downClientPos', clientPos);
    jQuery(document).on('mousemove', this.imageMove);
    jQuery(document).on('mouseup', this.imageUp);
  }

  imageMove(e) {
    const gallery = jQuery('.drag-gallery.dg-dragging')[0];
    this.clientPos = this.getClientPos(e);
    let drag;

    if (jQuery(gallery).data('dragready') && !jQuery(gallery).data('dragging')) {
      this.downClientPos = jQuery(gallery).data('downClientPos');
      const distX = this.clientPos.x - this.downClientPos.x;
      const distY = this.clientPos.y - this.downClientPos.y;
      let dist = distX;
      if (Math.abs(distY) > Math.abs(distX)) dist = distY;

      if (Math.abs(dist) > this.MIN_DRAG) {
        jQuery(gallery).data('dragging', true); //Create drag image

        drag = document.createElement('div');
        jQuery(drag).data('gallery', gallery);
        jQuery(drag).addClass('drag-image'); //jQuery(drag).css('width', jQuery(e.currentTarget).outerWidth() / 2 + 'px');

        jQuery(drag).append(jQuery(this.dragging).find('img').clone());
        jQuery('body').append(drag); //Fade the dragging image

        jQuery(this.dragging).addClass('dragging');
      }
    }

    if (jQuery(gallery).data('dragging')) {
      const drag = jQuery('.drag-image');
      jQuery(drag).offset({
        top: this.clientPos.y - jQuery(drag).outerHeight() / 2,
        left: this.clientPos.x - jQuery(drag).outerWidth() / 2
      }); //Scroll the page if dragged to top or bottom

      const screenHeight = window.innerHeight;
      let speed = 0;
      const screenMarginPercent = .15;

      if (this.clientPos.y < screenHeight * screenMarginPercent) {
        speed = this.clientPos.y - screenHeight * screenMarginPercent;
      } else if (this.clientPos.y > screenHeight * (1 - screenMarginPercent)) {
        speed = this.clientPos.y - screenHeight * (1 - screenMarginPercent);
      }

      clearInterval(this.dragScrollObj.int);

      if (speed) {
        this.dragScrollObj = {
          int: setInterval(this.dragScroll, 10),
          speed: speed / 2
        };
      } //insert the dragging image into the appropriate grid location
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

      if (over_image == this.dragging && (overImageRow.length == 1 || direc == 'right' || direc == 'left')) {
        //Ignore this dragover IF:
        //over_image is also this.dragging
        //AND over_image is in its own row
        //OR over_image shares its row AND direc is left/right
        jQuery(images).css('transform', '');
      } else {
        switch (direc) {
          case 'top':
            jQuery(images).each(function (index) {
              if (overImageRow.includes(this)) {
                jQuery(this).css('transform', 'translate3d(0, ' + window.dragGallery.getREM() + 'px, 0)');
              } else if (index < overImageIndex) {
                jQuery(this).css('transform', 'translate3d(0, ' + window.dragGallery.getREM() * -1 + 'px, 0)');
              } else {
                jQuery(this).css('transform', 'translate3d(0, ' + window.dragGallery.getREM() + 'px, 0)');
              }
            });
            break;

          case 'bottom':
            jQuery(images).each(function (index) {
              if (overImageRow.includes(this)) {
                jQuery(this).css('transform', 'translate3d(0, ' + window.dragGallery.getREM() * -1 + 'px, 0)');
              } else if (index <= overImageIndex) {
                jQuery(this).css('transform', 'translate3d(0, ' + window.dragGallery.getREM() * -1 + 'px, 0)');
              } else {
                jQuery(this).css('transform', 'translate3d(0, ' + window.dragGallery.getREM() + 'px, 0)');
              }
            });
            break;

          case 'right':
            jQuery(images).each(function (index) {
              if (!overImageRow.includes(this)) {
                jQuery(this).css('transform', '');
              }
            });

            for (let i = 0; i < overImageRow.length; i++) {
              if (i <= overImageRowIndex) {
                jQuery(overImageRow[i]).css('transform', 'translate3d(' + window.dragGallery.getREM() * -2 + 'px, 0, 0)');
              } else {
                jQuery(overImageRow[i]).css('transform', 'translate3d(' + window.dragGallery.getREM() * 2 + 'px, 0, 0)');
              }
            }

            break;

          case 'left':
            jQuery(images).each(function (index) {
              if (!overImageRow.includes(this)) {
                jQuery(this).css('transform', '');
              }
            });

            for (let i = 0; i < overImageRow.length; i++) {
              if (i < overImageRowIndex) {
                jQuery(overImageRow[i]).css('transform', 'translate3d(' + window.dragGallery.getREM() * -2 + 'px, 0, 0)');
              } else {
                jQuery(overImageRow[i]).css('transform', 'translate3d(' + window.dragGallery.getREM() * 2 + 'px, 0, 0)');
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

    if (dragging) {
      const drag = jQuery('.drag-image');
      const over_image = this.getOverImage();
      const overImageIndex = jQuery(images).index(over_image);
      const overImageRowNum = parseFloat(jQuery(over_image).attr('data-row'));
      const overImageRow = this.getRow(gallery, overImageRowNum);
      const overImageRowIndex = overImageRow.indexOf(over_image);
      const direc = this.getOverDirec(over_image);
      jQuery(drag).remove();

      if (over_image == this.dragging && (overImageRow.length == 1 || direc == 'right' || direc == 'left')) {//no drop
      } else {
        let rowNum;
        let rowIndex;
        let insertIndex;

        switch (direc) {
          case 'top':
            rowNum = window.dragGalleryEdit.getNextAvailableRow(gallery);
            rowIndex = jQuery(images).index(overImageRow[0]);
            insertIndex = rowIndex;
            break;

          case 'bottom':
            rowNum = window.dragGalleryEdit.getNextAvailableRow(gallery);
            rowIndex = jQuery(images).index(overImageRow[overImageRow.length - 1]);
            insertIndex = rowIndex + 1;
            break;

          case 'left':
            rowNum = parseFloat(jQuery(over_image).attr('data-row'));
            insertIndex = overImageIndex;
            break;

          case 'right':
            rowNum = parseFloat(jQuery(over_image).attr('data-row'));
            insertIndex = overImageIndex + 1;
            break;
        }

        const removeIndex = jQuery(images).index(this.dragging);
        if (removeIndex < insertIndex) insertIndex--;
        const att_images = this.getAttImagesCopy();
        let att_img = this.getAttImgCopy(att_images, removeIndex);
        att_img.row = rowNum;
        att_images.splice(removeIndex, 1);
        att_images.splice(insertIndex, 0, att_img);
        this.props.setAttributes({
          images: att_images
        });
      }

      window.dragGallery.renderRows(); //Scroll the page to dragging image

      const self = this;
      const scrollTarget = this.dragging;
      let scrollOffset = jQuery(scrollTarget).position().top;
      jQuery(scrollTarget).parents().each(function (index) {
        const scrollerclass = self.scrollSelector.slice(1);
        const el = jQuery(this);

        if (el.hasClass(scrollerclass) || el.parent().hasClass(scrollerclass)) {
          return false;
        } else {
          scrollOffset += el.position().top;
        }
      });
      this.anim_scroll(Math.abs(scrollOffset));
    }

    clearInterval(this.dragScrollObj.int);
    jQuery(document).off('mousemove', this.imageMove);
    jQuery(document).off('mouseup', this.imageUp);
    jQuery('.drag-gallery').removeClass('dg-dragging').removeData('dragready').removeData('dragging');
    jQuery(images).removeClass('dragging over-image over-image-row').css('transform', '');
  }

}

/***/ }),

/***/ "./src/DragGalleryImage.js":
/*!*********************************!*\
  !*** ./src/DragGalleryImage.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DragGalleryImage)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);


const {
  Component,
  Fragment
} = wp.element;
const {
  MediaUpload,
  MediaUploadCheck
} = wp.blockEditor;
const {
  Button,
  IconButton,
  Toolbar,
  ToolbarGroup,
  ToolbarButton
} = wp.components;
class DragGalleryImage extends Component {
  constructor(props) {
    super(props);
    this.el = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createRef)();
    this.imageDown = this.imageDown.bind(this);
    this.imageClick = this.imageClick.bind(this);
    this.replaceImage = this.replaceImage.bind(this);
    this.linkClick = this.linkClick.bind(this);
    this.linkCancel = this.linkCancel.bind(this);
    this.linkUpdate = this.linkUpdate.bind(this);
  }

  getArrayCopy(arr) {
    return arr.map(x => x);
  }

  getObjectCopy(obj) {
    return Object.assign({}, obj);
  } //TO DO: fix right click


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
    this.props.parentprops.setAttributes({
      images: att_images
    });
    window.dragGallery.waitForImages();
  }

  linkClick(e) {
    const image = jQuery(e.currentTarget).parents('.image')[0];
    const linksettings = jQuery(image).find('.linksettings')[0]; //Set the checked status
    //TO DO: move this to componentDidMount?

    let linkoption_none_checked = false;
    let linkoption_image_checked = false;
    let linkoption_custom_checked = false;

    switch (this.props.data.linktype) {
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
    const linkoption_none_input = jQuery(linksettings).find('input#' + fieldIds.linkoption_none_id)[0];
    const linkoption_image_input = jQuery(linksettings).find('input#' + fieldIds.linkoption_image_id)[0];
    const linkoption_custom_input = jQuery(linksettings).find('input#' + fieldIds.linkoption_custom_id)[0];
    jQuery(linkoption_none_input).prop('checked', linkoption_none_checked);
    jQuery(linkoption_image_input).prop('checked', linkoption_image_checked);
    jQuery(linkoption_custom_input).prop('checked', linkoption_custom_checked);

    if (jQuery(linksettings).hasClass('open')) {
      jQuery(linksettings).removeClass('open');
    } else {
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
    const selected_input = jQuery(linksettings).find('input[name=' + fieldIds.linkoption_group_id + ']:checked')[0];
    const customurl_input = jQuery(linksettings).find('input#' + fieldIds.customlink_id)[0];

    if (selected_input) {
      const val = jQuery(selected_input).val();
      item.linktype = val;

      switch (val) {
        case 'url':
          item.link = jQuery(customurl_input).val();
          break;
      }
    } else {} //Save changes


    const images = this.getArrayCopy(this.props.parentprops.attributes.images);
    images[index] = item;
    this.props.parentprops.setAttributes({
      images: images
    }); //Close popup

    jQuery(e.currentTarget).parents('.linksettings').removeClass('open');
  }

  getFieldIds() {
    const clientId = this.props.parentprops.clientId;
    const imageId = this.props.data.imageID;
    return {
      linkoption_group_id: 'linkoption_' + clientId + '_' + imageId,
      linkoption_none_id: 'linkoption_' + clientId + '_' + imageId + '_none',
      linkoption_image_id: 'linkoption_' + clientId + '_' + imageId + '_image',
      linkoption_custom_id: 'linkoption_' + clientId + '_' + imageId + '_custom',
      customlink_id: 'customlink_' + clientId + '_' + imageId
    };
  }

  renderToolbar() {
    const clientId = this.props.parentprops.clientId;
    const imageId = this.props.data.imageID;
    const fieldIds = this.getFieldIds();
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "imagetoolbar"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Toolbar, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(ToolbarButton, {
      label: "Link",
      icon: () => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
        className: "dashicons dashicons-admin-links"
      }),
      className: "link",
      onClick: this.linkClick
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(MediaUploadCheck, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(MediaUpload, {
      allowedTypes: ['image'],
      multiple: false,
      gallery: false,
      onSelect: this.replaceImage,
      render: _ref => {
        let {
          open
        } = _ref;
        return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(ToolbarButton, {
          label: "Change Image",
          icon: () => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
            className: "dashicons dashicons-format-image"
          }),
          className: "change",
          onClick: open
        });
      }
    }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "linksettings"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "item"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "content"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
      type: "radio",
      id: fieldIds.linkoption_none_id,
      name: fieldIds.linkoption_group_id,
      defaultValue: "none"
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
      for: fieldIds.linkoption_none_id
    }, "No link"))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "item"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "content"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
      type: "radio",
      id: fieldIds.linkoption_image_id,
      name: fieldIds.linkoption_group_id,
      defaultValue: "image"
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
      for: fieldIds.linkoption_image_id
    }, "Link to image"))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "item"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "content grow"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
      type: "radio",
      id: fieldIds.linkoption_custom_id,
      name: fieldIds.linkoption_group_id,
      defaultValue: "url"
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
      type: "text",
      id: fieldIds.customlink_id,
      name: fieldIds.customlink_id,
      value: this.props.link,
      placeholder: "Custom URL"
    }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "item right"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "content"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
      onClick: this.linkUpdate
    }, "Update link"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
      onClick: this.linkCancel
    }, "Cancel")))));
  }

  render() {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ref: this.el,
      className: "image",
      "data-imageid": this.props.data.imageID,
      "data-row": this.props.data.row,
      onMouseDown: this.imageDown,
      onClick: this.imageClick
    }, this.renderToolbar(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
      src: this.props.data.url,
      "data-id": this.props.data.id
    }));
  }

}

/***/ }),

/***/ "./src/edit.js":
/*!*********************!*\
  !*** ./src/edit.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _DragGalleryImage_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DragGalleryImage.js */ "./src/DragGalleryImage.js");



const {
  Component,
  Fragment
} = wp.element;
const {
  MediaUpload,
  MediaUploadCheck
} = wp.blockEditor;
const {
  Button
} = wp.components;
function Edit(props) {
  //const [selected, setSelected] = useState(null);
  //props.setAttributes({el: createRef()});
  function getArrayCopy(arr) {
    return arr.map(x => x);
  }

  function getObjectCopy(obj) {
    return Object.assign({}, obj);
  }

  function selectImage(media) {
    var newImages = new Array();
    let imageID = getNextAvailableID();
    let row = getNextAvailableRow();

    if (media.length) {
      //Array of images

      /*
      BUG: Function is called twice.
      For now, see if the last media.length items in attributes.images match the media items.
      If so, skip the operation.
      */
      let match = true;
      const offset = props.attributes.images.length - media.length;

      if (offset >= 0) {
        for (let i = props.attributes.images.length - (1 + media.length); i < props.attributes.images - 1; i++) {
          if (props.attributes.images[i].id != media[i - offset].id) {
            match = false;
            break;
          }
        }
      } else {
        match = false;
      }

      if (!match) {
        for (let i = 0; i < media.length; i++) {
          newImages.push({
            id: media[i].id,
            url: media[i].url,
            imageID: imageID + i,
            row: row + i,
            linktype: 'image',
            link: null
          });
        }
      }
    } else {
      //Single image
      if (lastImage.id != media.id) {
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
    props.setAttributes({
      images: images
    });
    window.dragGallery.waitForImages();
  }

  function getNextAvailableID() {
    let next = 1;

    for (let i = 0; i < props.attributes.images.length; i++) {
      if (props.attributes.images[i].imageID >= next) next = props.attributes.images[i].imageID + 1;
    }

    return next;
  }

  function getNextAvailableRow() {
    let next = 1;

    for (let i = 0; i < props.attributes.images.length; i++) {
      if (props.attributes.images[i].row >= next) next = props.attributes.images[i].row + 1;
    }

    return next;
  } //window.dragGalleryEdit.setAttributeObject(this.props);


  setTimeout(function () {
    window.dragGallery.waitForImages();
  }, 0);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "drag-gallery",
    "data-blockid": props.clientId
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wrapper"
  }, props.attributes.images.map(function (item, i) {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_DragGalleryImage_js__WEBPACK_IMPORTED_MODULE_2__["default"], {
      key: i,
      data: item,
      parentprops: props
    });
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(MediaUploadCheck, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(MediaUpload, {
    allowedTypes: ['image'],
    multiple: true,
    gallery: true,
    onSelect: selectImage,
    render: _ref => {
      let {
        open
      } = _ref;
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Button, {
        className: "addmedia",
        onClick: open
      }, "Add Images");
    }
  })));
}

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.css */ "./src/style.css");
/* harmony import */ var _editor_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./editor.css */ "./src/editor.css");
/* harmony import */ var _edit_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./edit.js */ "./src/edit.js");
/* harmony import */ var _DragGalleryEdit_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./DragGalleryEdit.js */ "./src/DragGalleryEdit.js");
/* harmony import */ var _save_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./save.js */ "./src/save.js");
/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor. All other files
 * get applied to the editor only.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */



/**
 * Internal dependencies
 */




document.addEventListener('DOMContentLoaded', function () {
  window.dragGalleryEdit = new _DragGalleryEdit_js__WEBPACK_IMPORTED_MODULE_4__["default"]();
}, false);
/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */

(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)('create-block/drag-gallery', {
  /**
   * Used to construct a preview for the block to be shown in the block inserter.
   */
  example: {
    attributes: {
      message: 'Drag Gallery'
    }
  },

  /**
   * @see ./edit.js
   */
  edit: _edit_js__WEBPACK_IMPORTED_MODULE_3__["default"],

  /**
   * @see ./save.js
   */
  save: _save_js__WEBPACK_IMPORTED_MODULE_5__["default"]
});

/***/ }),

/***/ "./src/save.js":
/*!*********************!*\
  !*** ./src/save.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ save)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);


/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */

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

function save(_ref) {
  let {
    attributes
  } = _ref;
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save();
  setTimeout(function () {
    window.dragGallery.waitForImages();
  }, 0);
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "drag-gallery loading"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wrapper"
  }, attributes.images.map(function (item, i) {
    let image;

    switch (item.linktype) {
      case 'image':
        image = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
          href: item.url
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
          src: item.url,
          "data-id": item.id
        }));
        break;

      case 'url':
        image = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
          href: item.link
        }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
          src: item.url,
          "data-id": item.id
        }));
        break;

      case 'none':
      default:
        image = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
          src: item.url,
          "data-id": item.id
        });
        break;
    }

    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "image",
      key: item.imageID,
      "data-imageid": item.imageID,
      "data-row": item.row
    }, image);
  })));
}

/***/ }),

/***/ "./src/editor.css":
/*!************************!*\
  !*** ./src/editor.css ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var chunkIds = deferred[i][0];
/******/ 				var fn = deferred[i][1];
/******/ 				var priority = deferred[i][2];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"index": 0,
/******/ 			"./style-index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkdrag_gallery"] = self["webpackChunkdrag_gallery"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-index"], () => (__webpack_require__("./src/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map