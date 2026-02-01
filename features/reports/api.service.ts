import BaseService from "@/lib/api.service";

export class ReportService extends BaseService {
  constructor() {
    super("reports");
  }

  list(params?: any) {
    return this.get("", params);
  }

  update(id: string, data: any) {
    return this.patch(`/${id}`, data);
  }

  acknowledgeReport(id: string) {
    return this.patch(`/${id}/acknowledge`, {});
  }

  categories(params?: any) {
    return this.get("categories", params);
  }

  saveCategory(data: any, id?: string) {
    if (id) {
      return this.patch(`categories/${id}`, data);
    }
    return this.post(`categories`, data);
  }

  deleteCategory(id: string) {
    return this.delete(`categories/${id}`);
  }
}

const reportServiceInstance = new ReportService();

export default reportServiceInstance;
