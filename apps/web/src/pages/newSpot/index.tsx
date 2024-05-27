import axios from 'axios';
import { useState } from 'react';
import { erc721Abi, parseEther } from 'viem';
import { useAccount, useWriteContract } from 'wagmi';

const uploadToIPFS = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(
    'https://ipfs.infura.io:5001/api/v0/add',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );

  return `https://ipfs.infura.io/ipfs/${response.data.Hash}`;
};

const uploadToArweave = async (metadata: any) => {
  const response = await axios.post(
    'https://arweave.net',
    JSON.stringify(metadata),
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  return `https://arweave.net/${response.data.id}`;
};

export default function NewSpotPage() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  const [formValues, setFormValues] = useState({
    description: '',
    image: '',
    lat: '',
    lon: '',
    name: '',
    tags: ''
  });
  const [imagePreview, setImagePreview] = useState('');

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormValues((prevState) => ({
            ...prevState,
            lat: latitude.toString(),
            lon: longitude.toString()
          }));
        },
        (error) => {
          console.error('Error fetching geolocation:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // setFormValues({ ...formValues, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { description, image, lat, lon, name, tags } = formValues;

    // Upload image to IPFS (optional)
    let imageUrl;
    if (image) {
      // imageUrl = await uploadToIPFS(image as File);
    }

    // Create metadata
    const metadata = {
      description,
      image: imageUrl,
      lat,
      lon,
      name,
      tags
    };

    // Upload metadata to Arweave
    const metadataUri = await uploadToArweave(metadata);

    // Mint the NFT
    const contract = '0xYourContractAddress';
    const tx = await writeContract(
      {
        abi: [
          ...erc721Abi,
          {
            inputs: [
              { name: 'description', type: 'string' },
              { name: 'location', type: 'string' },
              { name: 'metadataUri', type: 'string' },
              { name: 'name', type: 'string' }
            ],
            name: 'addSpot',
            type: 'function'
          }
        ],
        address: contract,
        args: [description, `${lat},${lon}`, metadataUri, name],
        functionName: 'addSpot',
        value: parseEther('0.001')
      },
      {
        onSuccess: (hash) => {
          console.log('Transaction hash:', hash);
        }
      }
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-between py-2">
      <div className=" mx-auto flex min-h-screen flex-wrap items-center justify-center gap-4 py-2">
        <form onSubmit={handleSubmit}>
          <div className="mx-auto max-w-md rounded-2xl bg-white shadow-lg dark:bg-gray-950">
            <div className="space-y-4 p-6">
              <div>
                <h2 className="text-2xl font-bold">Create NFT Skate Spot</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Generate an NFT for your favorite skate spot.
                </p>
              </div>
              <div className="space-y-4 border-t border-gray-200 pt-4 dark:border-gray-800">
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    htmlFor="name"
                  >
                    Spot Name
                  </label>
                  <input
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    id="name"
                    name="name"
                    onChange={handleChange}
                    placeholder="Enter spot name"
                    required
                    type="text"
                    value={formValues.name}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <textarea
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    id="description"
                    name="description"
                    onChange={handleChange}
                    placeholder="Describe the spot"
                    required
                    rows={3}
                    value={formValues.description}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      htmlFor="lat"
                    >
                      Latitude
                    </label>
                    <input
                      className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                      id="lat"
                      name="lat"
                      onChange={handleChange}
                      placeholder="Enter latitude"
                      required
                      step="any"
                      type="number"
                      value={formValues.lat}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      htmlFor="lon"
                    >
                      Longitude
                    </label>
                    <input
                      className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                      id="lon"
                      name="lon"
                      onChange={handleChange}
                      placeholder="Enter longitude"
                      required
                      step="any"
                      type="number"
                      value={formValues.lon}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <button
                    className="inline-flex items-center rounded-xl border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-600"
                    onClick={handleGetLocation}
                    type="button"
                  >
                    Get Current Location
                  </button>
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    htmlFor="image"
                  >
                    Spot Image
                  </label>
                  <input
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    id="image"
                    name="image"
                    onChange={handleImageChange}
                    required
                    type="file"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    htmlFor="tags"
                  >
                    Tags
                  </label>
                  <input
                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    id="tags"
                    name="tags"
                    onChange={handleChange}
                    placeholder="Enter relevant tags"
                    required
                    type="text"
                    value={formValues.tags}
                  />
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4 text-right dark:border-gray-800">
                <button
                  className="inline-flex items-center rounded-xl border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-600"
                  type="submit"
                >
                  Generate NFT
                </button>
              </div>
            </div>
          </div>
        </form>
        <div className="mt-6 max-w-md rounded-2xl bg-white shadow-lg dark:bg-gray-950">
          <div className="space-y-4 p-6">
            <div>
              <h2 className="text-2xl font-bold">NFT Skate Spot Preview</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Preview the generated NFT for your skate spot.
              </p>
            </div>
            <div className="space-y-4 border-t border-gray-200 pt-4 dark:border-gray-800">
              <div className="min-h-60">
                {imagePreview ? (
                  <img
                    alt="Skate Spot NFT"
                    className="mx-auto rounded-lg"
                    height={400}
                    src={imagePreview}
                    style={{
                      aspectRatio: '400/400',
                      objectFit: 'cover'
                    }}
                    width={400}
                  />
                ) : null}
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {formValues.name || 'Skate Spot Name'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {formValues.description ||
                    'This is a description of the skate spot NFT.'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Latitude:</p>
                  <p className="font-bold">{formValues.lat || '40.730610'}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Longitude:</p>
                  <p className="font-bold">{formValues.lon || '-73.935242'}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {formValues.tags
                    ? formValues.tags.split(',').map((tag, index) => (
                        <span
                          className="inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                          key={index}
                        >
                          {tag.trim()}
                        </span>
                      ))
                    : 'No tags provided'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
