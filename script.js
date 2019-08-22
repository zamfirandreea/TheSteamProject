const steamKey = '0DB8EC376B48E0736AB221887E5C7B6D';
let steamProfileId = '76561198118730252';

const header = document.getElementsByClassName('header')[0];
const content = document.getElementsByClassName('content')[0];

// Header
const displayUserHeader = async (steamProfileId) => {
    const userData =  await getProfileData(steamProfileId);
    userData.level = await getProfileLevelData(steamProfileId);
    console.log(userData);
    if(isHeaderEmpty()) {
        createUserHeader();
    }
    setHeaderData(userData);
};

const getProfileData = async (steamProfileId) => {
    const response = await axios.get('http://localhost:8081/ISteamUser/GetPlayerSummaries/v0002/?key=' + steamKey + '&steamids=' + steamProfileId);
    // console.log(response.data.response.players[0].avatarfull);
    const {avatarfull, personaname} = response.data.response.players[0];
    return {avatarfull, personaname};
};

const getProfileLevelData = async (steamProfileId) => {
    const response = await axios.get('http://localhost:8081/IPlayerService/GetSteamLevel/v1/?key=' + steamKey + '&steamid=' + steamProfileId);
    return response.data.response.player_level;
};

const isHeaderEmpty = () => {

    return !header.children.length;
};

const setHeaderData = (userData) => {
    const {avatarfull, personaname, level} = userData;
    const avatarElem = document.getElementsByClassName('profile_picture')[0];
    const nameElem = document.getElementsByClassName('profile_name')[0];
    const levelElem = document.getElementsByClassName('profile_level')[0];

    avatarElem.src = avatarfull;
    nameElem.innerHTML = personaname;
    levelElem.innerHTML = `Level: ${level}`;
};

const createUserHeader = () => {
    const imgSection = document.createElement('section');
    imgSection.className = 'image_section';
    const avatar = document.createElement('img');
    avatar.className = 'profile_picture';
    imgSection.appendChild(avatar);
    header.appendChild(imgSection);

    const detailsSection = document.createElement('section');
    detailsSection.className = 'details_section';
    const name = document.createElement('p');
    name.className = 'profile_name';
    detailsSection.appendChild(name);
    header.appendChild(detailsSection);

    const level = document.createElement('p');
    level.className = 'profile_level';
    detailsSection.appendChild(level);
};

// Recent Game
const displayRecentGame = async (steamProfileId) => {
    if(!existsRecentPlayedGameElem()){
        createRecentPlayedGame();
    }
    const data = await getRecentPlayedGameData(steamProfileId);
    updateRecentPlayedGame(data);
};

const existsRecentPlayedGameElem = () => {
    const foundElements = document.getElementsByClassName('recent_game');
    if(foundElements && foundElements.length>0){
        return !!foundElements[0];
    }
    return null;
};

const createRecentPlayedGame = () => {
    const section = document.createElement('section');
    section.className = 'recent_game';
    const header = document.createElement('h2');
    header.className = 'section_header';
    header.innerHTML = 'Recent Game Played';
    section.appendChild(header);
    content.appendChild(section);

    const gameImage = document.createElement('img');
    gameImage.className = 'game_image';
    const gameName = document.createElement('p');
    gameName.className = 'game_name';
    const gamePlaytime = document.createElement('p');
    gamePlaytime.className = 'game_playtime';
    section.appendChild(gameImage);
    section.appendChild(gameName);
    section.appendChild(gamePlaytime);
};

const getRecentPlayedGameData = async (steamProfileId) => {
    const response = await axios.get('http://localhost:8081/IPlayerService/GetRecentlyPlayedGames/v0001/?key=' + steamKey + '&steamid=' + steamProfileId + '&format=json');
    // console.log(response.data.response.games[0]);
    return response.data.response.games[0];
};

const updateRecentPlayedGame = (gameData) => {
    const gameImage = document.getElementsByClassName('game_image')[0];
    const gameName = document.getElementsByClassName('game_name')[0];
    const gamePlaytime = document.getElementsByClassName('game_playtime')[0];

    gameImage.src = 'http://media.steampowered.com/steamcommunity/public/images/apps/' + gameData.appid + '/' + gameData.img_logo_url + '.jpg';
    gameName.innerHTML = gameData.name;
    gamePlaytime.innerHTML = 'Total playtime: ' + sec2time(gameData.playtime_forever);
};

// Owned Games
const displayOwnedGames = async (steamProfileId) => {
    if(!existsOwnedGamesElem()) {
        createOwnedGames();
    }
    const data = await getOwnedGamesData(steamProfileId);
    updateOwnedGames(data);
};

const createOwnedGames = () => {
    const ownedGameSection = document.createElement('section');
    const header = document.createElement('h2');
    ownedGameSection.className = 'owned_games';
    header.className = 'owned_games_header';
    header.innerHTML = 'Owned Games (Top 10 most played)';
    ownedGameSection.appendChild(header);
    content.appendChild(ownedGameSection);
};

const existsOwnedGamesElem = () => {
    const foundElements = document.getElementsByClassName('owned_games');
    if(foundElements && foundElements.length > 0){
        return !!foundElements[0];
    }
    return false;
};

const getOwnedGamesData = async (steamProfileId) => {
    const response = await axios.get('http://localhost:8081/IPlayerService/GetOwnedGames/v0001/?key=' + steamKey + '&steamid=' + steamProfileId + '&format=json&include_appinfo=1&include_&include_played_free_games=1');
    const ownedGames = response.data.response.games;
    ownedGames.sort((game01, game02) => game02.playtime_forever - game01.playtime_forever);
    return ownedGames.slice(0,10);
};


const updateOwnedGames = (games) => {
    const section = document.getElementsByClassName('owned_games')[0];
    // clearOwnedGamesSection(section); // remove children!!!
    games.forEach(game => createOwnedGame(section, game));
};

const createOwnedGame = (section, game) => {
    const gameSection = document.createElement('section');
    gameSection.className = 'game_section';
    const gameImage = document.createElement('img');
    const gameName = document.createElement('p');
    const gamePlaytime = document.createElement('p');
    gameImage.className = 'game_image';
    gameName.className = 'game_name';
    gamePlaytime.className = 'game_playtime';

    gameImage.src = 'http://media.steampowered.com/steamcommunity/public/images/apps/' + game.appid + '/' + game.img_logo_url + '.jpg';
    gameName.innerHTML = game.name;
    gamePlaytime.innerHTML = 'Total playtime: ' + sec2time(game.playtime_forever);

    gameSection.appendChild(gameImage);
    gameSection.appendChild(gameName);
    gameSection.appendChild(gamePlaytime);
    section.appendChild(gameSection);
};

async function getResponseProfileDetails() {
    try {
        displayUserHeader(steamProfileId);
        displayRecentGame(steamProfileId);
        displayOwnedGames(steamProfileId);

    } catch (error) {
        console.error(error);
    }
}

const sec2time = (timeInSeconds) => {
    const pad = (num, size) => ('000' + num).slice(size * -1);
    const timeInMinutes = parseFloat(timeInSeconds).toFixed(3);
    days = Math.floor(timeInMinutes / 60 / 24);
    hours = Math.floor(timeInMinutes / 60 % 24);
    minutes = Math.floor(timeInMinutes % 60);

    return pad(days, 2) + ' ' + pad(hours, 2) + ':' + pad(minutes, 2);
};

// Start function
getResponseProfileDetails();
