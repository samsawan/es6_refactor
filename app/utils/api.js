import axios from 'axios';

// you may run into rate limiting

function getProfile(username) {
	return axios.get(`https://api.github.com/users/${username}`)
		.then(({ data }) => data)
}

function getRepos(username) {
	return axios.get(`https://api.github.com/users/${username}/repos/?per_page=100`);
}

function getStarCount(repos) {
	return repos.data.reduce((count, { stargazers_count }) => count + stargazers_count, 0);
}

function calculateScore({ followers }, repos) {
	return (followers * 3) + getStarCount(repos);
}

function handleError(error) {
	console.warn(error);
	return null;
}

function getUserData(player) {
	return Promise.all([getProfile(player), getRepos(player)])
		.then(([ profile, repos ]) => ({
				profile,
				score: calculateScore(profile, repos)
		})
	)
}

function sortPlayers(players) {
	return players.sort((a,b) => b.score - a.score);
}

export function battle (players) {
	return Promise.all(players.map(getUserData))
			.then(sortPlayers)
			.catch(handleError)
}

export function fetchPopularRepos(language) {
	const encodedUri = window.encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`);
	return axios.get(encodedUri).then(({ data }) => data.items);
}
