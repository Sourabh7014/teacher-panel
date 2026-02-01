import BaseService from "@/lib/api.service";

export class LocationService extends BaseService {
  constructor() {
    super("");
  }

  getCountries(params?: any) {
    return this.get("countries", params);
  }

  createCountry(data: any) {
    return this.post("countries", data);
  }

  updateCountry(id: string, data: any) {
    return this.patch(`countries/${id}`, data);
  }

  deleteCountry(id: string) {
    return this.delete(`countries/${id}`);
  }

  getStates(params?: any) {
    return this.get("states", params);
  }

  createState(data: any) {
    return this.post("states", data);
  }

  updateState(id: string, data: any) {
    return this.patch(`states/${id}`, data);
  }

  deleteState(id: string) {
    return this.delete(`states/${id}`);
  }

  getCities(params?: any) {
    return this.get("cities", params);
  }

  updateCity(id: string, data: any) {
    return this.patch(`cities/${id}`, data);
  }

  createCity(data: any) {
    return this.post("cities", data);
  }

  deleteCity(id: string) {
    return this.delete(`cities/${id}`);
  }
}

const locationServiceInstance = new LocationService();

export default locationServiceInstance;
