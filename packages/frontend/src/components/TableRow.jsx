import { useState } from 'react';
import { TableCell, TableRow as MuiTableRow } from '@mui/material';

const GrayPlaceholder = () => (
  <svg width="120" height="45" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#cccccc" />
  </svg>
);


function GameImage({ appId, gameName }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div style={{ width: '120px', height: '45px', position: 'relative' }}>
      {!imageLoaded && (
        <GrayPlaceholder />
      )}
      <img
        src={`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appId}/capsule_231x87.jpg`}
        alt={`${gameName} header`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '4px',
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: imageLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
        }}
        onLoad={() => setImageLoaded(true)}
        onError={(e) => {
          e.target.onerror = null;
          setImageLoaded(true);
        }}
      />
    </div>
  );
}

function TableRow({ game, index }) {
  return (
    <MuiTableRow>
      <TableCell>{index}.</TableCell>
      <TableCell>
        <GameImage appId={game.appid} gameName={game.name} />
      </TableCell>
      <TableCell component="th" scope="row">
        {game.name}
      </TableCell>
      <TableCell align="right" sx={{ color: '#a3cf06 !important' }}>{game.playerCount.toLocaleString()}</TableCell>
      <TableCell align="right">{game.peak24hr?.value.toLocaleString()}</TableCell>
      <TableCell align="right">{game.peakAllTime?.value.toLocaleString()}</TableCell>
    </MuiTableRow>
  );
}

export default TableRow;