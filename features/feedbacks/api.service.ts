import BaseService from "@/lib/api.service";

export class FeedbackService extends BaseService {
  constructor() {
    super("feedbacks");
  }

  list(params?: any) {
    return this.get("", params);
  }

  update(id: string, data: any) {
    return this.patch(`/${id}`, data);
  }

  acknowledge(id: string) {
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

const feedbackServiceInstance = new FeedbackService();

export default feedbackServiceInstance;
