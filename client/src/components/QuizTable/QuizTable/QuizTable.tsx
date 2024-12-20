import { FC, memo, useEffect } from 'react';
import {
	Card,
	CardBody,
	Heading,
	Table,
	TableContainer,
	Tbody,
} from '@chakra-ui/react';
import { useQuizzesStore } from 'store/quizzes';
import { useSearchParams } from 'react-router-dom';
import { sortQuizzes } from '@/utils/utils';
import { SortDirectionType, SortFieldType } from 'types/sort';
import { useUserStore } from 'store/user';
import { QuizTableRow } from './QuizTableRow';
import { TableHeader } from '../TableHeader/TableHeader';
import { TableSkeleton } from '../TableSkeleton';

export const QuizTable: FC = memo(() => {
	const sortedAndFilteredQuizzes = useQuizzesStore((state) => state.sortedAndFilteredQuizzes);
	const isLoading = useQuizzesStore((state) => state.isLoading);
	const userId = useUserStore((state) => state.user?._id);
	const getUserQuizzes = useQuizzesStore((state) => state.getUserQuizzes);
	const setSortedAndFilteredQuizzes = useQuizzesStore((state) => state.setSortedAndFilteredQuizzes);
	const [searchParams] = useSearchParams();

	useEffect(() => {
		fetchQuizzesAndSort();
	}, []);

	const fetchQuizzesAndSort = async () => {
		const quizzes = await getUserQuizzes(userId!);

		if (searchParams.has('field') || searchParams.has('sort')) {
			const sortValue = searchParams.get('field') as SortFieldType || 'date';
			const sortDirection = searchParams.get('sort') as SortDirectionType;
			const sortedQuizzes = sortQuizzes(quizzes, sortValue, sortDirection);
			setSortedAndFilteredQuizzes(sortedQuizzes);
		}
	}

	if (isLoading) {
		return <TableSkeleton />
	}

	if (!sortedAndFilteredQuizzes.length) {
		return (
			<Card align='center'>
				<CardBody>
					<Heading size='md'>You have not quizzes yet</Heading>
				</CardBody>
			</Card>
		);
	}

	return (
		<TableContainer border='1px solid black' borderRadius='12px' borderColor='#E2E8F0'>
			<Table>
				<TableHeader />
				<Tbody>
					{sortedAndFilteredQuizzes.map((quiz) => (
						<QuizTableRow quiz={quiz} key={quiz._id} />
					))}
				</Tbody>
			</Table>
		</TableContainer>
	);
});
