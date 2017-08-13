import {sliceIds} from '../src/batchRequest';

test('sliceIds should split array into specified batches', () => {
	let ids: number[] = [];
	for (let i = 1; i <= 400; i++) {
		ids.push(i);
	}

	let batchedIds: number[][] = sliceIds(ids);

	let expectedFirstSlice: number[] = [];
	for (let i = 1; i <= 200; i++) {
		expectedFirstSlice.push(i);
	}

	let expectedSecondSlice: number[] = [];
	for (let i = 201; i <= 400; i++) {
		expectedSecondSlice.push(i);
	}

	expect(batchedIds[0]).toEqual(expectedFirstSlice);
	expect(batchedIds[1]).toEqual(expectedSecondSlice);
	expect(batchedIds).toEqual([expectedFirstSlice, expectedSecondSlice]);
});

test('sliceIds including trailing ids when batching - boundary low', () => {
	let ids: number[] = [];
	for (let i = 1; i <= 401; i++) {
		ids.push(i);
	}

	let batchedIds: number[][] = sliceIds(ids);

	let expectedFirstSlice: number[] = [];
	for (let i = 1; i <= 200; i++) {
		expectedFirstSlice.push(i);
	}

	let expectedSecondSlice: number[] = [];
	for (let i = 201; i <= 400; i++) {
		expectedSecondSlice.push(i);
	}

	let expectedThirdSlice: number[] = [401];

	expect(batchedIds[0]).toEqual(expectedFirstSlice);
	expect(batchedIds[1]).toEqual(expectedSecondSlice);
	expect(batchedIds[2]).toEqual(expectedThirdSlice);
	expect(batchedIds).toEqual([
		expectedFirstSlice,
		expectedSecondSlice,
		expectedThirdSlice,
	]);
});

test('sliceIds including trailing ids when batching - boundary high', () => {
	let ids: number[] = [];
	for (let i = 1; i <= 399; i++) {
		ids.push(i);
	}

	let batchedIds: number[][] = sliceIds(ids);

	let expectedFirstSlice: number[] = [];
	for (let i = 1; i <= 200; i++) {
		expectedFirstSlice.push(i);
	}

	let expectedSecondSlice: number[] = [];
	for (let i = 201; i <= 399; i++) {
		expectedSecondSlice.push(i);
	}

	expect(batchedIds[0]).toEqual(expectedFirstSlice);
	expect(batchedIds[1]).toEqual(expectedSecondSlice);
	expect(batchedIds).toEqual([expectedFirstSlice, expectedSecondSlice]);
});
