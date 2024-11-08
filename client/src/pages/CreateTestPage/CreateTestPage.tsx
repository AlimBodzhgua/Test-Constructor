import { FC, useCallback, useState } from 'react';
import { Box, Button, Heading, useToast } from '@chakra-ui/react';
import { CreateTestForm } from 'components/CreateTestForm/CreateTestForm';
import { AddQuestionForm } from 'components/AddQuestionForm/AddQuestionForm';
import { Page } from 'components/UI/Page/Page';
import { SortableList } from '@/lib/components/SortableList';
import { DragEndEvent } from '@dnd-kit/core';
import { changeListOrder, create24CharId, getQueryParam } from '@/utils/utils';
import { IQuestionForm } from 'types/types';
import { useTestsStore } from '@/store/tests';


const CreateTestPage: FC = () => {
	const [questionsList, setQuestionsList] = useState<IQuestionForm[]>([]);
	const updateQuestions = useTestsStore((state) => state.updateQuestionsOrders);
	const toast = useToast();

	const onAddQuestion = useCallback(() => {
		const testId = getQueryParam('id');
		if (testId.length) {
			setQuestionsList([
				...questionsList,
				{ _id: create24CharId(), order: questionsList.length + 1 },
			]);
		} else {
			toast({
				title: 'Test not created.',
				description: 'First you need to create a test and save it.',
				status: 'info',
				duration: 5000,
				isClosable: true,
				position: 'top-left'
			});
		}
	}, [questionsList]);

	const onRemoveQuestion = useCallback((questionId: string) => {
		const testId = getQueryParam('id');

		const removedQuestion = questionsList.find((question) => question._id === questionId);
		const filteredQuestions = questionsList.filter((question) => question._id !== questionId); 
		const updatedQuestions = filteredQuestions.map((question) => {
			if (question.order > removedQuestion!.order) {
				const updatedQuestion = { ...question, order: question.order - 1 } 

				return updatedQuestion; 
			}
			return question;
		});
	
		updateQuestions(testId, updatedQuestions);
		setQuestionsList(updatedQuestions);
	}, [questionsList]);

	const onQuestionDragEnd = useCallback((e: DragEndEvent) => {
		const { active, over } = e;
		if (active.id !== over!.id) {
			const testId = getQueryParam('id');

			const updatedQuestions = changeListOrder<IQuestionForm>(questionsList, over!.id, active.id)

			updateQuestions(testId, updatedQuestions);
			setQuestionsList(updatedQuestions);
		}
	}, [questionsList]);

	return (
		<Page>
			<Heading m='12px 0'>Сreating a new test</Heading>
			<Box
				display='flex'
				flexDirection='column'
				gap='10px'
				border='1px'
				borderColor='blue.200'
				borderRadius='base'
				w='70%'
				p='20px'
			>
				<CreateTestForm />
				{!!questionsList.length && (
					<SortableList
						items={questionsList.map((question) => question._id)}
						onDragEnd={onQuestionDragEnd}
					>
						{questionsList.map((question) => (
							<AddQuestionForm
								question={question}
								onRemoveQuestion={onRemoveQuestion}
								key={question._id}
							/>
						))}
					</SortableList>
				)}
				<Button onClick={onAddQuestion}>+ Add Question</Button>
			</Box>
		</Page>
	);
};

export default CreateTestPage;
