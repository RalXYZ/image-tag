import * as React from 'react';
import Avatar from '@mui/material/Avatar';

const ColorfulAvatar: React.FC<{name: string}> = (props: {name: string}) => {

  function stringToColor(string: string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.substr(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }

  return (
    <Avatar sx={{ bgcolor: stringToColor(props.name) }}>{props.name.slice(0, 2)}</Avatar>
  );
}

export default ColorfulAvatar;
