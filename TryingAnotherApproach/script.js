const steamKey = '0DB8EC376B48E0736AB221887E5C7B6D';
let steamProfileId = '76561198118730252';
const header = document.getElementsByClassName('header')[0];
const leftSection = document.getElementsByClassName('left_side')[0];

const getProfileAvatar = async (steamId) => {
    initProfileAvatar();
    const profileAvatar = await getProfileAvatarData(steamId);
    updateProfileAvatar(profileAvatar);
    // console.log(profileAvatar);
};

const createProfileAvatar = () => {
    const imgSection = document.createElement('section');
    imgSection.className = 'image_section';
    const avatar = document.createElement('img');
    avatar.className = 'profile_picture';
    imgSection.appendChild(avatar);
    header.appendChild(imgSection);
    return imgSection;
};

const findProfileAvatar = () => {
  return document.getElementsByClassName('image_section')[0];
};

const initProfileAvatar = () => {
    // console.log(createProfileAvatar());
    return findProfileAvatar() || createProfileAvatar();
};

const getProfileAvatarData = async (steamProfileId) => {
    const response = await axios.get('http://localhost:8081/ISteamUser/GetPlayerSummaries/v0002/?key=' + steamKey + '&steamids=' + steamProfileId);
    // console.log(response.data.response.players[0].avatarfull);
    return response.data.response.players[0].avatarfull;
};

const updateProfileAvatar = (avatarData) => {
    const avatar = document.getElementsByClassName('profile_picture')[0];
    avatar.src = avatarData;
    // console.log(avatar.src);
};

const getProfileName = async (steamId) => {
  initProfileName();
  const profileName = await getProfileNameData(steamId);
  updateProfileName(profileName);
};

const createProfileName = () => {
    const detailsSection = document.createElement('section');
    detailsSection.className = 'details_section';
    const name = document.createElement('p');
    name.className = 'profile_name';
    detailsSection.appendChild(name);
    header.appendChild(detailsSection);
    return detailsSection;
};

const findProfileName = () => {
    return document.getElementsByClassName('profile_name')[0];
};

const initProfileName = () => {
    // console.log(createProfileName());
    return findProfileName() || createProfileName();
};

const getProfileNameData = async (steamProfileId) => {
    const response = await axios.get('http://localhost:8081/ISteamUser/GetPlayerSummaries/v0002/?key=' + steamKey + '&steamids=' + steamProfileId);
    // console.log(response.data.response.players[0].personaname);
    return response.data.response.players[0].personaname;
};

const updateProfileName = (nameData) => {
    const name = document.getElementsByClassName('profile_name')[0];
    name.innerHTML = nameData;
    // console.log(name.innerHTML);
};

const getProfileLevel = async (steamId) => {
  let profileLevel = initProfileLevel();
  const data = await getProfileLevelData(steamId);
  updateProfileLevel(profileLevel, data);
};

const createProfileLevel = () => {
  const detailsSection = document.getElementsByClassName('details_section')[0];
  const level = document.createElement('p');
  level.className = 'profile_level';
  detailsSection.appendChild(level);
  return level;
};

const findProfileLevel = () => {
    const foundElements = document.getElementsByClassName('profile_level');
    if(foundElements && foundElements.length>0){
        return foundElements[0];
    }
    return null;
};

const initProfileLevel = () => {
  // console.log(createProfileLevel());
  return findProfileLevel() || createProfileLevel();
};

const getProfileLevelData = async (steamProfileId) => {
    const response = await axios.get('http://localhost:8081/IPlayerService/GetSteamLevel/v1/?key=' + steamKey + '&steamid=' + steamProfileId);
    // console.log(response.data.response.player_level);
    return 'Level ' + response.data.response.player_level;
};

const updateProfileLevel = (level, levelData) => {
    level.innerHTML = levelData;
};

const getRecentPlayedGame = async (steamId) => {
  initRecentPlayedGame();
  const gameData = await getRecentPlayedGameData(steamId);
  updateRecentPlayedGame(gameData);
};

const createRecentPlayedGame = () => {
  const section = document.createElement('section');
  section.className = 'recent_game';
  const header = document.createElement('h2');
  header.className = 'section_header';
  header.innerHTML = 'Recent Game Played';
  section.appendChild(header);
  leftSection.appendChild(section);

  const gameImage = document.createElement('img');
  gameImage.className = 'game_image';
  const gameName = document.createElement('p');
  gameName.className = 'game_name';
  const gamePlaytime = document.createElement('p');
  gamePlaytime.className = 'game_playtime';
  section.appendChild(gameImage);
  section.appendChild(gameName);
  section.appendChild(gamePlaytime);
  return section;
};

const findRecentPlayedGame = () => {
  return document.getElementsByClassName('recent_game');
};

const initRecentPlayedGame = () => {
  return findRecentPlayedGame() || createRecentPlayedGame();
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

const sec2time = (timeInSeconds) => {
    const pad = (num, size) => ('000' + num).slice(size * -1),
        time = parseFloat(timeInSeconds).toFixed(3),
        hours = Math.floor(time / 60 / 60),
        minutes = Math.floor(time / 60) % 60,
        seconds = Math.floor(time - minutes * 60);

    return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2);
};

const getOwnedGames = async (steamId) => {
    initOwnedGames();
    const gameData = await getOwnedGamesData(steamId);
    updateOwnedGames(gameData);
};

const createOwnedGames = () => {
  const section = document.createElement('section');
  section.className = 'owned_games';
  const header = document.createElement('h2');
  header.className = 'section_header';
  header.innerHTML = 'Owned Games (Top 10 Played)';
  section.appendChild(header);

  const gameImage = document.createElement('img');
  gameImage.id = 'game_image';
  const gameName = document.createElement('p');
  gameName.id = 'game_name';
  const gamePlaytime = document.createElement('p');
  gamePlaytime.id = 'game_playtime';
  section.appendChild(gameImage);
  section.appendChild(gameName);
  section.appendChild(gamePlaytime);
  return section;
};

const findOwnedGames = () => {
  return document.getElementsByClassName('owned_games')[0];
};

const initOwnedGames =() => {
  return findOwnedGames() || createOwnedGames();
};

const getOwnedGamesData = async (steamProfileId) => {
  const response = await axios.get('http://localhost:8081/IPlayerService/GetOwnedGames/v0001/?key=' + steamKey + '&steamid=' + steamProfileId + '&format=json&include_appinfo=1&include_&include_played_free_games=1');
  const ownedGames = response.data.response.games;
  ownedGames.sort((game01, game02) => game02.playtime_forever - game01.playtime_forever);
  return ownedGames.slice(0,10);
};

const updateOwnedGames = (gameData) => {
  const gameImage = document.getElementById('game_image');
  const gameName = document.getElementById('game_name');
  const gamePlaytime = document.getElementById('game_playtime');

  gameImage.src = 'http://media.steampowered.com/steamcommunity/public/images/apps/' + gameData.appid + '/' + gameData.img_logo_url + '.jpg';
  gameName.innerHTML = gameData.name;
  gamePlaytime.innerHTML = 'Total Playtime: ' + sec2time(gameData.playtime_forever);
};

async function getResponseProfileDetails() {
    try {
        getProfileAvatar(steamProfileId);
        getProfileName(steamProfileId);
        getProfileLevel(steamProfileId);
        // getRecentPlayedGame(steamProfileId);
        // getRecentPlayedGame(steamProfileId);
        // getOwnedGames(steamProfileId);
    } catch (error) {
        console.error(error);
    }
}

getResponseProfileDetails();