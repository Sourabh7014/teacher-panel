import BaseService from "@/lib/api.service";
import apiClient from "@/lib/axios";
import { AxiosRequestConfig } from "axios";

class ProfileService extends BaseService {
  constructor() {
    super("profile");
  }

  async getProfile() {
    return await this.get("");
  }

  async updateProfile(data: any) {
    return await this.post("/update", data);
  }

  async changePassword(data: any) {
    return await this.post("/change-password", data);
  }
}

const profileServiceInstance = new ProfileService();

export default profileServiceInstance;
