type Sticker = {
    text: string,
    numberInImage: number
};

type Image = {
    path: string,
    alt: string
};

type Choice = {
    text: string,
    correct: boolean
};

type OrderedItem = {
    text: string,
    order: number
};


export type DragQuestionData = {
    device: string,
    questionNumber: number,
    kind: string,
    prompt: string,
    image: Image,
    stickers: Sticker[],
    points: number,
    author: string
};

export type OneCorrectQuestionData = {
    device: string,
    questionNumber: number,
    kind: string,
    prompt: string,
    choices: Choice[],
    points: number,
    author: string
};

export type OneCorrectWithImageQuestionData = {
    device: string,
    questionNumber: number,
    kind: string,
    prompt: string,
    image: Image,
    choices: Choice[],
    points: number,
    author: string
};

export type ManyCorrectQuestionData = {
    device: string,
    questionNumber: number,
    kind: string,
    prompt: string,
    choices: Choice[],
    points: number,
    author: string
};

export type OrderQuestionData = {
    device: string,
    questionNumber: number,
    kind: string,
    prompt: string,
    items: OrderedItem[],
    points: number,
    author: string
}

export type OperationAssessmentQuestionData = {
    device: string,
    questionNumber: number,
    kind: string,
    prompt: string,
    tasks: string[],
    points: number,
    author: string
};

export type QuestionData = DragQuestionData | OneCorrectQuestionData | OneCorrectWithImageQuestionData | ManyCorrectQuestionData | OrderQuestionData | OperationAssessmentQuestionData;