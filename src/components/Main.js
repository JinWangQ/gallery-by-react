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

class ImgFigure extends React.Component {
	render() {
		return (
			<figure className="img-figure">
				<img src={this.props.data.imageURL}
					alt={this.props.data.title}
				/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
				</figcaption>
			</figure>
		);
	}
}

class AppComponent extends React.Component {
	render() {
		/* declare 2 units*/
		var controllerUnits = [],
			imgFigures = [];

		Array.prototype.forEach.call(imagesData, function(value) {
			imgFigures.push(<ImgFigure data={value} />);
		});

		return (
			<section className="stage">
				<section className="img-sec">
					{imgFigures}
				</section>
				<nav className="controller-nav">
					{controllerUnits}
				</nav>
			</section>
		);
	}
}

AppComponent.defaultProps = {};

export default AppComponent;