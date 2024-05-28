import Publications from '@components/Search/Publications';
import { GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import cn from '@hey/ui/cn';
import dynamic from 'next/dynamic';
import { DM_Sans } from 'next/font/google';
import { useEffect, useMemo, useState } from 'react';
import { SPOT_NFT_ABI } from 'src/constants';
import { type Spot, type SpotNFTData } from 'src/constants/spots';
import { polygonAmoy } from 'viem/chains';
import { useConfig, useReadContracts } from 'wagmi';
const anton = DM_Sans({ subsets: ['latin'], weight: '400' });

export default function SpotsPage() {
  const [currentPosition, setCurrentPosition] = useState<Spot>({
    address: 'Broadway and 14th St, Oakland, CA 94612',
    description:
      'A ledge spot in downtown Oakland, CA. Long straight ledges and a curved ledge.',
    id: 1,
    image: 'ipfs://QmeXpCqeVJDLmqhuxiz9MvLL3ENNCFFog94H5hKvNEgzSZ',
    latitude: 37.8044,
    longitude: -122.2711,
    name: 'the bricks',
    tags: ['ledges', 'curved ledge', 'manual pad']
  });
  const [spotQuery, setSpotQuery] = useState(['skateboarding']);
  const [currentSpotId, setCurrentSpotId] = useState<null | number>(null);
  const [spotMetadata, setSpotMetadata] = useState<Spot[]>([]);
  console.log('🚀 ~ SpotsPage ~ spotMetadata:', spotMetadata);
  const config = useConfig();

  const { data: spotIds } = useReadContracts({
    config: { ...config, chains: [polygonAmoy] },
    contracts: [
      {
        abi: SPOT_NFT_ABI,
        address: '0x6eDFd9699EacfFa7B4E5b2b1b740a7582C1f2273',
        functionName: 'getAllSpotIds'
      }
    ]
  });

  const spotIdsArray = spotIds?.[0]?.result as number[];

  const { data: spotData } = useReadContracts({
    contracts: spotIdsArray?.map((id) => ({
      abi: SPOT_NFT_ABI as any,
      address: '0x6eDFd9699EacfFa7B4E5b2b1b740a7582C1f2273' as `0x${string}`,
      args: [id],
      functionName: 'getSpot'
    }))
  });

  console.log('🚀 ~ SpotsPage ~ spotData:', spotData);
  const { data: tokenURIs } = useReadContracts({
    contracts: spotIdsArray?.map((id) => ({
      abi: SPOT_NFT_ABI as any,
      address: '0x6eDFd9699EacfFa7B4E5b2b1b740a7582C1f2273' as `0x${string}`,
      args: [id],
      functionName: 'tokenURI'
    }))
  });

  console.log('🚀 ~ SpotsPage ~ tokenURIs:', tokenURIs);
  useEffect(() => {
    if (tokenURIs && tokenURIs.length > 0) {
      const fetchMetadata = async () => {
        try {
          const metadataPromises = tokenURIs.map(async (uri) => {
            const ipfsHash = (uri.result as string).split('ipfs://')[1];
            console.log('🚀 ~ metadataPromises ~ ipfsHash:', ipfsHash);
            const fetchUrl = `https://ipfs.io/ipfs/${ipfsHash}?filename=spot_metadata.json`;
            // const helia = await createHelia();
            // const j = json(helia);
            // const data = await j.get(ipfsHash);
            // console.log('🚀 ~ metadataPromises ~ data:', data);
            console.log('Fetching URL:', fetchUrl);
            const response = await fetch(fetchUrl, {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
              referrerPolicy: 'no-referrer-when-downgrade' // or 'origin-when-cross-origin'
            });

            // Check if response is okay
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Try to parse JSON response
            try {
              const data = await response.json();
              console.log('Fetched metadata:', data);
              return data;
            } catch (jsonError) {
              console.error('Error parsing JSON:', jsonError);
              return null;
            }
          });

          // Wait for all promises to settle
          const metadata = await Promise.allSettled(metadataPromises);
          const filteredMetadata = metadata
            .filter(
              (result) => result.status === 'fulfilled' && result.value !== null
            )
            // @ts-ignore
            .map((result) => result.value);

          console.log('Filtered metadata:', filteredMetadata);
          setSpotMetadata(filteredMetadata as Spot[]);
        } catch (error) {
          console.error('Error fetching token URIs:', error);
        }
      };

      fetchMetadata();
    }
  }, [tokenURIs]);

  const Map = useMemo(
    () =>
      dynamic(() => import('@components/SkateLens/Map'), {
        loading: () => <p className="place-self-center">...loading</p>,
        ssr: true
      }),
    [currentPosition]
  );

  return (
    <GridLayout className={anton.className}>
      <GridItemEight className="space-y-5">
        {/* @ts-ignore */}
        <Publications query={spotQuery as string} />
      </GridItemEight>
      <GridItemFour>
        <div className="sticky top-10">
          <div className="relative z-40 h-96  w-80 min-w-80 px-4 transition-all duration-300 hover:scale-105">
            <Map
              onClick={(spot: Spot) => {
                setCurrentPosition(spot);
                setSpotQuery(
                  (spotData?.[spot?.id - 1]?.result as SpotNFTData)
                    ?.posts as string[]
                );
              }}
              position={[currentPosition?.latitude, currentPosition?.longitude]}
              spots={spotMetadata ?? []}
              zoom={15}
            />
          </div>
          <div className="relative z-50 flex flex-col  gap-2 rounded-xl ">
            <h1
              className={cn(
                'mt-4 text-center text-3xl font-bold',
                anton.className
              )}
            >
              SKATE SPOTS
            </h1>

            <div
              className={cn(
                'grid max-h-[400px] w-[27vw]  min-w-[420px] grid-cols-1 gap-2 overflow-scroll p-8  px-4 pt-0',
                anton.className
              )}
            >
              {spotMetadata?.map((spot: Spot, index) => (
                <button
                  className={cn(
                    `${currentSpotId === index ? 'h-[200px]' : 'h-fit'} w-full rounded-xl border bg-gray-50 p-4 shadow-xl transition-all duration-300 hover:scale-[1.05] hover:bg-gray-100 hover:shadow-2xl`,
                    anton.className
                  )}
                  key={index}
                  onClick={() => {
                    setCurrentPosition(spot);
                    // @ts-ignore
                    setSpotQuery(spotData[index].result.posts);
                    setCurrentSpotId(index);
                  }}
                >
                  <div className="flex h-10 w-full flex-col justify-center gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <h2 className="text-xl font-bold ">{spot?.name}</h2>
                    </div>
                    {currentSpotId === index ? (
                      <p className="whitespace-break-spaces ">
                        {spot.description}
                      </p>
                    ) : null}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </GridItemFour>
    </GridLayout>
  );
}
