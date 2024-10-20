import { IAnswer } from '@/types/types';
import { Box, Flex, Radio, RadioGroup } from '@chakra-ui/react';
import { FC, memo } from 'react';

interface RadioButtonQuestionProps {
	answers: IAnswer[];
}

// OneAnswer
export const RadioButtonQuestion: FC<RadioButtonQuestionProps> = memo(({answers}) => {

	const onChange = (value: string) => {
		console.log(value);
	}

	return (
		<Box pl='16px'>
			<RadioGroup onChange={onChange} name='oneAnswer'>
				<Flex direction='column'>
					{answers.map((answer) => (
						<Radio
							value={JSON.stringify(answer.isCorrect)}
							key={answer._id}
						>
							{answer.value}
						</Radio>
					))}
				</Flex>
			</RadioGroup>
		</Box>
	)
})