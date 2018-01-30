require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

//get the json data of images
var imagesData = require('../data/imagesData.json');

/**
 * @imagesDataArray  {Array}
 * @return {Array}
 */
imagesData = (function getImageURL(imagesDataArray) {
	for (var i = 0, j = imagesDataArray.length; i < j; i++) {
		var singleImageData = imagesDataArray[i];

		singleImageData.imageURL = require('../images/' + singleImageData.fileName);

		imagesDataArray[i] = singleImageData;
	}
	return imagesDataArray;
})(imagesData);

class AppComponent extends React.Component {
	render() {
		return (
			<section className="stage">
				<section className="img-sec">
				</section>
				<nav className="controller-nav">
				</nav>
			</section>
		);
	}
}

AppComponent.defaultProps = {};

export default AppComponent;