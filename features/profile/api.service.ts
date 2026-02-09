import BaseService from "@/lib/api.service";
import apiClient from "@/lib/axios";
import { AxiosRequestConfig } from "axios";
import { PaymentSession } from "@/features/profile/model";

class ProfileService extends BaseService {
  constructor() {
    super("/users");
  }

  async getProfile() {
    return await this.get("/me");
  }

  async updateProfile(data: any) {
    return await this.post("/update", data);
  }

  async changePassword(data: any) {
    return await this.post("/change-password", data);
  }

  async initiatePayment() {
    return (await this.post("payment", {})) as unknown as PaymentSession;
  }

  async verifyPaymentStatus() {
    return await this.get("/payment-status");
  }
}

const profileServiceInstance = new ProfileService();

export default profileServiceInstance;
