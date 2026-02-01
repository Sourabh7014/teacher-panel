import BaseService from "@/lib/api.service";

class mediaService extends BaseService {
  constructor() {
    super("media");
  }

  async upload(file: FormData) {
    return await this.post("upload", file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

const mediaServiceInstance = new mediaService();

export default mediaServiceInstance;
