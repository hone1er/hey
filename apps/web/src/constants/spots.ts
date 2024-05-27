export interface Spot {
  coordinates: [number, number];
  description: string;
  image: string;
  location: string;
  name: string;
}

export const SPOTS: Spot[] = [
  {
    coordinates: [37.78057, -122.44641],
    description:
      "The Wallenberg 4 block is one of the most famous skate spots in the world. It's been featured in countless skate videos and is a proving ground for skaters of all levels.",
    image: '/images/wallenberg.jpg',
    location: 'San Francisco, CA',
    name: 'Wallenberg'
  },
  {
    coordinates: [37.7947, -122.39447],
    description:
      "The Embarcadero is a legendary skate spot in San Francisco. It's known for its iconic ledges, stairs, and manual pads, and has been featured in numerous skate videos.",
    image: '/images/embarcadero.jpg',
    location: 'San Francisco, CA',
    name: 'Embarcadero'
  },
  {
    coordinates: [37.79872, -122.39671],
    description:
      "Pier 7 is a famous skate spot in San Francisco. It's known for its iconic manual pads and has been featured in numerous skate videos.",
    image: '/images/pier7.jpg',
    location: 'San Francisco, CA',
    name: 'Pier 7'
  },
  {
    coordinates: [40.41578, -3.69677],
    description:
      "The Congresso is a famous skate spot in Madrid. It's known for its iconic ledges and has been featured in numerous skate videos.",
    image: '/images/congresso.jpg',
    location: 'Madrid, Spain',
    name: 'Congresso'
  },
  {
    coordinates: [41.38331, 2.16678],
    description:
      "MACBA is a famous skate spot in Barcelona. It's known for its iconic ledges and has been featured in numerous skate videos.",
    image: '/images/macba.jpg',
    location: 'Barcelona, Spain',
    name: 'MACBA'
  },
  {
    coordinates: [39.95407, -75.16522],
    description:
      "Love Park is a famous skate spot in Philadelphia. It's known for its iconic ledges and has been featured in numerous skate videos.",
    image: '/images/lovepark.jpg',
    location: 'Philadelphia, PA',
    name: 'Love Park'
  },
  {
    coordinates: [45.52335, -122.67523],
    description:
      "Burnside is a famous skate spot in Portland. It's known for its iconic bowls and has been featured in numerous skate videos.",
    image: '/images/burnside.jpg',
    location: 'Portland, OR',
    name: 'Burnside'
  },
  {
    coordinates: [51.50632, -0.11615],
    description:
      "Southbank is a famous skate spot in London. It's known for its iconic ledges and has been featured in numerous skate videos.",
    image: '/images/southbank.jpg',
    location: 'London, UK',
    name: 'Southbank'
  },
  {
    coordinates: [47.655548, -122.3032],
    description:
      "The University of Washington is a famous skate spot in Seattle. It's known for its iconic ledges and has been featured in numerous skate videos.",
    image: '/images/uw.jpg',
    location: 'Seattle, WA',
    name: 'University of Washington'
  }
];
