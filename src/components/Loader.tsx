import ClipLoader from 'react-spinners/ClipLoader';

function Loader() {
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  };

  return (
    <div style={containerStyle}>
      <ClipLoader
        color="#bb9d55"
        loading={true}
        size={130}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}

export default Loader;
