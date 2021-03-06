import React from 'react';

const styles = {
	content: {
		textAlign: 'center',
		fontSize: '35px'
	}
}

class Loading extends React.Component {
	state = {
		text: this.props.text
	}

	componentDidMount() {
		const { text, speed } = this.props;
		const stopper = text + '...';

		this.interval = window.setInterval(() => {
			this.state.text === stopper ? this.setState(() => ({text: text})) : this.setState((prevState) => ({text: prevState.text + '.'}))
		}, speed)
	}

	componentWillUnmount() {
		window.clearInterval(this.interval);
	}

	render() {
		return(
			<p style={styles.content}>
				{this.state.text}
			</p>
		)
	}
}

Loading.defaultProps = {
	text: 'Loading',
	speed: 300
}

export default Loading;
