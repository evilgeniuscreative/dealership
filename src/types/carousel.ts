// Carousel specific types
export interface CarouselImageInput {
  imageUrl: string;
  title: string;
  subtitle?: string;
  delay: number;
  displayOrder?: number;
  carousel_type?: string;
  car_id?: number;
}

export interface CarouselImage extends CarouselImageInput {
  id: number;
}
