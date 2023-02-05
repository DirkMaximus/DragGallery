/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!****************************!*\
  !*** ./src/draggallery.js ***!
  \****************************/
class DragGallery {
  constructor() {
    /*
    //console.log('jQuery: ' + jQuery);
    //console.log('$: ' + $);
    
    try{
    	if(jQuery) {
    		this.jQuery = jQuery;
    	}else{
    		console.log('jQuery not found');
    	}
    }catch(e) {
    	console.log('jQuery not found');
    }
    
    if(!this.jQuery) {
    	try{
    		if($ && $.jquery) {
    			this.jQuery = $;
    		}else{
    			console.log('$ not found');
    		}
    	}catch(e) {
    		console.log('$ not found');
    	}
    }
    */
    if (jQuery) {
      this.renderRows = this.renderRows.bind(this);
      this.waitForImages = this.waitForImages.bind(this);
      this.imgLoad = this.imgLoad.bind(this);
      jQuery(window).on('resize orientationchange', this.renderRows);
      jQuery(document).ready(this.waitForImages);
      jQuery(window).on('load', this.waitForImages);
      this.waitForImages();
    }
  }

  waitForImages() {
    this.renderRows();
    const self = this;
    jQuery('.drag-gallery img').each(function (index) {
      //if(!jQuery(this).data('imgLoadListening')) {
      //jQuery(this).data('imgLoadListening', true);
      jQuery(this).one("load", self.imgLoad);

      try {
        if (this.complete) jQuery(this).trigger('load');
      } catch (e) {//console.log(e);
      } //}

    });
  }

  imgLoad(e) {
    this.renderRows();
    const gallery = jQuery(e.target).parents('.drag-gallery')[0];
    let ready = true;
    jQuery(gallery).find('img').each(function (index) {
      if (!this.complete && this.naturalWidth > 0) {
        jQuery(this).addClass('loaded');
        ready = false;
        return false;
      }
    });

    if (ready) {
      jQuery(gallery).removeClass('loading');
      jQuery(gallery).find('img').removeClass('loaded'); //this.renderRows();
    }
  }

  getREM() {
    return parseFloat(jQuery(':root').css('font-size').replace('px', ''));
  }
  /*
  Get an array of all image elements in a row
  @param gallery(element): .drag-gallery element
  @param row_num(int): if row_image is null, row_num can be used instead
  */


  getRow(gallery, row_num) {
    let row_image_arr = new Array();
    let images = jQuery(gallery).find('.image');

    for (let i = 0; i < images.length; i++) {
      const image = images[i];

      if (parseFloat(jQuery(image).attr('data-row')) == row_num) {
        row_image_arr.push(image);
      }
    }

    return row_image_arr;
  }

  renderRows() {
    const self = this;
    jQuery('.drag-gallery').each(function (index) {
      const images = jQuery(this).find('.image'); //Get all rows as arrays

      const rows = new Array();

      for (let i = 0; i < images.length; i++) {
        const row_num = parseFloat(jQuery(images[i]).attr('data-row'));
        let in_row = false;

        for (let j = 0; j < rows.length; j++) {
          if (rows[j].row_num == row_num) {
            in_row = true;
          }
        }

        if (!in_row) {
          rows.push({
            row_num: row_num,
            images: self.getRow(this, parseFloat(jQuery(images[i]).attr('data-row')))
          });
        }
      } //Render each row


      for (let i = 0; i < rows.length; i++) {
        const row = rows[i].images;
        self.renderRow(row);
      }
    });
  }

  getNaturalDimensions(img) {
    let naturalWidth = img.naturalWidth;

    if (!naturalWidth) {
      naturalWidth = 6;
    }

    let naturalHeight = img.naturalHeight;

    if (!naturalHeight) {
      naturalHeight = 9;
    }

    return {
      naturalWidth: naturalWidth,
      naturalHeight: naturalHeight
    };
  }

  renderRow(row) {
    if (row.length == 1) {
      const image = row[0];
      const gallery = jQuery(image).parents('.drag-gallery')[0];
      const width = jQuery(image).parent().innerWidth() - this.getSpaceX(gallery);
      const img = jQuery(image).find('img')[0];
      const naturalDimensions = this.getNaturalDimensions(img);
      jQuery(image).css('width', '').css('flex-basis', '').css('height', width * (naturalDimensions.naturalHeight / naturalDimensions.naturalWidth) + 'px');
    } else {
      const gallery = jQuery(row[0]).parents('.drag-gallery'); //const cWidth = jQuery(gallery).find('.wrapper').innerWidth();

      const wrapper = jQuery(gallery).find('.wrapper')[0];
      const wrapper_rect = wrapper.getBoundingClientRect();
      const cWidth = wrapper_rect.width;
      var self = this; // Generate array containing all image aspect ratios

      var ratios = row.map(function (image, i) {
        let ratio = 0;
        const img = jQuery(image).find('img')[0];
        const naturalDimensions = self.getNaturalDimensions(img);
        ratio = naturalDimensions.naturalWidth / naturalDimensions.naturalHeight;
        return ratio;
      }); // Get sum of widths

      let minRatio = Math.min.apply(Math, ratios);
      let sumRatios = 0;

      for (let i = 0; i < row.length; i++) {
        const ratio = ratios[i];
        if (ratio != 0) sumRatios += ratio / minRatio;
      }

      ;
      let sumMargins = row.length * this.getSpaceX(gallery); // Calculate dimensions

      if (sumRatios != 0) {
        for (let i = 0; i < row.length; i++) {
          const image = row[i];
          const minWidth = (cWidth - sumMargins) / sumRatios;
          const width = Math.floor(minWidth / minRatio) * ratios[i];
          const height = Math.floor(minWidth / minRatio);
          jQuery(image).css('height', height + 'px').css('width', width + 'px').css('flex-basis', width + 'px');
        }

        ;
      }
    }
  }

