const MediaHeader = ({ backdropPath, title, onImageError }) => {
  return (
    <div className="relative h-[50vh] md:h-[70vh] w-full -mt-24 md:-mt-16">
      <img
        src={backdropPath}
        alt={`${title} backdrop`}
        className="w-full h-full object-cover object-center"
        onError={onImageError}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/60 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-brand-bg/70 via-brand-bg/30 to-transparent md:w-2/3"></div>
    </div>
  );
};

export default MediaHeader;