import { IAnswer } from '@/types/types';
import { List } from '@chakra-ui/react';
import { FC, memo } from 'react';
import { AnswersItem } from './AnswersItem';
import { useCurrentTest } from '@/store/currentTest';

interface AnswerListProps {
	answers: IAnswer[];
}

export const AnswersList: FC<AnswerListProps> = memo(({answers}) => {
	const isLoading = useCurrentTest((state) => state.isLoading);

	if (isLoading) {
		return <h1>Loading...</h1>
	}

	return (
		<List>
			{answers.length && answers.map((answer) => (
				<AnswersItem answer={answer} key={answer._id}/>
			))}
		</List>
	)
});
