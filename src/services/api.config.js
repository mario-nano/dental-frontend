import axios from "axios";
const apiGatewayHostname = process.env.REACT_APP_API_GATEWAY_HOSTNAME;
const apiGatewayPort = process.env.REACT_APP_API_GATEWAY_PORT;

export default axios.create({
    baseURL: `http://${apiGatewayHostname}:${apiGatewayPort}`,
    headers: {
        "Content-type": "application/json"
    }
});
