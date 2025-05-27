import { Restaurant } from "../models/Restaurant";

export class RestaurantManager {
  private static instance: RestaurantManager | null = null;
  private restaurants: Restaurant[] = [];

  private constructor() {}

  public static getInstance(): RestaurantManager {
    if (RestaurantManager.instance === null) {
      RestaurantManager.instance = new RestaurantManager();
    }
    return RestaurantManager.instance;
  }

  public addRestaurant(r: Restaurant): void {
    this.restaurants.push(r);
  }

  public searchByLocation(loc: string): Restaurant[] {
    return this.restaurants.filter(
      (res) => res.location.toLowerCase() === loc.toLowerCase()
    );
  }
}
