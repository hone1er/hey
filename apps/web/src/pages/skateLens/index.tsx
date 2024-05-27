import Publications from '@components/Search/Publications';
import { GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import cn from '@hey/ui/cn';
import dynamic from 'next/dynamic';
import { DM_Sans } from 'next/font/google';
import React, { useMemo, useState } from 'react';
import { type Spot, SPOTS } from 'src/constants/spots';

const anton = DM_Sans({ subsets: ['latin'], weight: '400' });

export default function SpotsPage() {
  const [currentPosition, setCurrentPosition] = useState(SPOTS[0]);
  const [spotQuery, setSpotQuery] = useState('skateboarding');
  const [currentSpotId, setCurrentSpotId] = useState<null | number>(null);

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
        <Publications query={spotQuery as string} />
      </GridItemEight>
      <GridItemFour>
        <div className="sticky top-10">
          <div className="relative z-40 h-96  w-80 min-w-80 px-4 transition-all duration-300 hover:scale-105">
            <Map
              onClick={(spot: Spot) => {
                setCurrentPosition(spot);
                setSpotQuery(spot.name);
              }}
              position={currentPosition?.coordinates}
              spots={SPOTS}
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
              {SPOTS.map((spot, index) => (
                <button
                  className={cn(
                    `${currentSpotId === index ? 'h-[200px]' : 'h-fit'} w-full rounded-xl border bg-gray-50 p-4 shadow-xl transition-all duration-300 hover:scale-[1.05] hover:bg-gray-100 hover:shadow-2xl`,
                    anton.className
                  )}
                  key={index}
                  onClick={() => {
                    setCurrentPosition(spot);
                    setSpotQuery(spot.name);
                    setCurrentSpotId(index);
                  }}
                >
                  <div className="flex h-10 w-full flex-col justify-center gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <h2 className="text-xl font-bold ">{spot.name}</h2>
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
