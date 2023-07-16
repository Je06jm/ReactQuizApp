import { AppBar, Container, CssBaseline, Toolbar, Link } from '@mui/material';
import React from 'react';

export default function NavBar() {
    const appBarRef = React.useRef(null);

    React.useEffect(() => {
        if (appBarRef.current != null) {
            const appBar: HTMLElement = appBarRef.current;
            const appBarHeight = appBar.clientHeight;
            document.documentElement.style.setProperty('--nav-bar-height', appBarHeight.toString() + 'px');
        }
    }, []);

    return (
        <Container sx={{display: 'flex', flexDirection: 'column'}} disableGutters>
            <CssBaseline />

            <AppBar position='static' color='primary' ref={appBarRef}>
                <Toolbar>
                    <Link href='/' color='primary.contrastText'>Home</Link>
                </Toolbar>
            </AppBar>
            
        </Container>
    )
}