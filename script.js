// const axios = require('axios');
// import axios from 'axios';

console.log('axios', axios);
async function getProfilePicture() {
    try {
        const response = await axios.get('http://localhost:8081/ISteamUser/GetPlayerSummaries/v0002/?key=0DB8EC376B48E0736AB221887E5C7B6D&steamids=76561198118730252');
        console.log('res => ', response);
    } catch (error) {
        console.error(error);
    }
}

getProfilePicture();
