import BaseService from "@/lib/api.service";

class voucherService extends BaseService {
  constructor() {
    super("vendors");
  }

  async list(params: any, vendorId: string) {
    return await this.get(`/${vendorId}/vouchers`, params);
  }

  async create(data: any, vendorId: string) {
    return await this.post(`/${vendorId}/vouchers`, data);
  }

  async update(id: string, data: any, vendorId: string) {
    return await this.patch(`/${vendorId}/vouchers/${id}`, data);
  }

  async destroy(id: string, vendorId: string) {
    return await this.delete(`/${vendorId}/vouchers/${id}`);
  }
}

const voucherServiceInstance = new voucherService();

export default voucherServiceInstance;
