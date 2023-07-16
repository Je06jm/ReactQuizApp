import { Container, CssBaseline, Typography, LinearProgress, Box, Grid, Button } from '@mui/material';

import NavBar from './navbar';
import React, { useState } from 'react';

import { useParams } from 'react-router-dom';

enum QuizStatus {
    Start,
    Running,
    Finished,
    Error
};

type QuizContext = {
    quizStatus: any,
    questionName: string,
    questionsTotal: number,
    questionsAnswered: number,
    questionChoices: string[],
    questionRight: number,
    questionsCorrect: number,
    quizData: any,

    setQuizStatus: (arg: any)=>void,
    setQuestionName: (arg: string)=>void,
    setQuestionsTotal: (arg: number)=>void,
    setQuestionsAnswered: (arg: number)=>void,
    setQuestionChoices: (arg: string[])=>void,
    setQuestionRight: (arg: number)=>void,
    setQuestionsCorrect: (arg: number)=>void,
    setQuizData: (arg: any)=>void
};

const imageStyle = {
    height: '100%',
    width: 'auto',
};

const buttonStyle = {
    height: '100%'
};

const fetchData = async (id: string) => {
    try {
        const response = await fetch('/quizdata/' + id + '.json');
        const jsonData = await response.json();

        return jsonData;
        
    } catch (error) {
        console.log('Could not load quiz', id + ':', error);
    }
}

const loadQuestion = (num: number, data: any, ctx: QuizContext) => {
    if (!('questions' in data)) return;

    const questions: {[key: string]: any} = data['questions'];
    const question: {[key: string]: any} = questions[num];
    const choices: string[] = question['choices'];

    ctx.setQuestionName(question['questionName']);
    ctx.setQuestionChoices(choices);
    ctx.setQuestionRight(question['answer']);
};

const answerPicked = (choice: number, ctx: QuizContext) => {
    ctx.setQuestionsAnswered(ctx.questionsAnswered+1);

        if (choice === ctx.questionRight) {
            ctx.setQuestionsCorrect(ctx.questionsCorrect+1);
        }

        if ((ctx.questionsAnswered+1) < ctx.questionsTotal) {
            loadQuestion(ctx.questionsAnswered+1, ctx.quizData, ctx);
        } else {
            ctx.setQuizStatus(QuizStatus.Finished);
        }
};

const quizStart = (ctx: QuizContext) => {
    return (
        <Container sx={{display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100vh'}} disableGutters>
            <CssBaseline />
            <NavBar />
            
            <Container sx={{ height: 'calc(100% - var(--nav-bar-height))', justifyContent: 'center'}}>
                <Typography variant='h4' sx={{ height: '7%'}}>
                    {ctx.quizData['quizName']}
                </Typography>

                <Box height='2%' />
                <Container sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '91%'}}>
                    <Container sx={{display: 'flex', height: '50%', justifyContent: 'center', alignContent: 'center'}}>
                        <img src={ctx.quizData['quizPicture']} style={imageStyle} />
                    </Container>
                    <Box height='10%' />
                    <Button variant='contained' sx={{height: '10%'}} onClick={() => ctx.setQuizStatus(QuizStatus.Running)}>Start Quiz</Button>
                </Container>
            </Container>
        </Container>
    );
};

