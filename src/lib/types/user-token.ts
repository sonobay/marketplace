import type { BigNumber } from 'ethers';
import type { IPFSMetadata } from './ipfs-metadata';

export interface UserToken {
	id: number;
	balance: BigNumber;
	metadata?: IPFSMetadata;
}
