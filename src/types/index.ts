export interface Attraction {
  id: number;
  name: string;
  description: string;
  location: string;
  rating: number;
  image_url: string;
}

export interface Review {
  id: number;
  attraction_id: number;
  user_name: string;
  comment: string;
  rating: number;
  created_at: string;
}
