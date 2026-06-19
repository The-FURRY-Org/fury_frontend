import api from "./api";

export const feedbackService = {
  create: (data) => api.post("/feedback", data),
  createGeneral: (data) => api.post("/feedback/general", data),
  byPickup: (pickupId) => api.get(`/feedback/pickup/${pickupId}`)
};
