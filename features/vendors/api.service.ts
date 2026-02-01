import BaseService from "@/lib/api.service";

class vendorService extends BaseService {
  constructor() {
    super("vendors");
  }

  async list(params: any) {
    return await this.get("", params);
  }

  async create(data: any) {
    return await this.post("", data);
  }

  async update(id: string, data: any) {
    return await this.patch(`/${id}`, data);
  }

  async destroy(id: string) {
    return await this.delete(`/${id}`);
  }

  async hours(id: string) {
    return await this.get(`/${id}/hours`);
  }

  async updateStatus(id: string, data: any) {
    return await this.patch(`/${id}/status`, data);
  }
}

const vendorServiceInstance = new vendorService();

export default vendorServiceInstance;
