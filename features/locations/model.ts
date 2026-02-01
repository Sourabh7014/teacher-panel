export interface City {
  id: string;
  name: string;
  timezone?: string;
  latitude?: string;
  longitude?: string;
  supported?: boolean;
  active?: boolean;
  state?: State;
  country?: Country;
}

export interface State {
  id: string;
  name: string;
  code?: string;
  state_code?: string;
  supported?: boolean;
  active?: boolean;
  country?: Country;
}

export interface Country {
  id: string;
  name: string;
  currency?: string;
  country_code?: string;
  iso2?: string;
  iso3?: string;
  supported?: boolean;
  active?: boolean;
}
