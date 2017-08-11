import * as got from 'got';

import {API} from './api';

const MAX_NUM_OF_IDS_PER_REQ = 200;

export function sliceIds(ids: number[]): number[][] {
	let batchedIds: number[][] = [[]];

	let batchIndex = 0;
	// Slice ids array into MAX_NUM_OF_IDS_PER_REQ pieces and collect pieces in batchedIds
	for (let startIndex = 0; startIndex < ids.length; startIndex += MAX_NUM_OF_IDS_PER_REQ) {
		batchedIds[batchIndex] = ids.slice(
			startIndex,
			startIndex + MAX_NUM_OF_IDS_PER_REQ
		);
		batchIndex++;
	}

	return batchedIds;
}

export function batchRequest(ids: number[], apiRequest: () => void) {
	if (ids.length > MAX_NUM_OF_IDS_PER_REQ) {
		let batchedIds: number[][] = sliceIds(ids);
	}
}
