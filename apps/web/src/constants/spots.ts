// "name": "the bricks",
// "description": "A ledge spot in downtown Oakland, CA. Long straight ledges and a curved ledge.",
// "latitude": 37.8044,
// "longitude": -122.2711,
// "address": "Broadway and 14th St, Oakland, CA 94612",
// "image": "ipfs://QmeXpCqeVJDLmqhuxiz9MvLL3ENNCFFog94H5hKvNEgzSZ",
// "tags": ["ledges", "curved ledge", "manual pad"],
// "id": 1
export interface Spot {
  address: string;
  description: string;
  id: number;
  image: string;
  latitude: number;
  longitude: number;
  name: string;
  tags: string[];
}

export interface SpotNFTData {
  finder: string;
  posts: string[];
  stakeAmount: bigint;
  timestamp: bigint;
  tips: bigint;
  verified: boolean;
}
