import BaseService from "@/lib/api.service";

class ReviewService extends BaseService {
  constructor() {
    super("reviews");
  }

  async list(params: any) {
    return this.get("", params);
  }

  async create(data: any) {
    return this.post("", data);
  }

  async update(id: string, data: any) {
    return this.patch(`/${id}`, data);
  }

  async destroy(id: string) {
    return this.delete(`/${id}`);
  }

  async hide(id: string) {
    return this.patch(`/${id}/hide`, {});
  }
}

const reviewServiceInstance = new ReviewService();

export default reviewServiceInstance;
