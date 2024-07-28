import background from '../Assets/404background.webp';

const NotFound = () => {

    const h1Style = {
        position: 'absolute',
        top: 80,
        width: '100%',
        textAlign: 'center',
    };
    const backgroundStyle = {
        width: '100%',
        height: '100vh',
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    };

    return (
        <div style={backgroundStyle}>
            <h1 style={h1Style}>404 - Not Found!</h1>
        </div>
    );
}

export default NotFound;