  getSpaceY(gallery) {
    /*
    let spaceY = 0;
    		const gridSpacing = jQuery('.drag-gallery').css('--gridSpacing');
    if(gridSpacing.endsWith('rem')) {
    	spaceY = parseFloat(gridSpacing.replace('rem', '')) * this.getREM();
    } else if(gridSpacing.endsWith('px')) {
    	spaceY = parseFloat(gridSpacing.replace('px', ''));
    } else {
    	switch(jQuery(gallery).css('display')) {
    		case 'grid':
    			spaceY = parseFloat(jQuery(gallery).find('.image').eq(0).css('grid-row-gap').replace('px', ''));
    			break;
    		default:
    			spaceY = parseFloat(jQuery(gallery).find('.image').eq(0).css('margin-bottom').replace('px', ''));
    			break;
    	}
    }
    */
    let spaceY = 0;

    if (gallery) {
      const gridSpacing = jQuery(gallery).css('--gridSpacing');

      if (gridSpacing && gridSpacing != '') {
        spaceY = this.convertCssUnit(gridSpacing, gallery);
      } else {
        spaceY = parseFloat(jQuery(gallery).find('.image').eq(0).css('margin-bottom').replace('px', ''));
      }
    }

    return spaceY;
  }

  getSpaceX(gallery) {
    /*
    let spaceX = 0;
    		const gridSpacing = jQuery('.drag-gallery').css('--gridSpacing');
    if(gridSpacing.endsWith('rem')) {
    	spaceX = parseFloat(gridSpacing.replace('rem', '')) * this.getREM();
    } else if(gridSpacing.endsWith('px')) {
    	spaceX = parseFloat(gridSpacing.replace('px', ''));
    } else {
    	switch(jQuery(gallery).css('display')) {
    		case 'grid':
    			spaceX = parseFloat(jQuery(gallery).find('.image').eq(0).css('grid-column-gap').replace('px', ''));
    			break;
    		default:
    			spaceX = parseFloat(jQuery(gallery).find('.image').eq(0).css('margin-right').replace('px', ''));
    			break;
    	}
    }
    */
    let spaceX = 0;

    if (gallery) {
      const gridSpacing = jQuery(gallery).css('--gridSpacing');

      if (gridSpacing && gridSpacing != '') {
        spaceX = this.convertCssUnit(gridSpacing, gallery);
      } else {
        spaceX = parseFloat(jQuery(gallery).find('.image').eq(0).css('margin-right').replace('px', ''));
      }
    }

    return spaceX;
  }
  /**
   * Convert absolute CSS numerical values to pixels.
   *
   * @link https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units#numbers_lengths_and_percentages
   *
   * @param {string} cssValue
   * @param {null|HTMLElement} target Used for relative units.
   * @return {*}
   */


  convertCssUnit(cssValue, target) {
    target = target || document.body;
    const supportedUnits = {
      // Absolute sizes
      'px': value => value,
      'cm': value => value * 38,
      'mm': value => value * 3.8,
      'q': value => value * 0.95,
      'in': value => value * 96,
      'pc': value => value * 16,
      'pt': value => value * 1.333333,
      // Relative sizes
      'rem': value => value * parseFloat(getComputedStyle(document.documentElement).fontSize),
      'em': value => value * parseFloat(getComputedStyle(target).fontSize),
      'vw': value => value / 100 * window.innerWidth,
      'vh': value => value / 100 * window.innerHeight,
      // Times
      'ms': value => value,
      's': value => value * 1000,
      // Angles
      'deg': value => value,
      'rad': value => value * (180 / Math.PI),
      'grad': value => value * (180 / 200),
      'turn': value => value * 360
    }; // Match positive and negative numbers including decimals with following unit

    const pattern = new RegExp(`^([\-\+]?(?:\\d+(?:\\.\\d+)?))(${Object.keys(supportedUnits).join('|')})$`, 'i'); // If is a match, return example: [ "-2.75rem", "-2.75", "rem" ]

    const matches = String.prototype.toString.apply(cssValue).trim().match(pattern);

    if (matches) {
      const value = Number(matches[1]);
      const unit = matches[2].toLocaleLowerCase(); // Sanity check, make sure unit conversion function exists

      if (unit in supportedUnits) {
        return supportedUnits[unit](value);
      }
    }

    return cssValue;
  }

}

document.addEventListener('DOMContentLoaded', function () {
  window.dragGallery = new DragGallery();
}, false);
/******/ })()
;
//# sourceMappingURL=draggallery.js.map