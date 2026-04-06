import api from "./axios";

export const login = (username, password) =>
  api.post(`/auth/login`, null, { params: { username, password } });

export const getAllSchemes = (category, state) =>
  api.get("/schemes", { params: { category, state } });

export const getSchemeById = (id) => api.get(`/schemes/${id}`);

export const searchSchemes = (keyword) =>
  api.get("/schemes/search", { params: { keyword } });

export const getSchemesWithPagination = (page, size) =>
  api.get("/schemes/page", { params: { page, size } });

export const getEligibleSchemes = (params) =>
  api.get("/schemes/eligibility", { params });

export const createScheme = (data) => api.post("/schemes", data);

export const approveScheme = (id) => api.put(`/schemes/${id}/approve`);

export const rejectScheme = (id) => api.put(`/schemes/${id}/reject`);

export const fetchGovtSchemes = () => api.post("/schemes/fetch-govt");

export const getAllSchemesAdmin = () => api.get("/schemes/admin/all");
