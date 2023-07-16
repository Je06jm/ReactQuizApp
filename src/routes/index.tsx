import { CircularProgress, Container, CssBaseline, Typography, Grid, Paper } from '@mui/material';
import NavBar from './navbar';
import React, { useState } from 'react';

interface QuizPreview {
    path: string;
    name: string;
    picture: string;
};

const fetchData = async (path: string) => {
    try {
        const response = await fetch(path);
        const jsonData = await response.json();

        return jsonData;

    } catch (error) {
        return error;
    }
};

const fetchQuizzes = async (setQuizzesTotal: (arg: number) => void) => {
    const quizzes = await fetchData('quizdata.json');
    setQuizzesTotal(quizzes.length);

    let previews: QuizPreview[] = [];

    for (let i = 0; i < quizzes.length; i += 1) {
        const quiz = await fetchData('quizdata/' + quizzes[i] + '.json');

        const preview: QuizPreview = {
            path: quizzes[i],
            name: quiz['quizName'],
            picture: quiz['quizPicture']
        };
        
        previews = [...previews, preview];
    }

    return previews;
};

const loadingQuizzes = () => {
    return <Container sx={{display: 'flex', flexDirection: 'column'}} disableGutters>
        <CssBaseline />
        <NavBar />

        <Container sx={{display: 'flex', height: '92.5vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <CircularProgress />
        </Container>
    </Container>
};

const doneLoading = (quizzesPreviews: QuizPreview[]) => {
    return <Container sx={{display: 'flex', flexDirection: 'column'}} disableGutters>
        <CssBaseline />
        <NavBar />
        <Container>
            <Grid container>
                {quizzesPreviews.map((preview: QuizPreview) => (
                    <Grid item xs={3}>
                        <Paper sx={{display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', alignContent: 'center'}} onClick={() => { window.location.pathname = '/quiz/' + preview.path }}>
                            <img src={preview.picture} alt={preview.name} />
                            <Typography>
                                {preview.name}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Container>
    </Container>
};

export default function Index() {
    const [ quizzesPreviews, setQuizzesPreviews ]: [any, (arg: any)=>void] = useState([])
    const [ quizzesTotal, setQuizzesTotal ]: [number, (arg: number)=>void] = useState(0);

    React.useEffect(() => {
        fetchQuizzes(setQuizzesTotal).then(setQuizzesPreviews);
    }, [fetchQuizzes]);

    if (quizzesPreviews.length === quizzesTotal && quizzesTotal !== 0) return doneLoading(quizzesPreviews);
    return loadingQuizzes();
}