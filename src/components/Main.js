require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

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

/**
 * @param  {min}
 * @param  {max}
 * @return {random between min and max}
 */
function getRangeRandom(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}

class ImgFigure extends React.Component {
	render() {
		var styleObj = {};

		//if props assigns the position of pic, use it
		if (this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
		}

		return (
			<figure className="img-figure" style={styleObj}>
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
	constructor(props) {
		super(props);
		this.Constant = {
			centerPos: { //center
				left: 0,
				top: 0
			},
			hPosRange: { //left and right sec position
				leftSecX: [0, 0],
				rightSecX: [0, 0],
				y: [0, 0]
			},
			vPosRange: { //up sec position
				x: [0, 0],
				topY: [0, 0]
			}
		};
		this.state = {
			imgArrangeArr: [
				// {
				// 	pos: {
				// 		left: '0',
				// 		top: '0'
				// 	}
				// }
			]
		};
	}


	/**
	 * rearrange all the pictures
	 * @param  {the index of pic to be centered}
	 * @return {[type]}
	 */
	rearrange(centerIndex) {
		let imgArrangeArr = this.state.imgArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRigheSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,

			imgArrangeTopArr = [],
			topImgNum = Math.floor(Math.random() * 2), // there would be 1 or 2 pics in top sec
			topImgSpliceIndex = 0, //the index of pic at top sec

			imgArrangeCenterArr = imgArrangeArr.splice(centerIndex, 1);

		// let the centerIndex in the center
		imgArrangeCenterArr[0].pos = centerPos;

		//get the info of pics in up sec
		topImgSpliceIndex = Math.floor(Math.random() * (imgArrangeArr.length - topImgNum));
		imgArrangeTopArr = imgArrangeArr.splice(topImgSpliceIndex, topImgNum);

		//let pics in the up sec positioned
		imgArrangeTopArr.forEach(function(value, index) {
			imgArrangeTopArr[index].pos = {
				top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
				left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
			}
		});

		// let pics in the left and right sec positioned
		// now imgArrangeArr only has pics to be position in left and right sec
		for (var i = 0, j = imgArrangeArr.length, k = j / 2; i < j; i++) {
			let hPosRangeLORX = null;

			//first half pics at left
			//rest pics at right
			if (i < k) {
				hPosRangeLORX = hPosRangeLeftSecX;
			} else {
				hPosRangeLORX = hPosRangeRigheSecX;
			}

			imgArrangeArr[i].pos = {
				left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1]),
				top: getRangeRandom(hPosRangeY[0], hPosRangeY[1])
			}
		}

		if (imgArrangeTopArr && imgArrangeTopArr[0]) {
			imgArrangeArr.splice(topImgSpliceIndex, 0, imgArrangeTopArr[0]);
		}

		imgArrangeArr.splice(centerIndex, 0, imgArrangeCenterArr[0]);

		this.setState({
			imgArrangeArr: imgArrangeArr
		})
	}
	/**
	 * while component did mount
	 * calculate their position range
	 */
	componentDidMount() {
		//get the size of stage
		let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.ceil(stageW / 2),
			halfStageH = Math.ceil(stageH / 2);
		//get the size of one photo
		let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2);
		//calculate the position for the central photo
		this.Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
		}
		//calculate the range of posiztion for the left and right sec
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;

		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;

		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;
		//calculate the range of position for up sec
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;

		this.Constant.vPosRange.topY[0] = 0 - halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
		//let the first pic at center
		this.rearrange(0);
	}


	render() {
		/* declare 2 units*/
		var controllerUnits = [],
			imgFigures = [];

		Array.prototype.forEach.call(imagesData, function(value, index) {
			if (!this.state.imgArrangeArr[index]) {
				this.state.imgArrangeArr[index] = {
					pos: {
						left: 0,
						top: 0
					}
				}
			}
			imgFigures.push(<ImgFigure data={value} key={index} ref={'imgFigure' + index} arrange={this.state.imgArrangeArr[index]}/>);
		}.bind(this));

		return (
			<section className="stage" ref="stage">
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