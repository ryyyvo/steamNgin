import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, CircularProgress } from '@mui/material';

const API_URL = import.meta.env.VITE_API_URL;

function AppDetails() {
	const { appId } = useParams();
	const [appDetails, setAppDetails] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAppDetails = async () => {
			try {
				const response = await fetch(`${API_URL}/api/steam/appdetails/${appId}`);
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

	return (
    <div>
      <Typography variant="h5">{appDetails.name}</Typography>
      <img src={appDetails.header_image} alt={appDetails.name} style={{ maxWidth: '100%' }} />
      <Typography>{appDetails.short_description}</Typography>
    </div>
	);

}

export default AppDetails;