const quizRunning = (ctx: QuizContext) => {
    return (
        <Container sx={{display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100vh'}} disableGutters>
            <CssBaseline />
            <NavBar />

            <Container sx={{ height: 'calc(100% - var(--nav-bar-height))' }}>
                <Container sx={{ height: '20%'}} disableGutters>
                    <Typography variant='h4'>
                        {ctx.questionName}
                    </Typography>

                    <Typography variant='h6'>
                        {ctx.questionsAnswered} / {ctx.questionsTotal}
                    </Typography>
                    <LinearProgress variant='determinate' value={ctx.questionsAnswered / ctx.questionsTotal * 100.0} />
                </Container>
                
                <Box sx={{height: '5%'}} />

                <Container sx={{height: '75%'}} disableGutters>
                    <Container sx={{display: 'flex', justifyContent: 'center', height: '30%'}} disableGutters>
                        <img src={ctx.quizData['quizPicture']} style={imageStyle} />
                    </Container>

                    <Box sx={{height: '5%'}} />

                    <Grid container spacing={1} sx={{height: '65%'}}>
                        <Grid item xs={6}>
                            <Button variant='contained' style={buttonStyle} fullWidth onClick={() => answerPicked(0, ctx) }>{ctx.questionChoices[0]}</Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button variant='contained' style={buttonStyle} fullWidth onClick={() => answerPicked(1, ctx) }>{ctx.questionChoices[1]}</Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button variant='contained' style={buttonStyle} fullWidth onClick={() => answerPicked(2, ctx) }>{ctx.questionChoices[2]}</Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button variant='contained' style={buttonStyle} fullWidth onClick={() => answerPicked(3, ctx) }>{ctx.questionChoices[3]}</Button>
                        </Grid>
                    </Grid>
                </Container>
            </Container>
        </Container>
    );
};

const quizReload = (ctx: QuizContext) => {
    ctx.setQuestionsAnswered(0);
    ctx.setQuestionsCorrect(0);
    ctx.setQuizStatus(QuizStatus.Start);
    
    loadQuestion(0, ctx.quizData, ctx)
}

const quizFinish = (ctx: QuizContext) => {
    return (
        <Container sx={{display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100vh'}} disableGutters>
            <CssBaseline />
            <NavBar />
            
            <Container sx={{display: 'flex', flexDirection: 'column', height: 'calc(100% - var(--nav-bar-height))'}} disableGutters>
                <Box sx={{height: '5%'}} />
                <Container sx={{display: 'flex', height: '15%', justifyContent: 'center'}}>
                    <Typography variant='h4'>
                        {ctx.questionsCorrect >= ctx.quizData['questionsPassing'] ? 'You passed!' : 'You failed!'}
                    </Typography>
                </Container>

                <Container sx={{display: 'flex', flexDirection: 'column', height: '80%'}}>
                    <Typography variant='h6'>
                        {Math.floor(ctx.questionsCorrect / ctx.questionsAnswered * 1000.0) / 10.0}%
                    </Typography>
                    <Button variant='contained' sx={{height: '10%'}} onClick={() => quizReload(ctx)}>Try again</Button>
                    <Box sx={{height: '2%'}} />
                    <Button variant='contained' href='/' sx={{height: '10%'}}>Go home</Button>
                </Container>
            </Container>
        </Container>
    );
};

const quizError = (ctx: QuizContext, idGiven: boolean) => {
    return (
        <Container sx={{display: 'flex', flexDirection: 'column', overflow: 'hidden'}} disableGutters>
            <CssBaseline />
            <NavBar />
            
            <Container sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                <Typography color={'red'}>
                    Could not find quiz{idGiven ? '' : ', no quiz given'}
                </Typography>
                <Button variant='contained' href='/'>Go home</Button>
            </Container>
        </Container>
    );
};

export default function Quiz() {
    const [ quizStatus, setQuizStatus ]: [any, (arg: any)=>void] = useState(QuizStatus.Start);
    const [ questionName, setQuestionName ]: [string, (arg: string)=>void] = useState('INVALID_QUESTION');
    const [ questionsTotal, setQuestionsTotal ]: [number, (arg: number)=>void] = useState(1);
    const [ questionsAnswered, setQuestionsAnswered ]: [number, (arg: number)=>void] = useState(1);
    const [ questionChoices, setQuestionChoices ]: [string[], (arg: string[])=>void] = useState(['A', 'B', 'C', 'D']);
    const [ questionRight, setQuestionRight ]: [number, (arg: number)=>void] = useState(0);
    const [ questionsCorrect, setQuestionsCorrect ]: [number, (arg: number)=>void] = useState(0);
    const [ quizData, setQuizData ]: [any, any] = useState({});

    const ctx: QuizContext = {
        quizStatus: quizStatus,
        questionName: questionName,
        questionsTotal: questionsTotal,
        questionsAnswered: questionsAnswered,
        questionChoices: questionChoices,
        questionRight: questionRight,
        questionsCorrect: questionsCorrect,
        quizData: quizData,

        setQuizStatus: setQuizStatus,
        setQuestionName: setQuestionName,
        setQuestionsTotal: setQuestionsTotal,
        setQuestionsAnswered: setQuestionsAnswered,
        setQuestionChoices: setQuestionChoices,
        setQuestionRight: setQuestionRight,
        setQuestionsCorrect: setQuestionsCorrect,
        setQuizData: setQuizData
    };

    const params = useParams();
    const { id } = params;

    React.useEffect(() => {
        if (id !== undefined) {
            const idStr: string = id as string;

            fetchData(idStr).then((jsonData) => {
                setQuizData(jsonData);

                setQuestionsTotal(jsonData['questionsTotal']);
                setQuestionsAnswered(0);
                setQuestionsCorrect(0);

                loadQuestion(0, jsonData, ctx);

                console.log('Loaded quiz', jsonData['quizName']);
            }).catch((err) => {
                setQuizStatus(QuizStatus.Error);
                console.log('Could not load quiz', err);
            });
        }
    }, [QuizStatus.Error, id, fetchData]);

    if (id === undefined) {
        return quizError(ctx, false);
    }

    switch (quizStatus) {
        case QuizStatus.Start: return quizStart(ctx);
        case QuizStatus.Running: return quizRunning(ctx);
        case QuizStatus.Finished: return quizFinish(ctx);
        default: return quizError(ctx, true);
    }
}