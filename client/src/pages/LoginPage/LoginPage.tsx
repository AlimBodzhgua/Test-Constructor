import { FC } from 'react';
import { LoginForm } from 'components/Auth/LoginForm';
import { Page } from 'components/UI/Page/Page';

const LoginPage: FC = () => {
	return (
		<Page centered>
			<LoginForm />
		</Page>
	);
};

export default LoginPage;
