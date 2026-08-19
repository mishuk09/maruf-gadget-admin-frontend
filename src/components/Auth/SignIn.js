import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import LoadingSpin from '../utills/LoadingSpin';
import { Grid } from '@mui/material';

const defaultTheme = createTheme();

export default function SignIn() {

    const [showAlert, setShowAlert] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');
    const [alertSeverity, setAlertSeverity] = React.useState('success');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (!email || !password) {
            setShowAlert(true);
            setAlertMessage('Email and password are required.');
            setAlertSeverity('error');

            setTimeout(() => {
                setShowAlert(false);
            }, 2000);

            return;
        }

        const userData = {
            email,
            password,
        };

        try {
            const response = await axios.post('http://localhost:5000/signin', userData);
            console.log(response.data);

            // Save token to localStorage
            localStorage.setItem('token', response.data.token);
            setShowAlert(true);
            setAlertMessage('Login successful!');
            setAlertSeverity('success');
            setEmail('');
            setPassword('');

            setTimeout(() => {
                setShowAlert(false);
                window.location.href = '/'; // Redirect to dashboard or desired page
            }, 500);
        } catch (error) {
            console.error('There was an error!', error);
            setShowAlert(true);
            setAlertMessage('Invalid credentials. Please try again.');
            setAlertSeverity('error');

            setTimeout(() => {
                setShowAlert(false);
            }, 2000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal"
                            required
                            fullWidth
                            id="email" P
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        
                        <Button
                            type="submit"
                            className='h-10'
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {loading ? <LoadingSpin /> : 'Sign In'}
                        </Button>
                        <Grid container>
                          
                        </Grid>
                    </Box>
                    {showAlert && (
                        <div className='absolute transition ease-in-out delay-150 top-0 right-0 mt-16 mr-4'>
                            <Alert severity={alertSeverity}>
                                {alertMessage}
                            </Alert>
                        </div>
                    )}
                </Box>
            </Container>
        </ThemeProvider>
    );
}
