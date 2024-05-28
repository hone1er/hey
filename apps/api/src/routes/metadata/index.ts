import type { Handler } from 'express';

import logger from '@hey/helpers/logger';
import { NodeIrys } from '@irys/sdk';
import { signMetadata } from '@lens-protocol/metadata';
import catchedError from 'src/helpers/catchedError';
import { noBody } from 'src/helpers/responses';
import { privateKeyToAccount } from 'viem/accounts';

export const post: Handler = async (req, res) => {
  const { body } = req;

  if (!body) {
    return noBody(res);
  }

  try {
    const url = 'https://arweave.mainnet.irys.xyz/tx/matic';
    console.log('🚀 ~ constpost:Handler= ~ url:', url);
    const token = 'matic';
    console.log('🚀 ~ constpost:Handler= ~ token:', token);
    const client = new NodeIrys({
      key: process.env.PRIVATE_KEY,
      token,
      url
    });
    console.log('🚀 ~ constpost:Handler= ~ client:', client);

    const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);
    console.log('🚀 ~ constpost:Handler= ~ account:', account);
    const signed = await signMetadata(body, (message) => {
      console.log('🚀 ~ signed ~ body:', body);
      console.log('🚀 ~ constpost:Handler= ~ message:', message);
      return account.signMessage({ message });
    });
    console.log('🚀 ~ constpost:Handler= ~ signed:', signed);

    const receipt = await client.upload(JSON.stringify(signed), {
      tags: [
        { name: 'content-type', value: 'application/json' },
        { name: 'App-Name', value: 'Hey.xyz' }
      ]
    });
    console.log('🚀 ~ receipt ~ receipt:', receipt);

    logger.info(`Uploaded metadata to Irys: ar://${receipt.id}`);

    return res.status(200).json({ id: receipt.id, success: true });
  } catch (error) {
    console.log('🚀 ~ constpost:Handler= ~ error:', error);
    return catchedError(res, error);
  }
};
