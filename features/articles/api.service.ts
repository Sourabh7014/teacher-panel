import BaseService from "@/lib/api.service";

class ArticleService extends BaseService {
  constructor() {
    super("articles");
  }

  async list(params?: any) {
    return await this.get("", params);
  }

  async create(data: any) {
    return await this.post("", data);
  }

  async view(id: string) {
    return await this.get(`/${id}`);
  }

  async update(id: string, data: any) {
    return await this.patch(`/${id}`, data);
  }

  async publish(id: string) {
    return await this.patch(`/${id}/publish`, {});
  }

  async remove(id: string) {
    return await this.delete(`/${id}`);
  }

  async categories(params?: any) {
    return await this.get("categories", params);
  }

  async getCategory(id: string) {
    return await this.get(`categories/${id}`);
  }

  async saveCategory(data: any, id?: string) {
    if (id) {
      return await this.patch(`categories/${id}`, data);
    }
    return await this.post("categories", data);
  }

  async deleteCategory(id: string) {
    return await this.delete(`categories/${id}`);
  }
}

const articleServiceInstance = new ArticleService();

export default articleServiceInstance;
