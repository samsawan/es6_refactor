// you may run into rate limiting

async function getProfile(username) {
	const repsonse = await fetch(`https://api.github.com/users/${username}`)
	return response.json();
}

async function getRepos(username) {
	const response =  await fetch(`https://api.github.com/users/${username}/repos/?per_page=100`);
	return response.json();
}

function getStarCount(repos) {
	return repos.reduce((count, { stargazers_count }) => count + stargazers_count, 0);
}

function calculateScore({ followers }, repos) {
	return (followers * 3) + getStarCount(repos);
}

function handleError(error) {
	console.warn(error);
	return null;
}

async function getUserData(player) {
	const [profile, repos] =  await Promise.all([getProfile(player), getRepos(player)])
	return {
		profile,
		score: calculateScore(profile, repos)
	}
}

function sortPlayers(players) {
	return players.sort((a,b) => b.score - a.score);
}

export async function battle (players) {
	const results = await Promise.all(players.map(getUserData))
		.catch(handleError)
	return results === null 
	? results
	: sortPlayers(results)
}

export async function fetchPopularRepos(language) {
	const encodedUri = window.encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`);
	const response = await fetch(encodedUri)
		.catch(handleError)
	const repos = await response.json()
	return repos.items;
}
