var React = require('react');
var api = require('../utils/api');
var Loading = require('./loading');

function SelectLanguage(props) {
	var languages = ['All', 'Javascript', 'Ruby', 'Java', 'CSS', 'Python', 'Erlang'];

	return (
		<ul className='languages'>
			{languages.map(function(language) {
				return (
						<li
							style={language === props.selectedLanguage ? { color: '#d0021b'} : null}
							key={language}
							onClick={props.updateLanguage.bind(null, language)}
						>
							{language}
						</li>
					)
				})
			}
		</ul>
	)
}

function RepoGrid(props) {
	return (
		<ul className='popular-list'>
			{props.repos.map(function(repo, index) {
				return (
					<li key={repo.name + index} className='popular-item'>
						<div className='popular-rank'>#{index + 1}</div>
						<ul className='space-list-items'>
							<li>
								<img
									className='avatar'
									src={repo.owner.avatar_url}
									alt={'Avatar for ' + repo.owner.login}
								/>
							</li>
							<li><a href={repo.html_url}>{repo.name}</a></li>
							<li>@{repo.owner.login}</li>
							<li>{repo.stargazers_count} stars</li>
						</ul>
					</li>
				)
			})}
		</ul>
	)
}

class Popular extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			selectedLanguage: 'All',
			repos: null
		};

		this.updateLanguage = this.updateLanguage.bind(this);
	}

	componentDidMount() {
		this.updateLanguage(this.state.selectedLanguage)
	}

	updateLanguage(newLanguage) {
		this.setState(function() {
			return {
				selectedLanguage: newLanguage,
				repos: null
			}
		});

		api.fetchPopularRepos(newLanguage)
		.then(function(repos) {
			this.setState(function() {
				return {
					repos: repos
				}
			})
		}.bind(this));
	}
// HW: make the loading thing like a loading animation
	render() {
		return (
			<div>
				<SelectLanguage
					selectedLanguage={this.state.selectedLanguage}
					updateLanguage={this.updateLanguage}
				/>
				{!this.state.repos ? <Loading/> : <RepoGrid repos={this.state.repos} />}
			</div>
		)
	}
}

module.exports = Popular;
