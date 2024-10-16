import $axios from '@/api/axios';
import { ITest } from 'types/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface TestState {
	tests: ITest[];
	isLoading: boolean;
	error?: string | undefined;
}

interface TestAction {
	getTests: () => Promise<void>;
	createTest: (title: string) => Promise<void>;
	removeTest: (testId: string) => void;
}

export const useTestsStore = create<TestState & TestAction>()(
	devtools((set) => ({
		tests: [],
		isLoading: false,
		error: undefined,

		getTests: async () => {
			set({ isLoading: true }, false, 'getTestsLoading');
			try {
				const response = await $axios.get('tests');
				set({ tests: response.data }, false, 'getTests');
			} catch (err) {
				set({ error: JSON.stringify(err) }, false, 'getTestsError');
			} finally {
				set({ isLoading: false });
			}
		},

		createTest: async (title: string) => {
			set({ isLoading: true }, false, 'createTestLoading');
			try {
				const response = await $axios.post('tests', { title });
				set((state) => ({ tests: [...state.tests, response.data] }), false, 'createTest');
			} catch (err) {
				set({ error: JSON.stringify(err) }, false, 'createTestError');
			} finally {
				set({ isLoading: true });
			}
		},

		removeTest: (testId: string) => {
			set({ isLoading: true }, false, 'removeTestLoading');
			try {
				$axios.delete(`/tests/${testId}`);
			} catch (err) {
				set({ error: JSON.stringify(err) }, false, 'removeTestError');
			} finally {
				set({ isLoading: true });
			}
		},
	})),
);
