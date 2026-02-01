import BaseService from "@/lib/api.service";

class otpService extends BaseService {
  constructor() {
    super("otps");
  }

  async list(params: any) {
    return await this.get("", params);
  }
}

const otpServiceInstance = new otpService();

export default otpServiceInstance;
