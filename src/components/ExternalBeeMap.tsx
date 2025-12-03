const ExternalBeeMap = () => {
  return (
    <div className="w-full max-w-4xl aspect-[16/9] rounded-lg overflow-hidden shadow">
      <iframe
        src="http://147.175.150.184/"
        className="w-full h-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Bee hives map"
      />
    </div>
  );
};

export default ExternalBeeMap;