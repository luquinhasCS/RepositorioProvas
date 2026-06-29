import axios from "axios";

const api = axios.create({
    baseURL: "https://repositorio-provas.vercel.app/api"
});

export default api;