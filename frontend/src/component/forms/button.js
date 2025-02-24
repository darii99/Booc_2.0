import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function BasicButtons( { label, sx, onClick } ) {
  return (
    <Stack spacing={2} direction="row">
      <Button variant="outlined" sx={sx} onClick={onClick}> 
        
        {label} 
      
      </Button>
    </Stack>
  );
}
