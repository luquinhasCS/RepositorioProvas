import axios from "axios";

const api = axios.create({
    baseURL: "https://repositorio-provas.vercel.app"
});

export default api;