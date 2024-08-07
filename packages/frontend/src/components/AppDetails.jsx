import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, CircularProgress, TableHead, TableBody, TableRow } from '@mui/material';
import { StyledPaper, StyledTable, StyledTableCell, StyledTableCellHeader, StyledTableCellContent, StyledTableRow, HeaderImage, AppTitle } from '../styles/AppDetails.style';

const API_URL = import.meta.env.VITE_API_URL;

function AppDetails() {
	const { appId } = useParams();
	const [appDetails, setAppDetails] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAppDetails = async () => {
			try {
				const response = await fetch(`${API_URL}/api/steam/appdetails/${appId}?language=english`);
				const data = await response.json();
				setAppDetails(data[appId].data);
			}
			catch (error) {
				console.error('Error fetching app details:', error);
			}
			finally {
				setLoading(false)
			}
		};

		fetchAppDetails();
	}, [appId]);

	if (loading) {
		return <CircularProgress/>;
	}

	if (!appDetails) {
		return <Typography>No app details available</Typography>;
	}

  const detailsData = [
    { field: 'Name', value: appDetails.name },
    { field: 'App ID', value: appDetails.steam_appid },
    { field: 'Short Description', value: appDetails.short_description },
    { field: 'Developers', value: appDetails.developers ? appDetails.developers.join(', ') : 'N/A' },
    { field: 'Publishers', value: appDetails.publishers ? appDetails.publishers.join(', ') : 'N/A' },
    { field: 'Price', value: appDetails.price_overview ? `${appDetails.price_overview.final_formatted}` : 'Free to Play' },
    { field: 'Platforms', value: 
      Object.entries(appDetails.platforms)
        .filter(([_, value]) => value)
        .map(([key, _]) => key.charAt(0).toUpperCase() + key.slice(1))
        .join(', ')
    },
    { field: 'Categories', value: appDetails.categories ? appDetails.categories.map(cat => cat.description).join(', ') : 'N/A' },
    { field: 'Genres', value: appDetails.genres ? appDetails.genres.map(genre => genre.description).join(', ') : 'N/A' },
    { field: 'Release Date', value: appDetails.release_date ? appDetails.release_date.date : 'N/A' },
  ];

  return (
    <StyledPaper>
      <AppTitle>{appDetails.name}</AppTitle>
      <HeaderImage src={appDetails.header_image} alt={appDetails.name} />
      <StyledTable>
        <TableBody>
          {detailsData.map((row, index) => (
            <StyledTableRow key={index}>
              <StyledTableCellHeader>
                {row.field}
              </StyledTableCellHeader>
              <StyledTableCellContent>
                {row.value}
              </StyledTableCellContent>
            </StyledTableRow>
          ))}
        </TableBody>
      </StyledTable>
    </StyledPaper>
  );

}

export default AppDetails;