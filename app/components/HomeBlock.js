'use strict';

import React from 'react';

class HomeBlock extends React.Component {

	constructor(props) {

		super(props);

		// Default state
		this.state = {
			open: false,
			mountContent: false,
			zIndex: null
		};

		// Component DOM elements
		this.els = {};

		// The default element position
		this.defaultPosition = {};

		this.timeline = false;

	}

	componentDidMount() {

		// Set the default position and everytime the browser resizes
		setTimeout(() => {
			this.setBlockDefaults();
		});

		// Set event listeners
		this.setEventListeners();

	}

	componentWillUnmount() {

		// Remove event listeners

	}

	componentDidUpdate() {

		console.log("componentDidUpdate callback");

		// Update the ZIndex
		//this.setZIndex();

	}

	setEventListeners() {

		// Scroll event listener
		window.addEventListener('scroll', e => this.onScrollHandler(e));

	}

	removeEventListeners() {

		window.removeEventListeners('scroll', this.onScrollHandler);

	}

	setBlockDefaults() {

		for (const key in this.els) {
			if (this.defaultPosition[key]) {
				this.defaultPosition[key] = this.calcElementPosition(this.els[key]);
			}
		}

	}

	setBlockSize(el) {

		el.style.width = this.defaultPosition[''] + 'px';

	}

	setElement(key, node) {

		this.els[key] = node;

	}

	calcElementPosition(el) {

		return el.getBoundingClientRect();

	}

	updateHash() {

		// the hash value needs to be passed to props
		history.pushState(null, null, '#/' + this.props.urlHash);

	}

	openBlock() {

		this.setState({
			open: !this.state.open
		});

			if (this.state.open) {

				// before the reverse animation starts
			// the component needs to be dismounted
			this.setState({
				mountContent: false
			});

			setTimeout(() => {
				this.timeline.reverse();
			});

			// this should be moved and treated only for modal elements
			history.pushState(null, null, '/#/');

		} else {

			// get updated timeline with correct position
			// the user may have scrolled
			this.timeline = this.updateTimeline();

			this.els.block.parentNode.style.zIndex = 999;

			this.timeline.play();

		}

	}

	initTimeline() {

		let timeline;

		// Initialise the timeline if not declared yet to cache it
		if (!this.timeline) {

			// Calculate DOM position
			this.pos = this.calcElementPosition(this.els.block);

			// Open the Modal
			let cssBefore = { css: { width: this.pos.width, height: this.pos.height, position: 'absolute', top: 0, left: 0 } };
			let cssAfter = { css : { width: window.innerWidth, height: window.innerHeight, top: -this.pos.top, left: -this.pos.left, position: 'absolute' } };
			const onStartCallback = () => {
				this.props.setNoScroll(true);
			};
			const onCompleteCallback = () => {

				this.setState({
					open: true,
					mountContent: true
				});

				// refactor to treat only modal elements
				this.updateHash();

				//this.props.setNoScroll(true);

			};
			const onReverseCompleteCallback = () => {
				this.els.block.parentNode.style.zIndex = '';
				this.props.setNoScroll(false);
				this.setState({
					open: false,
					mountContent: false
				});
			};
			timeline = new window.TimelineLite({
				onStart: onStartCallback,
				onComplete: onCompleteCallback,
				onReverseComplete: onReverseCompleteCallback
			});

			timeline.fromTo(this.els.block, 0.3, cssBefore, cssAfter);

			timeline.pause();

		}

		return timeline;

	}


	updateTimeline() {

		let timeline;

		if (this.timeline) {
			this.timeline.clear();
			this.timeline = null;
		}

		timeline = this.initTimeline();

		return timeline;

	}

	onBlockOpen() {

		// Set block element to fix position
		this.props.setNoScroll(true);

		// Update children mount state
		this.setState({
			mountContent: true
		});

	}

	onBlockCollapse() {

		// Set block element to fix position
		this.props.setNoScroll(false);

		// Update children mount state
		this.setState({
			mountContent: false
		});

	}

	onScrollHandler() {

	}

	setZIndex() {

		let zIndex = null;

		if (this.state.open) {

			zIndex = 999;

		} else {

			zIndex = null;

		}

		this.setState({
			zIndex: zIndex
		});

		return null;

	}

	render() {

		return (
			<div className={ 'home-block' + ' ' + this.props.innerComponent.className }>
				<div className='block' ref={this.setElement.bind(this, 'block')} onClick={this.openBlock.bind(this)}>
						<div className='content'>
							{this.state.mountContent ? <this.props.innerComponent.component /> : null}
						</div>
				</div>
			</div>
		);

	}

}

export default HomeBlock;