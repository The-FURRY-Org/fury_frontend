import api from "./api";

export const paymentService = {
  create: (data) => api.post("/payments", data),
  myPayments: () => api.get("/payments/my-payments")
};
