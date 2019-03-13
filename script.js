
const steamKey = '0DB8EC376B48E0736AB221887E5C7B6D';
const steamProfileId = '76561198118730252';
const header = document.getElementsByClassName('header')[0];
const content = document.getElementsByClassName('left_side')[0];


async function getResponseProfileDetails() {
    try {
        const profileDetailsRes = await axios.get('http://localhost:8081/ISteamUser/GetPlayerSummaries/v0002/?key=' + steamKey + '&steamids=' + steamProfileId);
        const levelRes = await axios.get('http://localhost:8081/IPlayerService/GetSteamLevel/v1/?key=' + steamKey + '&steamid=' + steamProfileId);
        const recentlyPlayedRes = await axios.get('http://localhost:8081/IPlayerService/GetRecentlyPlayedGames/v0001/?key=' + steamKey + '&steamid=' + steamProfileId + '&format=json');
        const ownedGamesRes = await axios.get('http://localhost:8081/IPlayerService/GetOwnedGames/v0001/?key=' + steamKey + '&steamid=' + steamProfileId + '&format=json&include_appinfo=1&include_&include_played_free_games=1');

        getProfilePicture(profileDetailsRes.data);
        getProfileName(profileDetailsRes.data);
        getProfileLevel(levelRes.data);
        getRecentlyPlayedGame(recentlyPlayedRes.data);
        getOwnedGames(ownedGamesRes.data);
        // getFriendsList(friendsRes.data);
    } catch (error) {
        console.error(error);
    }
}

getResponseProfileDetails();

const getProfilePicture = (res) => {
    const imgSection = document.createElement('section');
    imgSection.className = 'image_section';
    const avatar = document.createElement('img');
    avatar.className = 'profile_picture';
    avatar.src = res.response.players[0].avatarfull;
    imgSection.appendChild(avatar);
    header.appendChild(imgSection);
};

const getProfileName = (res) => {
    const detailsSection = document.createElement('section');

    const name = document.createElement('p');

    detailsSection.className = 'details_section';
    name.className = 'profile_name';

    name.innerHTML = 'Player Username: ' + res.response.players[0].personaname;

    detailsSection.appendChild(name);

    if(!!res.response.players[0].realname) {
        const realName = document.createElement('p');
        realName.className = 'profile_name';
        realName.innerHTML = 'Player Name: ' + res.response.players[0].realname;
        detailsSection.appendChild(realName);
    }

    header.appendChild(detailsSection);
};

const getProfileLevel = (res) => {
    const detailsSection = document.getElementsByClassName('details_section')[0];
    const level = document.createElement('p');
    const levelValue = document.createElement('span');
    level.className = 'profile_level';
    levelValue.innerHTML = res.response.player_level;
    levelValue.className = 'level_value';
    level.innerHTML = 'Level ';
    level.appendChild(levelValue);
    detailsSection.appendChild(level);
    header.appendChild(detailsSection);
};

const gameDisplay = (game, section) => {
    const gameImage = document.createElement('img');
    const gameName = document.createElement('p');
    const gamePlaytime = document.createElement('p');
    gameImage.className = 'game_image';
    gameName.className = 'game_name';
    gamePlaytime.className = 'game_playtime';

    gameImage.src = 'http://media.steampowered.com/steamcommunity/public/images/apps/' + game.appid + '/' + game.img_logo_url + '.jpg';
    gameName.innerHTML = game.name;
    gamePlaytime.innerHTML = 'Total playtime: ' + sec2time(game.playtime_forever);

    section.appendChild(gameImage);
    section.appendChild(gameName);
    section.appendChild(gamePlaytime);
};

const getRecentlyPlayedGame = (res) => {
    const recentGameSection = document.createElement('section');
    const header = document.createElement('h2');
    header.className = 'recent_game_header';
    header.innerHTML = 'Recent Activity';
    recentGameSection.appendChild(header);
    gameDisplay(res.response.games[0], recentGameSection);
    content.appendChild(recentGameSection);
};

const getOwnedGames = (res) => {
    const ownedGameSection = document.createElement('section');
    const header = document.createElement('h2');
    ownedGameSection.className = 'owned_games_section';
    header.className = 'owned_games_header';
    header.innerHTML = 'Owned Games (Top 10 most played)';
    ownedGameSection.appendChild(header);
    const games = res.response.games;
    games.sort((game01, game02) => game02.playtime_forever - game01.playtime_forever);
    games.slice(0,10).forEach(game => {
        const gameSection = document.createElement('section');
        gameSection.className = 'game_section';
        gameDisplay(game, gameSection);
        ownedGameSection.appendChild(gameSection);
    });

    content.appendChild(ownedGameSection);
};
const sec2time = (timeInSeconds) => {
    const pad = (num, size) => ('000' + num).slice(size * -1),
        time = parseFloat(timeInSeconds).toFixed(3),
        hours = Math.floor(time / 60 / 60),
        minutes = Math.floor(time / 60) % 60,
        seconds = Math.floor(time - minutes * 60);

    return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2);
};

const getFriendsList = (res, profileDetailsRes) => {
    const friendSection = document.createElement('section');
    const header = document.createElement('h2');
    friendSection.className = 'friend_section';
    header.className = 'friends_header';

    header.innerHTML = 'Friends';

    friendSection.appendChild(header);
    aside.appendChild(friendSection);
};

const createSteamIdInput = () => {
  const idInput = document.createElement('input');
  idInput.type = 'text';
  idInput.id = 'id_input';
  idInput.defaultValue = '76561198118730252';
  document.getElementsByClassName('steam_id_field')[0].appendChild(idInput);
  console.log(idInput.value);
};

const submitButton = () => {
    const button = document.createElement('button');
    button.className = 'submit_btn';
    button.innerHTML = 'Submit';
    button.onclick = onClick;
    document.getElementsByClassName('steam_id_field')[0].appendChild(button);
};

const onClick = () => {
    console.log('button Clicked!');
    const urlInput = document.getElementById('id_input');
    const container = document.getElementsByClassName('container')[0];
    container.innerHTML = '';
    console.log(urlInput.value);

};

createSteamIdInput();
submitButton();

