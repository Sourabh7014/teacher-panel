import BaseService from "@/lib/api.service";

class amenitiesService extends BaseService {
  constructor() {
    super("amenities");
  }

  async list(params?: any) {
    return await this.get("", params);
  }
}

const amenitiesServiceInstance = new amenitiesService();

export default amenitiesServiceInstance;
