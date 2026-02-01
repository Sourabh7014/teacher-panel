import BaseService from "@/lib/api.service";

export class PostService extends BaseService {
  constructor() {
    super("posts");
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

  hide(id: string) {
    return this.patch(`/${id}/hide`, {});
  }
}

const postServiceInstance = new PostService();

export default postServiceInstance;
