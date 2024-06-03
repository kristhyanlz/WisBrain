import { Button, Container, Box } from '@mui/material';
import React, {useState} from 'react';

import correctoAudio from  '../assets/correcto.mp3'
import incorrectoAudio from '../assets/incorrecto.mp3'

export default function Pruebas(){
  const [correctoPlayer] = useState(new Audio( correctoAudio ))
  const [incorrectoPlayer] = useState(new Audio( incorrectoAudio ))

  return (
    <Container>
      <Box>
        <Button onClick={ () => {
          correctoPlayer.play()
        }}>
          Correcto!
        </Button>
      </Box>
      <Box>
        <Button onClick={ () => {
          incorrectoPlayer.play()
        }

        }>
          Incorrecto
        </Button>
      </Box>
    </Container>

  )
}