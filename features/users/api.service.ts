import BaseService from "@/lib/api.service";

class userService extends BaseService {
  constructor() {
    super("users");
  }

  async list(params: any) {
    params.role = "USER";
    return await this.get("", params);
  }

  async pending(params: any) {
    return await this.get("pending", params);
  }
}

const userServiceInstance = new userService();

export default userServiceInstance;
