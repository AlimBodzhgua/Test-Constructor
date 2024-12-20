import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { IUser } from 'types/types';
import { AUTH_LOCALSTORAGE_KEY } from '@/constants/localStorage';
import $axios from '@/api/axios';

interface UserState {
	user: IUser | null;
	_mounted: boolean;

	isLoading: boolean;
	error?: string | undefined;
}

interface UserAction {
	login: (email: string, password: string) => Promise<void>;
	register: (email: string, password: string) => Promise<void>;
	logout: () => void;
	initUser: () => void;
}

export const useUserStore = create<UserAction & UserState>()(
	devtools((set) => ({
		user: null,
		isLoading: false,
		error: undefined,
		_mounted: false,

		logout: () => {
			set({ user: null, error: undefined, isLoading: false }, false, 'logout');
			localStorage.removeItem(AUTH_LOCALSTORAGE_KEY);
		},

		initUser: async () => {
			set({ isLoading: true }, false, 'initUserLoading');

			try {
				const response = await $axios.get<IUser>('/users/auth/me');

				const user = {
					_id: response.data._id,
					email: response.data.email,
					token: response.data.token,
				};

				localStorage.setItem(AUTH_LOCALSTORAGE_KEY, user.token);

				set({ user: user, error: undefined }, false, 'initUser');
			} catch (err) {
				set({ error: JSON.stringify(err) });
			} finally {
				set({ isLoading: false, _mounted: true });
			}
		},

		login: async (email, password) => {
			set({ isLoading: true }, false, 'loginLoading');

			try {
				const response = await $axios.post<IUser>('/users/login', { email, password });
				const user = {
					_id: response.data._id,
					email: response.data.email,
					token: response.data.token,
				};

				localStorage.setItem(AUTH_LOCALSTORAGE_KEY, user.token);

				set({ user, error: undefined }, false, 'login');
				window.location.replace('/');
			} catch (err) {
				set({ error: JSON.stringify(err) }, false, 'loginError');
			} finally {
				set({ isLoading: false });
			}
		},

		register: async (email, password) => {
			set({ isLoading: true }, false, 'registerLoading');

			try {
				const response = await $axios.post<IUser>('/users/registration', {
					email,
					password,
				});

				const user = {
					_id: response.data._id,
					email: response.data.email,
					token: response.data.token,
				};

				localStorage.setItem(AUTH_LOCALSTORAGE_KEY, user.token);

				set({ user: user, error: undefined }, false, 'register');
				window.location.replace('/');
			} catch (err) {
				set({ error: JSON.stringify(err) }, false, 'registerError');
			} finally {
				set({ isLoading: false });
			}
		},
	})),
);
