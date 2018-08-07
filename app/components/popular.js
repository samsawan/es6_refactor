import React from 'react';
import { fetchPopularRepos } from '../utils/api';
import Loading from './loading';

function SelectLanguage({ selectedLanguage, onSelect }) {
	const languages = ['All', 'Javascript', 'Ruby', 'Java', 'CSS', 'Python', 'Erlang'];

	return (
		<ul className='languages'>
			{languages.map((language) => (
						<li
							style={language === selectedLanguage ? { color: '#d0021b'} : null}
							key={language}
							onClick={() => onSelect(language)}
						>
							{language}
						</li>
				))}
		</ul>
	)
}

function RepoGrid({ repos }) {
	return (
		<ul className='popular-list'>
			{repos.map(({name, owner, stargazers_count, html_url}, index) => (
					<li key={name + index} className='popular-item'>
						<div className='popular-rank'>#{index + 1}</div>
						<ul className='space-list-items'>
							<li>
								<img
									className='avatar'
									src={owner.avatar_url}
									alt={'Avatar for ' + owner.login}
								/>
							</li>
							<li><a href={html_url}>{repo.name}</a></li>
							<li>@{owner.login}</li>
							<li>{stargazers_count} stars</li>
						</ul>
					</li>
				)
			)})}
		</ul>
	)
}

class Popular extends React.Component {
	state = {
		selectedLanguage: 'All',
		repos: null
	}

	componentDidMount() {
		this.updateLanguage(this.state.selectedLanguage)
	}

	updateLanguage = (newLanguage) => {
		this.setState(() => ({selectedLanguage: newLanguage, repos: null}));
		fetchPopularRepos(newLanguage)
		.then((repos) => this.setState(() => ({ repos })));
	}

// HW: make the loading thing like a loading animation
	render() {
		const { selectedLanguage, repos } = this.state;
		return (
			<div>
				<SelectLanguage
					selectedLanguage={selectedLanguage}
					updateLanguage={this.updateLanguage}
				/>
				{!repos ? <Loading/> : <RepoGrid repos={repos} />}
			</div>
		)
	}
}

export default Popular;