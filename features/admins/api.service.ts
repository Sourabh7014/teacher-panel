import BaseService from "@/lib/api.service";

class adminService extends BaseService {
  constructor() {
    super("users");
  }

  async list(params: any) {
    params.role = "ADMIN";
    return await this.get("", params);
  }

  async save(data: any, id?: string) {
    if (id) {
      return await this.patch(`/${id}`, data);
    }
    return await this.post("", data);
  }

  async destroy(id: string) {
    return await this.delete(`/${id}`);
  }
}

const adminServiceInstance = new adminService();

export default adminServiceInstance;
