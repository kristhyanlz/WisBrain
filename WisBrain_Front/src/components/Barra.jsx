import React, {useState, useEffect} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { DarkModeOutlined as DarkModeIcon, LightMode as LightModeIcon } from '@mui/icons-material';
import PsychologyIcon  from '../assets/logo.png';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useNavigate, useLocation } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BRAND_NAME = ''//'WisBrain';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const negrita = { fontWeight: 'bold' }

const pages = [
  {text: 'Historial', link:'/Pacientes'},
  {text: 'Ficha S.', link: '/FichaSociodemografica'},
  {text: 'Test', link: '/Test'},
  {text: 'Resultados', link:'/Resultados'},
  
];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function Barra( {children}) {
  const location = useLocation();
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [testEnable, setTestEnable] = useState(false);

  useEffect(() => {
    setTestEnable(localStorage.getItem('testEnable') === 'true')
  }, [location.pathname])

  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleClickPages = (link) => {
    handleCloseNavMenu()
    navigate(link)
  }

  //<ThemeProvider theme={darkTheme}>
  return (
    <ThemeProvider theme={ (currentTheme == 'dark') ? darkTheme: lightTheme}>
      <CssBaseline />
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display:{xs: 'none', md:'flex'} }}>
            <img src={PsychologyIcon} width={80} style={{paddingRight:10}} />
          </Box>
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {
              BRAND_NAME
              //Modo grande
            }
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {//Estrecho, flotante
                pages.map((ele) => {
                  const isActive = ele.link == location.pathname;
                  return (
                    <MenuItem key={ele.text} disabled={ele.link == '/Test' && !testEnable} onClick={() => { handleClickPages(ele.link)}}>
                      <Typography textAlign="center" fontWeight={isActive?"bold":"regular"} fontSize={isActive?18:"default"}>{ele.text}</Typography>
                    </MenuItem>
                  )
                })
              }
            </Menu>
          </Box>
          <Box sx={{ display: {xs:'flex', md:'none'} }}>
            <img src={PsychologyIcon} width={90} style={{paddingRight:10}} />
          </Box>
          <Typography
            variant="h5"
            noWrap
            onClick={() => navigate("/")}
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {
              BRAND_NAME
              //Modo pequeño
            }
          </Typography>
          <Grid container justifyContent="center" alignItems="center" sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {//Fullscreen
              pages.map((ele) => {
                const isActive = ele.link == location.pathname;
                return (
                <Grid item key={ele.text} style={{textAlign: 'center'}}>
                  <Button
                    disabled={(ele.link == '/Test' && !testEnable) || (ele.link == '/FichaSociodemografica' && testEnable)}
                    onClick={() => { handleClickPages(ele.link)}}
                    sx={{ my: 2, color: 'white', display: 'block', fontWeight:isActive?"bold":"regular", fontSize:isActive?18:'default'}}
                  >
                    {ele.text}
                  </Button>
                </Grid>
                )
              })
            }
          </Grid>
            
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Cambiar tema " >
              <IconButton sx={{ my: 2, color: 'white', display: 'block' }} onClick={ (event) => {
                if(currentTheme == 'dark'){
                  setCurrentTheme('light');
                }else{
                  setCurrentTheme('dark');
                }
              }}>
              {
                (currentTheme == 'dark') ? <LightModeIcon /> : <DarkModeIcon />
              }
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
    {children}
    <ToastContainer />
    </ThemeProvider>
  );
}
export default Barra;
