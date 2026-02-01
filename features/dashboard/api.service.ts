import BaseService from "@/lib/api.service";

export class DashboardService extends BaseService {
  constructor() {
    super("dashboard");
  }

  getStats(params?: any) {
    return this.get("stats", params);
  }

  getUserStats(params?: any) {
    return this.get("users", params);
  }

  getCheckInStats(params?: any) {
    return this.get("check-ins", params);
  }

  getPostStats(params?: any) {
    return this.get("posts-vs-reviews", params);
  }

  getVendorStats(params?: any) {
    return this.get("vendors", params);
  }

  getTopStats(params?: any) {
    return this.get("top-stats", params);
  }

  getTopAllTimeStats(params?: any) {
    return this.get("top-all-time-stats", params);
  }
}

const dashboardServiceInstance = new DashboardService();

export default dashboardServiceInstance;
