import axios from "axios";

function register(user) {
    return axios.post("http://localhost:8484/api/users", user);
}

export default {
    register
};